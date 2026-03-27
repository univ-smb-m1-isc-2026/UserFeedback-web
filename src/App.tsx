import { useState } from "react";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import CategoriesPage from "./pages/CategoriesPage";
import PostsPage from "./pages/PostsPage";
import CreatePostPage from "./pages/CreatePostPage";
import CreateReplyPage from "./pages/CreateReplyPage";

function App() {
  const [page, setPage] = useState<
    "register" | "login" | "categories" | "posts" | "create-post" | "create-reply"
  >("register");

  return (
    <div className="page-container">
      <nav className="navbar">
        <button onClick={() => setPage("register")}>Inscription</button>
        <button onClick={() => setPage("login")}>Connexion</button>
        <button onClick={() => setPage("categories")}>Catégories</button>
        <button onClick={() => setPage("posts")}>Posts</button>
        <button onClick={() => setPage("create-post")}>Créer un post</button>
        <button onClick={() => setPage("create-reply")}>Créer une réponse</button>
      </nav>

      {page === "register" && <RegisterPage />}
      {page === "login" && <LoginPage />}
      {page === "categories" && <CategoriesPage />}
      {page === "posts" && <PostsPage />}
      {page === "create-post" && <CreatePostPage />}
      {page === "create-reply" && <CreateReplyPage />}
    </div>
  );
}

export default App;