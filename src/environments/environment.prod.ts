// Configuración de producción. Reemplaza los valores de `firebase` con las
// credenciales reales del proyecto de Firebase en el pipeline de deploy
// (no commitees credenciales reales aquí).
export const environment = {
  production: true,
  firebase: {
    apiKey: 'TU_API_KEY',
    authDomain: 'TU_PROYECTO.firebaseapp.com',
    projectId: 'TU_PROYECTO',
    storageBucket: 'TU_PROYECTO.appspot.com',
    messagingSenderId: 'TU_SENDER_ID',
    appId: 'TU_APP_ID',
  },
  iglesiaIdPorDefecto: 'demo',
};
