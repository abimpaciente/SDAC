// Configuración de desarrollo. Mientras `useEmulators` sea `true`, la app
// habla con los emuladores locales de Firebase (`npm run emulators`) y el
// `projectId` de abajo solo sirve como namespace del emulador — no hace
// falta un proyecto real ni credenciales reales para desarrollar.
//
// Cuando tengas un proyecto de Firebase real, pon `useEmulators` en `false`
// y reemplaza `firebase` con las credenciales del SDK web (nunca las
// commitees: ver .gitignore).
export const environment = {
  production: false,
  firebase: {
    apiKey: 'demo-api-key',
    authDomain: 'demo-maranatha.firebaseapp.com',
    projectId: 'demo-maranatha',
    storageBucket: 'demo-maranatha.appspot.com',
    messagingSenderId: 'demo-sender-id',
    appId: 'demo-app-id',
  },
  // ID de la congregación por defecto para desarrollo local (multi-tenant:
  // en producción esto se resuelve por dominio/config, no hardcodeado).
  iglesiaIdPorDefecto: 'demo',
  useEmulators: true,
};
