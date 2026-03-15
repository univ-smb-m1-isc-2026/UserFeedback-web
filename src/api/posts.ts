const API_URL = "http://localhost:8080";

export async function getPosts() {
  const response = await fetch(`${API_URL}/api/posts`);

  if (!response.ok) {
    throw new Error("Erreur lors du chargement des posts");
  }

  return response.json();
}

export async function createPost(data: {
  title: string;
  content: string;
  visibility: string;
  authorId: number;
  categoryId: number;
}) {
  const response = await fetch(`${API_URL}/api/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Erreur lors de la création du post");
  }

  return response.json();
}