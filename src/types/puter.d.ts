/**
 * Global Puter.js type declarations — single source of truth.
 * Both puterAI.ts and usePuter.ts reference window.puter.
 */
export {};

declare global {
  interface Window {
    puter?: {
      ai: {
        chat: (
          prompt: string,
          options?: { model?: string; stream?: boolean }
        ) => Promise<{ message: { content: string } } | string>;
      };
      auth: {
        getUser:    () => Promise<{ username: string; email?: string }>;
        signIn:     () => Promise<void>;
        signOut:    () => Promise<void>;
        isSignedIn: () => boolean;
      };
      fs: {
        write:   (path: string, data: string | Blob) => Promise<void>;
        readdir: (path: string) => Promise<Array<{ name: string; path: string }>>;
        mkdir:   (path: string, opts?: { createMissingParents?: boolean }) => Promise<void>;
      };
      ui: {
        alert: (msg: string, opts?: { icon?: "success" | "error" | "info" }) => Promise<void>;
      };
    };
  }
}
