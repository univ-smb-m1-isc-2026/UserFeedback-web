import { useEffect, useState } from "react";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import CategoriesPage from "./pages/CategoriesPage";
import PostsPage from "./pages/PostsPage";
import CreatePostPage from "./pages/CreatePostPage";
import GroupsPage from "./pages/GroupsPage";
import { clearConnectedUser, getConnectedUser, type ConnectedUser } from "./api/storage";

function App() {
  const [page, setPage] = useState<
  "posts" | "login" | "register" | "categories" | "groups" | "create-post"
  >("posts");

  const [connectedUser, setConnectedUserState] = useState<ConnectedUser | null>(null);

  useEffect(() => {
    setConnectedUserState(getConnectedUser());
  }, []);

  const handleLogout = () => {
    clearConnectedUser();
    setConnectedUserState(null);
    setPage("posts");
  };

  return (
    <div>
      <header
        style={{
          padding: "1rem 2rem",
          borderBottom: "1px solid #e5e7eb",
          background: "white",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <h2 style={{ margin: 0 }}>UserFeedback</h2>

        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
          <button className="secondary" onClick={() => setPage("posts")}>
            Posts
          </button>

          <button className="secondary" onClick={() => setPage("categories")}>
            Catégories
          </button>

          <button className="secondary" onClick={() => setPage("groups")}>
            Groupes
          </button>

          {connectedUser ? (
            <>
              <button onClick={() => setPage("create-post")}>+ Post</button>
              <span className="meta" style={{ fontWeight: 600 }}>
                {connectedUser.username}
              </span>
              <button className="secondary" onClick={handleLogout}>
                Se déconnecter
              </button>
            </>
          ) : (
            <>
              <button className="secondary" onClick={() => setPage("login")}>
                Login
              </button>
              <button className="secondary" onClick={() => setPage("register")}>
                Register
              </button>
            </>
          )}
        </div>
      </header>

      <main className="page-container">
        {page === "posts" && <PostsPage />}
        {page === "categories" && <CategoriesPage />}
        {page === "login" && <LoginPage />}
        {page === "register" && <RegisterPage />}
        {page === "create-post" && connectedUser && <CreatePostPage />}
        {page === "groups" && <GroupsPage />}
      </main>
    </div>
  );
}

export default App;