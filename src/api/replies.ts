const API_URL = "http://localhost:8080";

export async function getReplies(postId: number, userId: number) {
  const response = await fetch(
    `${API_URL}/api/replies?userId=${userId}&postId=${postId}`
  );

  if (!response.ok) {
    throw new Error("Erreur lors du chargement des réponses");
  }

  return response.json();
}

export async function createReply(data: {
  content: string;
  isPublic: boolean;
  groupId: number | null;
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