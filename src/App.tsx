import { useState } from "react";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";

function App() {
  const [page, setPage] = useState<"register" | "login">("register");

  return (
    <div style={{ padding: "2rem" }}>
      <nav style={{ marginBottom: "2rem", display: "flex", gap: "1rem" }}>
        <button onClick={() => setPage("register")}>Inscription</button>
        <button onClick={() => setPage("login")}>Connexion</button>
      </nav>

      {page === "register" ? <RegisterPage /> : <LoginPage />}
    </div>
  );
}

export default App;