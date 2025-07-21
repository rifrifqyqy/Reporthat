// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import { PrismaClient } from '@prisma/client';
import type { SupabaseClient } from '@supabase/supabase-js';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			supabase: SupabaseClient;
			safeGetSession: () => Promise<{ session: Session | null; user: User | null }>;
			session: Session | null;
			user: User | null;
			getSession: () => Promise<Session | null>;
		}
		interface PageData {
			session: Session | null;
			user: User | null;
		}
		// interface PageState {}
		// interface Platform {}
	}
	namespace NodeJS {
		interface Global {
			prisma?: PrismaClient;
		}
	}
}

export {};
