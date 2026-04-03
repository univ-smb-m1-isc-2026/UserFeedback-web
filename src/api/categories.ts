const API_URL = "http://localhost:8080";

export async function getCategories() {
  const response = await fetch(`${API_URL}/api/categories`);

  if (!response.ok) {
    throw new Error("Erreur lors du chargement des catégories");
  }

  return response.json();
}

export async function createCategory(
  data: {
    title: string;
    description: string;
  },
  userId: number
) {
  const response = await fetch(`${API_URL}/api/categories?userId=${userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Erreur lors de la création de la catégorie");
  }

  return response.json();
}