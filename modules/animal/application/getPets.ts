import { Pet } from "../domain/pet";
import { getPets } from "../infraestructure/petDataSource";

export async function getPetsUseCase(): Promise<Pet[]> {
  return await getPets();
}