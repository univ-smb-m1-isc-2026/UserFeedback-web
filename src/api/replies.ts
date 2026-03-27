const API_URL = "http://localhost:8080";

export async function getReplies() {
  const response = await fetch(`${API_URL}/api/replies`);

  if (!response.ok) {
    throw new Error("Erreur lors du chargement des réponses");
  }

  return response.json();
}

export async function createReply(data: {
  content: string;
  visibility: string;
  authorId: number;
  postId: number;
}) {
  const response = await fetch(`${API_URL}/api/replies`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Erreur lors de la création de la réponse");
  }

  return response.json();
}