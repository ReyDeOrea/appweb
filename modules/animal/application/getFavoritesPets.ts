import { Pet } from "../domain/pet";
import { getPetsUseCase } from "./getPets";

export const getFavoritesPetsUseCase = async (): Promise<Pet[]> => {
  if (typeof window === "undefined") return [];

  const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;

  if (!user) return [];

  const data = localStorage.getItem(`favorites_${user.id}`);
  const favs: Pet[] = data ? JSON.parse(data) : [];

  const allPets = await getPetsUseCase();

  const updatedFavorites = favs.map(fav => {
    const updatedPet = allPets.find(p => p.id === fav.id);
    return updatedPet ? updatedPet : fav;
  });

  return updatedFavorites;
}