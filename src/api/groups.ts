const API_URL = "http://localhost:8080";

export async function createGroup(data: {
  name: string;
  ownerId: number;
}) {
  const response = await fetch(`${API_URL}/api/groups`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Erreur lors de la création du groupe");
  }

  return response.json();
}

export async function getUserGroups(userId: number) {
  const response = await fetch(`${API_URL}/api/groups/user/${userId}`);

  if (!response.ok) {
    throw new Error("Erreur lors du chargement des groupes");
  }

  return response.json();
}

export async function searchUsers(query: string) {
  const response = await fetch(
    `${API_URL}/api/groups/search-users?query=${encodeURIComponent(query)}`
  );

  if (!response.ok) {
    throw new Error("Erreur lors de la recherche des utilisateurs");
  }

  return response.json();
}

export async function addUserToGroup(groupId: number, userId: number) {
  const response = await fetch(`${API_URL}/api/groups/${groupId}/members`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId }),
  });

  if (!response.ok) {
    throw new Error("Erreur lors de l'ajout au groupe");
  }

  return response.json();
}

export async function leaveGroup(groupId: number, userId: number) {
  const response = await fetch(`${API_URL}/api/groups/${groupId}/leave/${userId}`, {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Erreur lors de la sortie du groupe");
  }
}