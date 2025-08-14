import { createServerClient } from '@supabase/ssr';
import { type Handle, redirect } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
// import * as amp from '@sveltejs/amp';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

const supabase: Handle = async ({ event, resolve }) => {
	/**
	 * Creates a Supabase client specific to this server request.
	 *
	 * The Supabase client gets the Auth token from the request cookies.
	 */
	event.locals.supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
		cookies: {
			getAll: () => event.cookies.getAll(),
			/**
			 * SvelteKit's cookies API requires `path` to be explicitly set in
			 * the cookie options. Setting `path` to `/` replicates previous/
			 * standard behavior.
			 */
			setAll: (cookiesToSet) => {
				cookiesToSet.forEach(({ name, value, options }) => {
					event.cookies.set(name, value, { ...options, path: '/' });
				});
			}
		}
	});

	/**
	 * Unlike `supabase.auth.getSession()`, which returns the session _without_
	 * validating the JWT, this function also calls `getUser()` to validate the
	 * JWT before returning the session.
	 */
	event.locals.safeGetSession = async () => {
		const {
			data: { session }
		} = await event.locals.supabase.auth.getSession();
		if (!session) {
			return { session: null, user: null };
		}

		const {
			data: { user },
			error
		} = await event.locals.supabase.auth.getUser();
		if (error) {
			// JWT validation has failed
			return { session: null, user: null };
		}
		// Ambil data profil pengguna dari tabel 'profiles'
		const { data: profile, error: profileError } = await event.locals.supabase
			.from('profiles')
			.select('role')
			.eq('user_id', user?.id)
			.single();

		// if (profileError) {
		// 	console.error('Gagal mengambil profil pengguna:', profileError);
		// 	return { session, user };
		// }
		// Tambahkan peran (role) ke metadata pengguna
		const { data, error: updateError } = await event.locals.supabase.auth.updateUser({
			data: {
				...user?.user_metadata,
				role: profile?.role
			}
		});
		return { session, user };
	};

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			/**
			 * Supabase libraries use the `content-range` and `x-supabase-api-version`
			 * headers, so we need to tell SvelteKit to pass it through.
			 */
			return name === 'content-range' || name === 'x-supabase-api-version';
		}
	});
};

const authGuard: Handle = async ({ event, resolve }) => {
	const { session, user } = await event.locals.safeGetSession();
	event.locals.session = session;
	event.locals.user = user;
	const routeId = event.route.id ?? '';
	const pathname = event.url.pathname;
	const role = session?.user?.user_metadata?.role;

	// const role = user?.user_metadata?.role;
	// 1. Guest-only routes: /login, /register
	if (session && ['/login', '/register'].includes(pathname)) {
		throw redirect(303, '/');
	}

	// 2. Admin-only routes
	const isAdminRoute = routeId?.startsWith('/(admin)');
	if (isAdminRoute) {
		if (!session) throw redirect(303, '/login');
		if (role !== 'admin') throw redirect(303, '/error');
	}

	// 3. User-only routes
	const isUserRoute = routeId?.startsWith('/(app)');
	if (isUserRoute) {
		if (!session) throw redirect(303, '/login');
		if (role !== 'user') throw redirect(303, '/error');
	}
	return resolve(event);
};

// const seoTransformHandle: Handle = async ({ event, resolve }) => {
// 	let buffer = '';

// 	return await resolve(event, {
// 		transformPageChunk: ({ html, done }) => {
// 			buffer += html;
// 			if (done) return amp.transform(buffer);
// 		}
// 	});
// };
export const handle: Handle = sequence(supabase, authGuard);
