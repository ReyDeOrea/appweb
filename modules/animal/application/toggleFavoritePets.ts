import { Pet } from "../domain/pet";

export async function toggleFavoritePet(userId: string, pet: Pet): Promise<boolean> {
  if (typeof window === "undefined") return false;

  const data = localStorage.getItem(`favorites_${userId}`);
  let favorites: Pet[] = data ? JSON.parse(data) : [];

  let isFavorite = favorites.some((p) => p.id === pet.id);

  if (isFavorite) {
    favorites = favorites.filter((p) => p.id !== pet.id);
    isFavorite = false;
  } else {
    favorites.push(pet);
    isFavorite = true;
  }

  localStorage.setItem(`favorites_${userId}`, JSON.stringify(favorites));

  return isFavorite;
}