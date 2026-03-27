import { supabase } from "@/lib/supabase/supabase";
import { Pet } from "../../domain/pet";



export async function ImgS(): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .storage
      .from('IMG')
      .list('pet');
    if (error)
      throw error;
    return data.map(item => `https://hrojphcqktmijvagyrha.supabase.co/storage/v1/object/public/IMG/pet/${item.name}`);
  }
  catch (e) {
    console.log(e);
    return [];
  }
}

export async function saveDB(pet: Partial<Pet>): Promise<Pet | null> {
  try {
    const { data, error } = await supabase
      .from("pets")
      .insert([{
        type: pet.type ?? "dog", 
        name: pet.name ?? "Sin nombre",
        sex: pet.sex ?? "m",
        adopted: pet.adopted ?? false,
        user: pet.user ?? "unknown",
        image_url: pet.image_url ?? ""
      }])
      .select();

    if (error) throw error;

    return data ? data[0] : null;
  } catch (e) {
    console.log("ERROR EN saveDB:", e);
    return null;
  }
}

export async function saveS(file: { uri: string }): Promise<string | null> {
  try {
    if (!file?.uri) throw new Error('No file URI provided');

   const res = await fetch(file.uri);
    const blob = await res.blob();
    const fileName = `${Date.now()}-${Math.floor(Math.random() * 10000)}.jpg`;
    const { data, error } = await supabase.storage
      .from("IMG")
      .upload(`pet/${fileName}`, blob, {
        contentType: "image/jpeg",
      });

    if (error) throw error;
    const { data: publicUrl } = supabase.storage
      .from("IMG")
      .getPublicUrl(`pet/${fileName}`);

    return publicUrl.publicUrl;
  } catch (e) {
    console.log("ERROR EN saveS:", e);
    return null;
  }
}

