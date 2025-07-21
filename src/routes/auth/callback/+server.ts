import { ensureProfile } from '$lib/utils/ensureProfiles';
import { redirect, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url, locals: { supabase } }) => {
	const code = url.searchParams.get('code');

	if (code) {
		const { error } = await supabase.auth.exchangeCodeForSession(code);
		if (error) {
			console.error('Error exchanging code for session:', error.message);
			return new Response('Authentication error', { status: 500 });
		}
	}
	const sessionData = await supabase.auth.getSession();
	console.log('Session data:', sessionData);

	if (sessionData.data.session) {
		const user = sessionData.data.session.user;
		const userRole = user.user_metadata.role;
		if (!user) {
			console.error('User not found in session');
			return new Response('User not found', { status: 400 });
		}

		console.log('Panggil ensureProfile...');
		await ensureProfile(supabase, user);

		if (userRole === 'admin') {
			throw redirect(303, '/dashboard');
		} else {
			throw redirect(303, '/');
		}
	}

	return new Response('session not found', { status: 400 });
};
