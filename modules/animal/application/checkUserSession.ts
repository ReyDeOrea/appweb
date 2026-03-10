
export function checkUserSession(): boolean {

  if (typeof window === "undefined") return false;

  const userSession = localStorage.getItem("user");
  return !!userSession;
}

export function getUserData(): any | null {
  if (typeof window === "undefined") return null;

  const userData = localStorage.getItem("user");
  return userData ? JSON.parse(userData) : null;
}