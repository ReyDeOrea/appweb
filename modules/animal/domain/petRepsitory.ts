import { Pet } from "./pet";
export interface PetRepository {
  getPets(): Promise<Pet[]>;
  getPetById(id: string): Promise<Pet | null>;
  addPet(pet: Pet): Promise<void>;
  updatePet(pet: Pet): Promise<void>;
  deletePet(id: string): Promise<void>;
}

