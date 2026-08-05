/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_APP_URL: string;
  readonly VITE_API_URL: string;
  readonly VITE_SENTRY_DSN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module 'next/image' {
  import React from 'react';
  const Image: React.FC<any>;
  export default Image;
}

declare module 'next/link' {
  import React from 'react';
  const Link: React.FC<any>;
  export default Link;
}
