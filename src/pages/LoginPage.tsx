import { useState } from "react";
import { loginUser } from "../api/auth";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const user = await loginUser({ email, password });
      setMessage(`Connecté : ${user.username}`);
      localStorage.setItem("user", JSON.stringify(user));
      setEmail("");
      setPassword("");
    } catch (error) {
      setMessage("Erreur lors de la connexion");
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Connexion</h1>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: "400px" }}
      >
        <input
          type="email"
          placeholder="Adresse email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Se connecter</button>
      </form>

      <p>{message}</p>
    </div>
  );
}

export default LoginPage;