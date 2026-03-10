import { Pet } from "../domain/pet";

export function checkFavoritePet(userId: string, petId: string): boolean {
  if (typeof window === "undefined") return false;

  const data = localStorage.getItem(`favorites_${userId}`);
  const favorites: Pet[] = data ? JSON.parse(data) : [];

  const exists = favorites.some((pet) => pet.id.toString() === petId);
  return exists;
}