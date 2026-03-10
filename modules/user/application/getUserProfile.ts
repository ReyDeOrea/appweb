
export const getUserProfile =(): any | null => {
  try {
    if (typeof window === "undefined") return null;

    const u = localStorage.getItem("user");
    if (!u) return null;
    return JSON.parse(u);
  } 
  catch (error) {
    console.error("Error obteniendo perfil de usuario:", error);
    return null;
  }
};