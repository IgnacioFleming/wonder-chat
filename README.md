# 🌐 WonderChat

Bienvenido a **WonderChat**, un clon de WhatsApp Web desarrollado con tecnologias modernas de backend y frontend.

---

## 📊 Tecnologias utilizadas

- **Backend**: Node.js + Express.js + TypeScript
- **Frontend**: HTML, CSS, JavaScript Vanilla, Bootstrap 5
- **WebSockets**: Socket.IO
- **Base de datos**: MongoDB Atlas
- **Autenticacion**: Passport.js (estrategia local + manejo de sesiones)
- **Subida de archivos**: Multer (almacenamiento de fotos de perfil en el servidor)
- **Deploy**: Railway

---

## 🎓 Caracteristicas principales

- Registro y login de usuarios.
- Gestion de sesiones seguras con cookies.
- Subida de imagen de perfil.
- Envio y recepcion de mensajes en tiempo real via WebSockets.
- Estado de los mensajes: enviado, recibido y leido.
- Buscador de conversaciones en tiempo real (debounce incluido).
- Creacion automatica de conversaciones.
- Actualizacion de ultimos mensajes y orden dinamico de conversaciones.
- Diseño responsive (mobile-friendly).

---

## 🔄 Como correrlo localmente

1. Clonar el repositorio:

```bash
git clone https://github.com/tuusuario/wonderchat.git
cd wonderchat
```

2. Instalar dependencias:

```bash
npm install
```

3. Configurar variables de entorno:

Crear un archivo `.env` en la raiz y completar:

```env
MONGO_URL=tu_string_de_conexion
SECRET=una_clave_secreta_para_cookies
PORT=8080
```

4. Compilar y levantar el servidor en modo desarrollo:

```bash
npm run dev
```

5. Acceder en tu navegador a:

```
http://localhost:8080
```

---

## 💡 Detalles adicionales

- Los archivos estaticos se sirven desde la carpeta `public`.
- El servidor transpila el TypeScript al iniciar (`dist/` generado automaticamente).
- La app tiene live reload para desarrollo (cambios en archivos reflejados al instante).
- Para produccion se realiza el build completo antes del deploy.

---

## 🚀 Mejoras futuras (roadmap)

- Subida de imagenes a un proveedor en la nube (Cloudinary).
- Encriptado de contraseñas (bcrypt).
- Mensajes multimedia.
- Notificaciones push.

---

## ✨ Demo online

[**Probar WonderChat en Railway**](https://wonderchat-production.up.railway.app/)

---

## 👤 Autor

**Julieta Micucci**\
[LinkedIn](https://www.linkedin.com/in/tuusuario/) | [GitHub](https://github.com/tuusuario/)

---

**Gracias por visitar el proyecto!** 🚀✨
