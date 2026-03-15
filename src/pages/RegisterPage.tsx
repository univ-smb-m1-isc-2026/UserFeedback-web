import { useState } from "react";
import { registerUser } from "../api/auth";

function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const user = await registerUser({
        username,
        email,
        password,
      });

      setMessage(`Utilisateur créé : ${user.username}`);
      setUsername("");
      setEmail("");
      setPassword("");
    } catch (error) {
      setMessage("Erreur lors de l'inscription");
      console.error(error);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Inscription</h1>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: "400px" }}>
        <input
          type="text"
          placeholder="Nom d'utilisateur"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

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

        <button type="submit">S'inscrire</button>
      </form>

      <p>{message}</p>
    </div>
  );
}

export default RegisterPage;