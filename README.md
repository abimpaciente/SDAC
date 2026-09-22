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

### Firebase

1. Crea un proyecto en [Firebase Console](https://console.firebase.google.com/)
   con Firestore, Auth, Storage y Hosting habilitados.
2. Copia las credenciales del SDK web y reemplázalas en
   `src/environments/environment.ts` y `environment.prod.ts` (nunca
   commitees credenciales reales — esos archivos solo deben contener
   placeholders en el repo).
3. Actualiza `.firebaserc` con el ID real del proyecto.
4. Despliega las reglas de seguridad:
   ```bash
   firebase deploy --only firestore:rules,storage:rules
   ```

Las reglas en `firestore.rules` validan el rol de cada usuario
(`miembro`, `lider_ministerio`, `secretario`, `administrador`) del lado del
servidor a partir de su propio documento en `usuarios/{uid}` — nunca
confían en datos enviados por el cliente.

## Servidor de desarrollo

```bash
ng serve
```

Abre `http://localhost:4200/`. La app recarga automáticamente al modificar
los archivos fuente.

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
  features/
    auth/        # Login/registro
    inicio/      # Accesos directos + próximos eventos
    compartir/   # Feed tipo chat de la comunidad
    boletin/     # Boletín semanal (Escuela Sabática / Culto / Anuncios)
    programas/   # Flujo de Escuela Sabática y Sociedad de Jóvenes
  shared/
    components/  # Componentes reutilizables (nav inferior, filas del boletín)
    layout/      # Shell de la app
    mock/        # Datos de ejemplo mientras se conecta Firestore
```

## Estado actual

Implementado con datos mock (sin conexión a Firestore todavía): layout con
nav inferior, Inicio, Boletín (con exportar a PDF vía impresión del
navegador) y Programas. Compartir y Login son pantallas placeholder
pendientes de implementación.
