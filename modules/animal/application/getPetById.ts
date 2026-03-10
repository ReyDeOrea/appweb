import { getPeId } from "../infraestructure/petDataSource";

export async function getPetByIdUseCase(id: string) {
  if (!id) {
    throw new Error("ID inválido");
  }
  return await getPeId(id);
}