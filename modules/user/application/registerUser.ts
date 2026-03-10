import { supabase } from "@/lib/supabase/supabase";

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

interface RegisterData {
  email: string;
  username: string;
  password: string;
  phone: string;
  avatar_url?: string;
}

export const registerUser =  async (data: RegisterData) => {

   const hashedPassword = await hashPassword(data.password);

 const { data: user, error } = await supabase
    .from("clients")
    .insert([{
      ...data,
      password: hashedPassword
    }])
    .select()
    .single();

  if (error) throw error;

  if (typeof window !== "undefined") {
    localStorage.setItem("user", JSON.stringify(user));
  }
  return user;
};