// export async function ensureProfile(supabase: any, user: any) {
// 	const { data: profile, error } = await supabase
// 		.from('profiles')
// 		.select('*')
// 		.eq('id', user.id)
// 		.single();

import type { SupabaseClient, User } from '@supabase/supabase-js';

// 	if (!profile) {
// 		const { error: insertError } = await supabase.from('profiles').insert({
// 			id: user.id,
// 			user_id: user.id,
// 			email: user.email,
// 			role: 'user'
// 		});
// 		if (insertError) {
// 			console.error('Gagal membuat profile:', insertError.message);
// 			throw new Error('Gagal membuat profile');
// 		}
// 	}
// }

/**
 * Ensures that a user profile exists in the 'profiles' table.
 *
 * This function checks for a profile associated with the given user id.
 * If no profile is found, it attempts to find a profile by the user's email.
 * If no profile is found by either id or email, it creates a new profile with default values.
 *
 * @param supabase - The Supabase client instance used to query the database.
 * @param user - The user object containing details like id and email.
 *
 * @throws Will throw an error if unable to create a profile.
 */

export async function ensureProfile(supabase: SupabaseClient, user: User) {
	const { data: profileByUserId } = await supabase
		.from('profiles')
		.select('id')
		.eq('user_id', user.id)
		.single();

	if (!profileByUserId) {
		const { data: profileByEmail } = await supabase
			.from('profiles')
			.select('id')
			.eq('email', user.email)
			.single();

		if (!profileByEmail) {
			const { data: profile, error: insertError } = await supabase.from('profiles').insert({
				user_id: user.id,
				email: user.email,
				role: 'user',
				name: user.user_metadata?.name ?? null
			});
			console.log('profile', profile);
			if (insertError) {
				console.error('Gagal membuat profile:', insertError.message);
				throw new Error('Gagal membuat profile');
			}
		}
	}
}
