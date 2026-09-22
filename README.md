# Maranatha

PWA para una congregación adventista del séptimo día — boletín semanal,
Escuela Sabática, Sociedad de Jóvenes, feed de la comunidad y eventos.
Construida con Angular y Firebase, pensada para que otras congregaciones
puedan adoptarla en el futuro (multi-tenant vía `iglesias/{iglesiaId}`).

Generado con [Angular CLI](https://github.com/angular/angular-cli) v21.

## Setup

```bash
npm install --legacy-peer-deps
```

> Se requiere `--legacy-peer-deps` por un conflicto de peer dependencies
> entre `vitest` y sus paquetes opcionales de navegador, no relacionado con
> este proyecto.

### Firebase — desarrollo con emuladores (por defecto)

Mientras `environment.ts` tenga `useEmulators: true` (el valor por
defecto), la app no necesita un proyecto real de Firebase: habla con los
emuladores locales de Auth y Firestore.

```bash
npm run emulators   # deja esto corriendo en una terminal
ng serve             # en otra terminal
```

Abre `http://localhost:4200/`. Puedes registrarte, iniciar sesión, publicar
en Compartir, etc. — todo se guarda en el emulador (se pierde al
detenerlo). La UI del emulador queda en `http://127.0.0.1:4000/`.

> El emulador de Storage no está incluido en el script por un conflicto de
> proxy en algunos entornos sandboxed; corre normalmente en una máquina
> local (`firebase emulators:start --only auth,firestore,storage`).

### Firebase — proyecto real (producción)

1. Crea un proyecto en [Firebase Console](https://console.firebase.google.com/)
   con Firestore, Auth, Storage y Hosting habilitados.
2. Copia las credenciales del SDK web y reemplázalas en
   `src/environments/environment.prod.ts` (nunca commitees credenciales
   reales — ese archivo solo debe contener placeholders en el repo). Pon
   `useEmulators: false` si también quieres probar contra el proyecto real
   desde `environment.ts`.
3. Actualiza `.firebaserc` con el ID real del proyecto.
4. Despliega las reglas de seguridad:
   ```bash
   firebase deploy --only firestore:rules,storage:rules
   ```

Las reglas en `firestore.rules` dejan la lectura del contenido de la
congregación (boletín, programas, eventos, el feed de Compartir) abierta a
cualquier visitante sin sesión. Solo las escrituras (publicar, editar el
boletín, asignar responsables) exigen autenticación, y el rol de cada
usuario (`miembro`, `lider_ministerio`, `secretario`, `administrador`) se
valida del lado del servidor a partir de su propio documento en
`usuarios/{uid}` — nunca se confía en datos enviados por el cliente.

## Servidor de desarrollo

```bash
ng serve
```

Abre `http://localhost:4200/`. La app recarga automáticamente al modificar
los archivos fuente. Para probar login/Compartir necesitas también tener
los emuladores corriendo (ver arriba).

## Build

```bash
ng build
```

Los artefactos quedan en `dist/maranatha/browser`, listos para
`firebase deploy --only hosting`.

## Tests

```bash
ng test
```

## Estructura del proyecto

```
src/app/
  core/
    models/      # Interfaces de datos (Iglesia, Usuario, Boletin, ...)
    firebase/    # Providers de Firebase (App, Auth, Firestore, Storage)
    auth/        # AuthService (Firebase Auth + doc usuarios/{uid})
    services/    # Acceso a datos (ContribucionesService, ...)
  features/
    auth/        # Login/registro (real, Firebase Auth)
    inicio/      # Accesos directos + próximos eventos
    compartir/   # Feed de la comunidad (real, Firestore)
    boletin/     # Boletín semanal (Escuela Sabática / Culto / Anuncios)
    programas/   # Flujo de Escuela Sabática y Sociedad de Jóvenes
  shared/
    components/  # Componentes reutilizables (nav inferior, tarjetas, ...)
    layout/      # Shell de la app (nav inferior + barra de sesión)
    mock/        # Datos de ejemplo (Inicio, Boletín, Programas)
```

## Estado actual

- **Real, conectado a Firebase (Auth + Firestore)**: registro/login por
  email, Compartir (publicar, filtrar por categoría, marcar como candidato
  al boletín — cualquier miembro autenticado puede hacerlo, no solo
  líderes).
- **Con datos mock** (pendiente de conectar a Firestore): Inicio, Boletín
  (con exportar a PDF vía impresión del navegador) y Programas.
- Editar el boletín / programas desde la app (con los permisos por
  ministerio) todavía no está implementado — por ahora esos datos se
  editarían directamente en Firestore.
