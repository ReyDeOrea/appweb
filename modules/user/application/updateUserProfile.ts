import { supabase } from "@/lib/supabase/supabase";

export const updateUserProfile = async (
  user: any,
  updates: { username: string; phone: string; avatar_url: string; email: string }
) => {

  const { error } = await supabase
    .from("clients")
    .update(updates)
    .eq("email", user.email);

  if (error) throw error;

  const newUser = { ...user, ...updates };

  if (typeof window !== "undefined") {
    localStorage.setItem("user", JSON.stringify(newUser));
  }

  return newUser;
};