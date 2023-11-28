// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  declare namespace Lucia {
    type Auth = import('$lib/server/lucia').Auth;
    type DatabaseUserAttributes = { name: string; email: string };
    type DatabaseSessionAttributes = object;
  }
  namespace App {
    // interface Error {}
    interface Locals {
      auth: import('lucia').AuthRequest;
      session: import('lucia').Session | null;
    }
    // interface PageData {}
    // interface Platform {}
  }
}

export {};
