import { PORT } from '$env/static/private';
import { fail, redirect } from '@sveltejs/kit';

export const actions = {
	googleLogin: async ({ locals: { supabase } }) => {
		const { data, error } = await supabase.auth.signInWithOAuth({
			provider: 'google',
			options: { redirectTo: `${PORT}auth/callback` }
		});
		if (error) {
			console.error('Error during login:', error);
			return fail(400, { error: error.message });
		}
		console.log('Redirecting to:', data.url);
		throw redirect(303, data.url);
	}
};
