import { deletePet } from "../infraestructure/petDataSource";

export async function deletePetUseCase(id: string) {
  if (!id) {
    throw new Error("ID inválido");
  }
  const success = await deletePet(id);
  if (!success) {
    throw new Error("No se pudo eliminar la mascota");
  }
  return true;
}