import { supabase } from "@/lib/supabase/supabase";


async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

export const loginUser = async (username: string, password: string) => {
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .eq("username", username)
    .single();
  
  if (error || !data) throw new Error("Usuario o contraseña incorrectos");

   const passwordHash = await hashPassword(password);

  if (passwordHash !== data.password) {
    throw new Error("Usuario o contraseña incorrectos");
  }
  if (typeof window !== "undefined") {
    localStorage.setItem("user", JSON.stringify(data));
  }

  return data;
};