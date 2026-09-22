const MENSAJES: Record<string, string> = {
  'auth/email-already-in-use': 'Ya existe una cuenta con ese correo.',
  'auth/invalid-email': 'El correo no es válido.',
  'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres.',
  'auth/invalid-credential': 'Correo o contraseña incorrectos.',
  'auth/user-not-found': 'Correo o contraseña incorrectos.',
  'auth/wrong-password': 'Correo o contraseña incorrectos.',
  'auth/too-many-requests': 'Demasiados intentos. Espera un momento e intenta de nuevo.',
};

export function mensajeErrorAuth(error: unknown): string {
  const codigo = (error as { code?: string })?.code;
  return (codigo && MENSAJES[codigo]) || 'Ocurrió un error. Intenta de nuevo.';
}
