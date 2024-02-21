import { env } from "$env/dynamic/private";

export async function load() {
	return {
		supabaseUrl: env.SUPABASE_URL,
		supabaseKey: env.SUPABASE_SERVICE_KEY
	};
}
