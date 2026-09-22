// Configuración de producción — proyecto real "maranatha7day" en Firebase.
//
// Nota: el `firebaseConfig` de una app web NO es un secreto — identifica
// el proyecto, pero no otorga acceso por sí solo (Firebase lo dice
// explícitamente en su documentación). La seguridad real la dan las
// reglas de Firestore/Storage (ver firestore.rules), no ocultar esta
// config. Por eso es seguro tenerla en el repo.
export const environment = {
  production: true,
  firebase: {
    apiKey: 'AIzaSyCYS0CyUztWRcOChTUgKtAZA3Uq6bKcs8g',
    authDomain: 'maranatha7day.firebaseapp.com',
    projectId: 'maranatha7day',
    storageBucket: 'maranatha7day.firebasestorage.app',
    messagingSenderId: '1046407996910',
    appId: '1:1046407996910:web:ddf93c28f670733ea3daff',
  },
  iglesiaIdPorDefecto: 'demo',
  useEmulators: false,
};
