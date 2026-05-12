/// <reference types="vite/client" />
/// <reference types="@types/google.maps" />

interface ImportMetaEnv {
  readonly VITE_GOOGLE_MAPS_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}