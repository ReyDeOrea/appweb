import { SupabasePetRepository } from "../infraestructure/petDataSource";

const repository = new SupabasePetRepository();

export async function getPetByIdUseCase(id: string) {
  if (!id) {
    throw new Error("ID inválido");
  }

  return await repository.getPetById(id);
}