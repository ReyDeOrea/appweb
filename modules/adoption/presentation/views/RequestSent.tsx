"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdoptionRepository } from "../../infraestructure/adoptionDataSource";
import { GetUserRequests } from "../../application/getRequestSent";

const repository = new AdoptionRepository();
const getUserRequests = new GetUserRequests(repository);

export default function RequestsSent() {
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

      data = await Promise.all(
        data.map(async (request: any) => {
          const pet = await repository.getPetById(request.pet_id);
          return { ...request, pet_name: pet?.name || "Desconocida" };
        })
      );

      setRequests(data || []);
    } catch (error) {
      console.error("Error cargando solicitudes enviadas:", error);
    }
  };

  const verSolicitud = (request: any) => {
    router.push(`/adoption/viewRequestForm?request=${encodeURIComponent(JSON.stringify(request))}`);
  };

  if (requests.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-600 text-lg">No has enviado solicitudes</p>
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
              <span className="font-bold">Mascota:</span> {item.pet_name}
            </p>
            <p className="text-gray-800 text-lg">
              <span className="font-bold">Estado:</span> {item.estado}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}