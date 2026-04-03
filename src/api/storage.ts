export interface ConnectedUser {
  id: number;
  username: string;
  email: string;
  role: string;
}

export function getConnectedUser(): ConnectedUser | null {
  const rawUser = localStorage.getItem("user");

  if (!rawUser) {
    return null;
  }

  return JSON.parse(rawUser);
}

export function setConnectedUser(user: ConnectedUser) {
  localStorage.setItem("user", JSON.stringify(user));
}

export function clearConnectedUser() {
  localStorage.removeItem("user");
}