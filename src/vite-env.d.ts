interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_AUTH_ENDPOINT: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
