const API_URL = "http://localhost:8080";

export async function getVotes() {
  const response = await fetch(`${API_URL}/api/votes`);

  if (!response.ok) {
    throw new Error("Erreur lors du chargement des votes");
  }

  return response.json();
}

export async function createVote(data: {
  value: number;
  userId: number;
  postId: number | null;
  replyId: number | null;
}) {
  const response = await fetch(`${API_URL}/api/votes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Erreur lors de la création du vote");
  }

  const text = await response.text();

  if (!text) {
    return null;
  }

  return JSON.parse(text);
}