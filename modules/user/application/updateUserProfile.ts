import { supabase } from "@/lib/supabase/supabase";

interface UpdateUserProfileInput {
  username: string;
  phone: string;
  avatar_url?: string;
}

export const updateUserProfile = async(user: { email: string; [key: string]: any }, update: UpdateUserProfileInput) => {
  const { data, error } = await supabase
    .from("clients")
    .update(update)
    .eq("email", user.email)
    .select()
    .single();

  if (error) throw error;

  return data;
};