import { redirect } from '@sveltejs/kit';

export async function load({ locals }) {
	const user = locals.user;
	console.log('user', user);
}
