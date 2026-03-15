import { useState } from "react";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import CategoriesPage from "./pages/CategoriesPage";
import PostsPage from "./pages/PostsPage";
import CreatePostPage from "./pages/CreatePostPage";

function App() {
  const [page, setPage] = useState<"register" | "login" | "categories" | "posts" | "create-post">("register");

  return (
    <div style={{ padding: "2rem" }}>
      <nav style={{ marginBottom: "2rem", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        <button onClick={() => setPage("register")}>Inscription</button>
        <button onClick={() => setPage("login")}>Connexion</button>
        <button onClick={() => setPage("categories")}>Catégories</button>
        <button onClick={() => setPage("posts")}>Posts</button>
        <button onClick={() => setPage("create-post")}>Créer un post</button>
      </nav>

      {page === "register" && <RegisterPage />}
      {page === "login" && <LoginPage />}
      {page === "categories" && <CategoriesPage />}
      {page === "posts" && <PostsPage />}
      {page === "create-post" && <CreatePostPage />}
    </div>
  );
}

export default App;