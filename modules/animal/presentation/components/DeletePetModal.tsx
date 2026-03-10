"use client";

import React from "react";
import { deletePetUseCase } from "../../application/deletePet";

interface DeletePetModalProps {
  visible: boolean;
  onClose: () => void;
  petId: string | null;
  onDeleted?: () => void;
}

export default function DeletePetModal({ visible, onClose, petId, onDeleted }: DeletePetModalProps) {

  const handleDeletePet = async () => {
    if (!petId) return;

    try {
      await deletePetUseCase(petId);
      alert("Mascota eliminada");
      onClose();
      onDeleted && onDeleted();
    } catch (error: any) {
      alert("Error: " + error.message);
    }
  };

  const confirmDelete = () => {
    const confirmed = confirm(
      "¿Estás seguro de querer eliminar esta mascota? Esta acción no se puede deshacer."
    );
    if (confirmed) handleDeletePet();
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white w-4/5 sm:w-1/2 md:w-1/3 p-5 rounded-lg shadow-lg">

        <div className="w-full h-14 bg-yellow-400 flex justify-center items-center rounded-t-md mb-4">
          <h2 className="text-white font-bold text-lg">Eliminar Mascota</h2>
        </div>

        <p className="mb-6 text-center">
          ¿Estás seguro de querer eliminar el perfil del animal?
        </p>

        <div className="flex justify-between gap-4">
          <button
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded"
            onClick={onClose}
          >
            No
          </button>
          <button
            className="flex-1 bg-yellow-200 hover:bg-yellow-300 text-black font-bold py-2 rounded"
            onClick={confirmDelete}
          >
            Sí
          </button>
        </div>
      </div>
    </div>
  );
}