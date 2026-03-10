import { Pet } from "../domain/pet";

export function checkAdoptionRequest(userId: string, petId: string): boolean {
  if (typeof window === "undefined") return false;

  const data = localStorage.getItem(`adoptionRequest_${userId}`);
  const requests: Pet[] = data ? JSON.parse(data) : [];

  const exists = requests.some((pet) => pet.id.toString() === petId);
  return exists;
}