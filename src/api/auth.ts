const API_URL = "http://127.0.0.1:8080";

export async function registerUser(data: {
  username: string;
  email: string;
  password: string;
}) {
  const response = await fetch(`${API_URL}/api/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Erreur lors de l'inscription");
  }

  return response.json();
}