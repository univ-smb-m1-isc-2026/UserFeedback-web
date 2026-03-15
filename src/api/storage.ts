export interface ConnectedUser {
  id: number;
  username: string;
  email: string;
  password: string;
  role: string;
}

export function getConnectedUser(): ConnectedUser | null {
  const rawUser = localStorage.getItem("user");

  if (!rawUser) {
    return null;
  }

  return JSON.parse(rawUser);
}