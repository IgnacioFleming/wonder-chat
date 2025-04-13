# 🛠️ Setup de Desarrollo para el Clone de WhatsApp Web

Este archivo documenta cómo está configurado el entorno de desarrollo del proyecto para automatizar el build, copiado de archivos y recarga automática del navegador.

---

## 📁 Estructura

```
src/
├── public/         # Archivos estáticos fuente (CSS, JS, imágenes)
├── views/          # Plantillas Handlebars
├── index.ts        # Entry point del servidor Express

public/             # Archivos estáticos ya copiados (servidos por Express)
views/              # Vistas compiladas/copias (servidas por Express)
dist/               # Build final (JS compilado desde TypeScript)
```

---

## 📦 Dependencias de desarrollo

```bash
npm install --save-dev chokidar-cli livereload connect-livereload cpy-cli concurrently cross-env nodemon
```

---

## ⚙️ Scripts del `package.json`

```json
"scripts": {
  "copyFiles": "mkdir dist\\public && mkdir dist\\views && xcopy src\\public dist\\public /E /I /Y && xcopy src\\views dist\\views /E /I /Y",

  "watch": "concurrently -n \"TSC,COPY\" -c \"cyan,magenta\" \"tsc --watch\" \"npx chokidar \\\"src/public/**/*\\\" \\\"src/views/**/*\\\" -c \\\"npm run copyFiles\\\"\"",

  "dev": "cross-env NODE_ENV=development concurrently -k -n \"BUILD,SERVER\" -c \"blue,green\" \"npm run watch\" \"nodemon --watch src --ext ts,hbs --ignore src/public --exec ts-node-esm src/index.ts --delay 100\"",

  "start": "cross-env NODE_ENV=production node dist/index.js"
}
```

---

## 🌐 Express + Livereload

En `src/index.ts`:

```ts
import express from "express";
import path from "path";

const app = express();

if (process.env.NODE_ENV === "development") {
  const livereload = await import("livereload");
  const connectLivereload = await import("connect-livereload");

  app.use(connectLivereload.default());

  const liveReloadServer = livereload.createServer();
  liveReloadServer.watch([path.join(__dirname, "../public"), path.join(__dirname, "../views")]);

  liveReloadServer.server.once("connection", () => {
    setTimeout(() => {
      liveReloadServer.refresh("/");
    }, 100);
  });
}

// Static files y vistas
app.use(express.static(path.join(__dirname, "../public")));
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "hbs");

if (process.env.NODE_ENV === "development") {
  app.set("view cache", false);
}
```

---

## 🧩 En el layout Handlebars (`main.hbs` o similar)

Al final del `<body>`, agregá:

```html
<script src="http://localhost:35729/livereload.js"></script>
```

---

## 🚀 ¿Cómo corro el proyecto en desarrollo?

```bash
npm run dev
```

Esto:

- Compila el TS automáticamente
- Copia los archivos estáticos y vistas cuando los modificás
- Sirve el backend con Express
- Recarga el navegador al hacer cualquier cambio
- Reinicia el servidor si tocás `.ts` o `.hbs`

---

## 🛠 Troubleshooting

### ❗ Error: `EADDRINUSE: address already in use :::35729`

Eso significa que ya hay un proceso usando el puerto de livereload (probablemente un server anterior quedó abierto).

🧽 Solución rápida (Windows):

```bash
netstat -ano | findstr :35729
```

Buscás el PID, luego:

```bash
taskkill /PID <pid> /F
```

O directamente asegurate de no estar corriendo `livereload` tanto desde el script como desde el código.

---

## ⚙️ Socket.IO – Manejo de usuarios conectados

Para asociar usuarios con sus `socket.id` y permitir enviar mensajes entre ellos, se usa:

```ts
const userSocketMap = new Map<string, string>(); // userId -> socket.id
```

Esto se guarda en memoria para saber qué socket le corresponde a cada usuario. Cuando alguien se conecta:

```ts
socket.on("register", (userId) => {
  userSocketMap.set(userId, socket.id);
});
```

Y para enviar un mensaje a otro usuario:

```ts
const receiverSocketId = userSocketMap.get(message.receiver);
if (receiverSocketId) {
  io.to(receiverSocketId).emit("sendMessage", message);
}
```

### ✅ ¿Es buena práctica usar `Map`?

Sí, siempre que:

- Tengas 1 sola instancia del servidor (como en Railway sin escalado horizontal)
- La app tenga menos de 200 usuarios concurrentes
- No necesites persistencia si se cae el server

```ts
// En producción usamos Map porque la app corre en una sola instancia (Railway sin escalado).
// Si se escalara horizontalmente, reemplazar por Redis.
```

Para apps más grandes o con múltiples instancias, se recomienda usar Redis para compartir los socket.id entre instancias del servidor.

---

¡Listo! Tenés un entorno de desarrollo con hot reload, build automatizado, recarga de navegador y lógica de socket optimizada para producción en Railway 🚀
