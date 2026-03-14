import { Pet } from "../domain/pet";
import { SupabasePetRepository } from "../infraestructure/petDataSource";

export async function getPetsUseCase(): Promise<Pet[]> {
  const repository = new SupabasePetRepository();
  return await repository.getPets();
}