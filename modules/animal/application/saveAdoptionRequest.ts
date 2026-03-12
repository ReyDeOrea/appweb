import { Pet } from "../domain/pet";

export function saveAdoptionRequest(userId: string, pet: Pet) {

  const key = `adoptionRequest_${userId}`;

  const data = localStorage.getItem(key);
  const requests: Pet[] = data ? JSON.parse(data) : [];

  const exists = requests.some(p => p.id === pet.id);

  if (!exists) {
    requests.push(pet);
  }

  localStorage.setItem(key, JSON.stringify(requests));
}