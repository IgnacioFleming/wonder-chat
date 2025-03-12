declare global {
  interface Window {
    io: any; // Declaramos `io` para que no haya errores de TypeScript
  }
}

// Importante: Solo usas `io()` si ya tienes Socket.IO en el frontend.
const socket = io();
console.log("hola");
