# 🌐 WonderChat

Welcome to **WonderChat**, a WhatsApp Web clone developed with modern backend and frontend technologies.

---

## 📊 Technologies Used

- **Backend**: Node.js + Express.js + TypeScript
- **Frontend**: HTML, CSS, Vanilla TypeScript, Bootstrap 5
- **WebSockets**: Socket.IO
- **Database**: MongoDB Atlas
- **Authentication**: Passport.js (local strategy + session management)
- **File Uploads**: Multer (profile picture storage on server)
- **Deployment**: Railway

---

## 🎓 Main Features

- User registration and login.
- Secure session management with cookies.
- Profile picture upload.
- Real-time message sending and receiving via WebSockets.
- Message status: sent, received, and read.
- Real-time conversation search (with debounce).
- Automatic conversation creation.
- Dynamic update of last messages and conversation ordering.
- Responsive design (mobile-friendly).

---

## 🔄 How to Run Locally

1. Clone the repository:

```bash
git clone https://github.com/IgnacioFleming/wonderchat.git
cd wonderchat
```

2. Install dependencies:

```bash
npm install
```

3. Configure environment variables:

Create a `.env` file at the root and fill in:

```env
MONGO_URL=your_mongodb_connection_string
SECRET=a_secret_key_for_cookies
PORT=8080
```

4. Compile and start the server in development mode:

```bash
npm run dev
```

5. Access in your browser at:

```
http://localhost:8080
```

---

## 💡 Additional Details

- Static files are served from the `public` folder.
- The server transpiles TypeScript on startup (auto-generates `dist/`).
- The app includes live reload for development (instant file change reflection).
- For production, a full build is completed before deployment.
- Upload images to disk (`public/profile/uploads`).
- Password encryption (bcrypt).
- Multimedia messages.

---

## 📂 Project Structure

```bash
src/
├── auth/           # Authentication for routes with passport
├── config/         # Global config (env, livereload for dev enviroment, express session with MongoDB)
├── controllers/    # Business logic for each entity
├── dao/            # Database models (with MongoDB)
├── middleware/     # Custom Express middlewares
├── mocks/          # Mocked data generation for tests
├── public/         # Static files and Frontend logic (Vanilla Typescript)
├── routes/         # API routes
├── schemas/        # For data validation with Zod
├── sockets/        # Websockets services for Conversations and Messages handling (socket.io)
├── types/          # Global types and enums
├── utils/          # Utility functions
├── views/          # Html templates for the user interface powered by handlebars
└── index.jsx       # Application entry point
```

## ✨ Live Demo

[**Try WonderChat on Railway**](https://wonder-chat-production.up.railway.app/)

---

## 👤 Author

**Ignacio Fleming**\
[LinkedIn](https://www.linkedin.com/in/ignacio-fleming-1b5a18114/) | [GitHub](https://github.com/IgnacioFleming/)

---

**Thanks for checking out the project!** 🚀✨
