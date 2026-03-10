import { supabase } from "@/lib/supabase/supabase";

export const getUserPets = async (): Promise<any[]> => {
  try {
    const u = typeof window !== "undefined" ? localStorage.getItem("user") : null;
    if (!u) return [];

    const user = JSON.parse(u);

    const { data, error } = await supabase
      .from("pets")
      .select("*")
      .eq("user", user.id);

    if (error) {
      throw new Error(error.message);
    }
    return data || [];
  } 
  catch (err: any) {
    console.error("Error obteniendo mascotas:", err);
    return [];
  }
};
 