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
npm install --save-dev chokidar-cli livereload connect-livereload cpy-cli concurrently
```

---

## ⚙️ Scripts del `package.json`

```json
"scripts": {
  "copyFiles": "npx cpy \"src/public/css/**/*\" \"dist/public/css\" && npx cpy \"src/views/**/*\" \"dist/views\"",

  "watch": "concurrently -n \"TSC,COPY\" -c \"cyan,magenta\" \"tsc --watch\" \"npx chokidar \\\"src/public/**/*\\\" \\\"src/views/**/*\\\" -c \\\"npm run copyFiles\\\"\"",

  "dev": "concurrently -k -n \"BUILD,SERVER,LIVERELOAD\" -c \"blue,green,yellow\" \"npm run watch\" \"node --watch --loader ts-node/esm src/index.ts\" \"npx livereload dist --quiet\"",

  "start": "node dist/index.js"
}
```

---

## 🌐 Express + Livereload

En `src/index.ts`:

```ts
import express from "express";
import path from "path";
import livereload from "livereload";
import connectLivereload from "connect-livereload";

const app = express();

// Middleware de livereload
app.use(connectLivereload());

// Static files
app.use(express.static(path.join(__dirname, "../public")));

// Vistas y otros setup...

// LiveReload server
const liveReloadServer = livereload.createServer();
liveReloadServer.watch([path.join(__dirname, "../public"), path.join(__dirname, "../views")]);

liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});
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
- Recarga el navegador al hacer cualquier cambio ✨

---

¡Listo! Tenés un entorno de desarrollo con hot reload, build automatizado y todo lo que necesitás para codear sin trabas 💪

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
npm install --save-dev chokidar-cli livereload connect-livereload cpy-cli concurrently
```

---

## ⚙️ Scripts del `package.json`

```json
"scripts": {
  "copyFiles": "npx cpy \"src/public/css/**/*\" \"dist/public/css\" && npx cpy \"src/views/**/*\" \"dist/views\"",

  "watch": "concurrently -n \"TSC,COPY\" -c \"cyan,magenta\" \"tsc --watch\" \"npx chokidar \\\"src/public/**/*\\\" \\\"src/views/**/*\\\" -c \\\"npm run copyFiles\\\"\"",

  "dev": "concurrently -k -n \"BUILD,SERVER,LIVERELOAD\" -c \"blue,green,yellow\" \"npm run watch\" \"node --watch --loader ts-node/esm src/index.ts\" \"npx livereload dist --quiet\"",

  "start": "node dist/index.js"
}
```

---

## 🌐 Express + Livereload

En `src/index.ts`:

```ts
import express from "express";
import path from "path";
import livereload from "livereload";
import connectLivereload from "connect-livereload";

const app = express();

// Middleware de livereload
app.use(connectLivereload());

// Static files
app.use(express.static(path.join(__dirname, "../public")));

// Vistas y otros setup...

// LiveReload server
const liveReloadServer = livereload.createServer();
liveReloadServer.watch([path.join(__dirname, "../public"), path.join(__dirname, "../views")]);

liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});
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
- Recarga el navegador al hacer cualquier cambio ✨

---

¡Listo! Tenés un entorno de desarrollo con hot reload, build automatizado y todo lo que necesitás para codear sin trabas 💪
