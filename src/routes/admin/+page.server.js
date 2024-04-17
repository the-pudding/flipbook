import { env } from "$env/dynamic/private";

export const prerender = false;

export async function load() {
	return {};
	// return {
	// 	supabaseUrl: env.SUPABASE_URL,
	// 	supabaseKey: env.SUPABASE_SERVICE_KEY,
	// 	accessKeyId: env.S3_ACCESS_KEY_ID,
	// 	secretAccessKey: env.S3_SECRET_ACCESS_KEY
	// };
}
