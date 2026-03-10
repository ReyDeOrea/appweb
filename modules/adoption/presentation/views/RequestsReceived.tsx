"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdoptionRepository } from "../../infraestructure/adoptionDataSource";
import { GetRequestsForMyPets } from "../../application/getRequestReceived";
import { RequestStatus } from "../../application/statusRequest";

const repository = new AdoptionRepository();
const getUserRequests = new GetRequestsForMyPets(repository);
const updateStatus = new RequestStatus(repository);

export default function RequestsReceived() {
  const [requests, setRequests] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const userData = localStorage.getItem("user");
      if (!userData) return;

      const user = JSON.parse(userData);
      let data = await getUserRequests.execute(user.id);

      if (!data) {
        setRequests([]);
        return;
      }

      data = await Promise.all(
        data.map(async (request: any) => {
          const pet = await repository.getPetById(request.pet_id);
          return { ...request, pet_name: pet?.name || "Desconocida" };
        })
      );

      setRequests(data);
    } catch (error) {
      console.error("Error cargando solicitudes:", error);
    }
  };

  const aceptar = async (id: string) => {
    await updateStatus.execute(id, "aceptado");
    loadRequests();
  };

  const rechazar = async (id: string) => {
    await updateStatus.execute(id, "rechazado");
    loadRequests();
  };

  const verSolicitud = (request: any) => {
    router.push(`/adoption/viewRequestForm?request=${encodeURIComponent(JSON.stringify(request))}`);
  };

  if (requests.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-600 text-lg">No hay solicitudes</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <ul className="max-w-xl mx-auto space-y-4">
        {requests.map((item) => (
          <li
            key={item.id}
            className="bg-white p-4 rounded-lg shadow cursor-pointer hover:bg-gray-50"
            onClick={() => verSolicitud(item)}
          >
            <p className="text-gray-800 text-lg">
              <span className="font-bold">Mascota: </span>{item.pet_name}
            </p>
            <p className="text-gray-800 text-lg">
              <span className="font-bold">Adoptante: </span>{item.adoptante_nombre} {item.adoptante_apellido}
            </p>
            <p className="text-gray-800 text-lg">
              <span className="font-bold">Estado: </span>{item.estado}
            </p>

            {item.estado === "en_proceso" && (
              <div className="flex space-x-3 mt-4">
                <button
                  onClick={(e) => { e.stopPropagation(); aceptar(item.id); }}
                  className="flex-1 bg-green-300 py-2 rounded font-bold text-black"
                >
                  Aceptar
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); rechazar(item.id); }}
                  className="flex-1 bg-red-300 py-2 rounded font-bold text-black"
                >
                  Rechazar
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}