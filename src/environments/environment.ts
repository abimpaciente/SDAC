// Configuración de desarrollo. Reemplaza los valores de `firebase` con las
// credenciales del proyecto de Firebase antes de correr la app.
// NUNCA commitees credenciales reales en este archivo: usa variables de
// entorno / un paso de build que las inyecte, o mantenlo fuera de git una
// vez tengas valores reales (ver .gitignore).
export const environment = {
  production: false,
  firebase: {
    apiKey: 'TU_API_KEY',
    authDomain: 'TU_PROYECTO.firebaseapp.com',
    projectId: 'TU_PROYECTO',
    storageBucket: 'TU_PROYECTO.appspot.com',
    messagingSenderId: 'TU_SENDER_ID',
    appId: 'TU_APP_ID',
  },
  // ID de la congregación por defecto para desarrollo local (multi-tenant:
  // en producción esto se resuelve por dominio/config, no hardcodeado).
  iglesiaIdPorDefecto: 'demo',
};
