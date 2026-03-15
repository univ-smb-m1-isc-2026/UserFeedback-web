const API_URL = "http://localhost:8080";

export async function getCategories() {
  const response = await fetch(`${API_URL}/api/categories`);

  if (!response.ok) {
    throw new Error("Erreur lors du chargement des catégories");
  }

  return response.json();
}