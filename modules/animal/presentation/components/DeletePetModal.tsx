"use client";

import React from "react";
import { deletePetUseCase } from "../../application/deletePet";
import { FaExclamationTriangle } from "react-icons/fa";

interface DeletePetModalProps {
  visible: boolean;
  onClose: () => void;
  petId: string | null;
  onDeleted?: () => void;
}

export default function DeletePetModal({
  visible,
  onClose,
  petId,
  onDeleted,
}: DeletePetModalProps) {

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
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">

      <div className="bg-white w-[90%] max-w-md p-6 rounded-2xl shadow-xl animate-fadeIn">

        <div className="flex justify-center mb-4">
          <div className="bg-red-100 p-4 rounded-full">
            <FaExclamationTriangle className="text-red-500 text-2xl" />
          </div>
        </div>

        <h2 className="text-center text-xl font-bold text-gray-900 mb-2">
          Eliminar Mascota
        </h2>

        <p className="text-center text-gray-700 mb-6">
          ¿Estás seguro de eliminar esta mascota? Esta acción no se puede deshacer.
        </p>

        <div className="flex gap-3">

          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-gray-300 text-gray-800 font-semibold hover:bg-gray-100 transition"
          >
            Cancelar
          </button>

          <button
            onClick={confirmDelete}
            className="flex-1 py-3 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition"
          >
            Eliminar
          </button>

        </div>
      </div>
    </div>
  );
}