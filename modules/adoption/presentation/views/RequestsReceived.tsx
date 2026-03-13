"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GetRequestsForMyPets } from "../../application/getRequestReceived";
import { RequestStatus } from "../../application/statusRequest";
import { AdoptionRepository } from "../../infraestructure/adoptionDataSource";

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

          return {
            ...request,
            pet_name: pet?.name || "Desconocida",
          };
        })
      );

      setRequests(data);
    } catch (error) {
      console.error("Error cargando solicitudes:", error);
    }
  };

  const aceptar = async (Rid: string, pet_id: number) => {
    try {
      await updateStatus.execute(Rid, "aceptado");

      await repository.updateStatusPet(pet_id, { adopted: true });

      loadRequests();
    } catch (error) {
      console.error("Error al aceptar solicitud:", error);
    }
  };

  const rechazar = async (id: string) => {
    try {
      await updateStatus.execute(id, "rechazado");

      loadRequests();
    } catch (error) {
      console.error("Error al rechazar solicitud:", error);
    }
  };

   const verSolicitud = (request: any) => {
    router.push(`/adoption/viewRequestForm?request=${encodeURIComponent(JSON.stringify(request))}`);
  };

  const llamarAdoptante = (telefono: string) => {
    window.location.href = `tel:${telefono}`;
  };

  return (
    <div className="pb-24">
      {requests.length === 0 ? (
        <p className="text-center mt-5 text-gray-500 text-lg">
          No hay solicitudes
        </p>
      ) : (
        requests.map((item) => (
          <div
            key={item.id}
            onClick={() => verSolicitud(item)}
            className="p-4 border-b bg-white cursor-pointer hover:bg-gray-50"
          >
            <p className="text-base mb-1">
              <span className="font-bold">Mascota: </span>
              {item.pet_name}
            </p>

            <p className="text-base mb-1">
              <span className="font-bold">Adoptante: </span>
              {item.adoptante_nombre} {item.adoptante_apellido}
            </p>

            <p className="text-base mb-1">
              <span className="font-bold">Estado: </span>
              {item.estado}
            </p>

            {item.estado === "en_proceso" && (
              <div
                className="flex gap-2 mt-3"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => aceptar(item.id, item.pet_id)}
                  className="bg-green-300 px-3 py-2 rounded font-bold"
                >
                  Aceptar
                </button>

                <button
                  onClick={() => rechazar(item.id)}
                  className="bg-red-300 px-3 py-2 rounded font-bold"
                >
                  Rechazar
                </button>
              </div>
            )}

            {item.estado === "aceptado" && item.adoptante_telefono && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  llamarAdoptante(item.adoptante_telefono);
                }}
                className="bg-blue-200 mt-3 px-3 py-2 rounded font-bold"
              >
                Llamar al adoptante ({item.adoptante_telefono})
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}