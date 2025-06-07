

# 📚 Book Search Engine

## Description

This is a full-stack MERN (MongoDB, Express.js, React, Node.js) application that allows users to search for books using the Google Books API, save them to their profile, and manage their saved books. It was originally built with a RESTful API and has now been refactored to use GraphQL with Apollo Server and Client.

The front end is built with React and deployed as a static site, while the back end is powered by Apollo Server integrated with Express and deployed on Render.

---

## 🔗 Deployed Links

- 🌐 **Client (Frontend - Static Site):** [Book Search UI](https://one8-book-search-engine-1.onrender.com)
- 🧠 **Server (Backend - GraphQL API):** [GraphQL Endpoint](https://one8-book-search-engine-r1js.onrender.com/graphql)

---

## 🚀 Features

- Search for books using the Google Books API
- Signup and login with JWT authentication
- Save books to a personal account
- View and delete saved books
- Fully functional GraphQL API
- Responsive React front end
- Deployed on Render (separate services for frontend and backend)

---

## 🛠️ Technologies Used

- MongoDB Atlas
- Express.js
- Node.js
- React
- Vite
- Apollo Server
- Apollo Client
- GraphQL
- JSON Web Token (JWT)
- Render

---

## 📂 Folder Structure

```
client/       # React frontend built with Vite
 ├── src/
 ├── dist/     # Build output served in production
server/       # Express server with Apollo GraphQL
 ├── src/
 ├── services/
```

---

## 🔧 Installation

To run the app locally:

1. Clone the repo  
   ```bash
   git clone https://github.com/johnwgomez/18-book-search-engine.git
   cd 18-book-search-engine
   ```

2. Install root and server dependencies  
   ```bash
   npm install
   cd server
   npm install
   ```

3. Install client dependencies and build  
   ```bash
   cd ../client
   npm install
   npm run build
   ```

4. Run the server  
   ```bash
   cd ../server
   npm run build
   npm start
   ```

Visit `http://localhost:3001` to view the app and `http://localhost:3001/graphql` to interact with the GraphQL API.

---

## 🌍 Environment Variables

Create a `.env` file in `/server` with the following:

```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET_KEY=your_jwt_secret
NODE_ENV=production
```

---

## 📸 Screenshots

### Home Page
![Home Page](./screenshots/Screenshot%202025-06-06%20at%209.06.20 PM.png)

### Dashboard View
![Dashboard](./screenshots/Screenshot%202025-06-06%20at%209.06.33 PM.png)
---

## 🧠 Author

John Gomez

---

## 📜 License

MIT