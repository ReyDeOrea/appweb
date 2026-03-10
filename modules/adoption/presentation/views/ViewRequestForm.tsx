"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AdoptionRepository } from "../../infraestructure/adoptionDataSource";

const repository = new AdoptionRepository();

const preguntas = [
  "1. ¿Por qué quieres adoptar una mascota?",
  "2. ¿Vives en casa o departamento?",
  "3. Si es rentado ¿te permiten mascotas?",
  "4. ¿Tienes jardín o espacio exterior?",
  "5. ¿Cuánto tiempo puedes dedicarle diariamente?",
  "6. ¿Has tenido mascotas antes?",
  "7. ¿Actualmente tienes mascotas?",
  "8. ¿Qué tipo y cuántas?",
  "9. ¿Cuánto tiempo estará sola la mascota?",
  "10. ¿Quién cuidará de la mascota cuando no estés?",
  "11. ¿Todos en casa están de acuerdo con la adopción?",
  "12. ¿Cuál es tu presupuesto mensual para la mascota?",
  "13. ¿Aceptas esterilización/castración si es necesario?",
];

const statusColors: Record<string, { bg: string; text: string }> = {
  aceptado: { bg: "bg-green-200", text: "text-green-900" },
  rechazado: { bg: "bg-red-200", text: "text-red-900" },
  "en espera": { bg: "bg-yellow-200", text: "text-yellow-900" },
};

export default function ViewRequest() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [request, setRequest] = useState<any>(null);

  useEffect(() => {
    const loadRequest = async () => {
      const param = searchParams.get("request");
      if (!param) return;

      try {
        const parsedRequest = JSON.parse(param);
        let pet = await repository.getPetById(parsedRequest.pet_id);
        let images: string[] = [];

        if (pet) {
          images = Array.isArray(pet.image_url)
            ? pet.image_url
            : typeof pet.image_url === "string"
            ? JSON.parse(pet.image_url)
            : [pet.image_url];
        }

        setRequest({
          ...parsedRequest,
          pet_name: pet?.name ?? "Desconocida",
          pet_images: images,
        });
      } catch (err) {
        console.error("Error parseando la solicitud:", err);
      }
    };

    loadRequest();
  }, [searchParams]);

  if (!request) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-600 text-lg">No se encontró la solicitud</p>
      </div>
    );
  }

  const statusKey = request.estado?.trim().toLowerCase() || "en espera";
  const statusStyle = statusColors[statusKey] ?? statusColors["en espera"];

  return (
    <div className="min-h-screen bg-gray-100">
     
      <div className="bg-green-400 flex items-center p-4">
        <button
          className="text-white mr-4"
          onClick={() => router.back()}
        >
          &#8592; Volver
        </button>
        <div className="flex items-center space-x-2">
          <h1 className="text-white text-2xl font-bold">Animaland</h1>
          <span className="text-white text-2xl">🐶</span>
        </div>
      </div>

      <div className="p-4 max-w-3xl mx-auto space-y-6">
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="font-bold text-lg mb-2">Mascota</h2>
          <p>
            <span className="font-bold">Nombre:</span> {request.pet_name}
          </p>
          {request.pet_images?.length > 0 && (
            <div className="flex space-x-4 overflow-x-auto mt-2">
              {request.pet_images.map((img: string, index: number) => (
                <img
                  key={index}
                  src={img}
                  alt={`Pet ${index}`}
                  className="w-72 h-64 rounded-lg object-cover flex-shrink-0"
                />
              ))}
            </div>
          )}
        </div>

     
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="font-bold text-lg mb-2">Datos del adoptante</h2>
          <p>
            <span className="font-bold">Nombre:</span>{" "}
            {request.adoptante_nombre} {request.adoptante_apellido}
          </p>
          <p>
            <span className="font-bold">Edad:</span> {request.adoptante_edad}
          </p>
          <p>
            <span className="font-bold">Ubicación:</span> {request.adoptante_ubicacion}
          </p>
          <p>
            <span className="font-bold">Teléfono:</span> {request.adoptante_telefono}
          </p>
        </div>

     
        <div className="bg-white p-4 rounded-lg shadow space-y-4">
          <h2 className="font-bold text-lg mb-2">Preguntas del formulario</h2>
          {preguntas.map((pregunta, i) => (
            <div key={i}>
              <p className="font-bold">{pregunta}</p>
              <p className="ml-2 mt-1">{request[`pregunta_${i + 1}`] ?? "Sin respuesta"}</p>
            </div>
          ))}
        </div>

        
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="font-bold text-lg mb-2">Estado de la solicitud</h2>
          <span
            className={`${statusStyle.bg} ${statusStyle.text} font-bold px-4 py-2 rounded-full inline-block`}
          >
            {request.estado?.toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  );
}