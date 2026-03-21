"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AdoptionRepository } from "../../infraestructure/adoptionDataSource";
import { FaPaw } from "react-icons/fa";

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

  
  const [currentImage, setCurrentImage] = useState(0);

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

  
  const nextImage = () => {
    if (!request?.pet_images) return;
    setCurrentImage((prev) =>
      prev === request.pet_images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    if (!request?.pet_images) return;
    setCurrentImage((prev) =>
      prev === 0 ? request.pet_images.length - 1 : prev - 1
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
        <div className="bg-[#B7C979] py-6 shadow-md">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="text-white font-bold hover:underline"
          >
            &#8592; Volver
          </button>

          <div className="flex items-center gap-3">
            <h1 className="text-white font-bold text-3xl md:text-4xl">
              Animaland
            </h1>
            <span className="text-white text-3xl md:text-4xl"> <FaPaw/></span>
          </div>

          <div className="w-[70px]" />
        </div>
      </div>

      <div className="p-4 max-w-3xl mx-auto space-y-6">
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="font-bold text-black text-lg mb-2">Mascota</h2>
          <p>
            <span className="font-bold text-black">Nombre:</span>
            <span className="text-black"> {request.pet_name}</span>
          </p>

          {request.pet_images?.length > 0 && (
            <div className="relative flex items-center justify-center mt-4">

              <button
                onClick={prevImage}
                className="absolute left-0 bg-black/50 text-white px-3 py-1 rounded-full"
              >
                ‹
              </button>

              <img
                src={request.pet_images[currentImage]}
                alt="Pet"
                className="w-96 h-72 rounded-lg object-cover"
              />

              <button
                onClick={nextImage}
                className="absolute right-0 bg-black/50 text-white px-3 py-1 rounded-full"
              >
                ›
              </button>

            </div>
          )}
        </div>

        
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="font-bold text-black text-lg mb-2">Datos del adoptante</h2>
          <p>
            <span className="font-bold text-black">Nombre: </span>
            <span className="text-black">
              {request.adoptante_nombre} {request.adoptante_apellido}
            </span>
          </p>
          <p>
            <span className="font-bold text-black">Edad: </span>
            <span className="text-black">{request.adoptante_edad}</span>
          </p>
          <p>
            <span className="font-bold text-black">Ubicación: </span>
            <span className="text-black">{request.adoptante_ubicacion}</span>
          </p>
          <p>
            <span className="font-bold text-black">Teléfono: </span>
            <span className="text-black">{request.adoptante_telefono}</span>
          </p>
        </div>

        
        <div className="bg-white p-4 rounded-lg shadow space-y-4">
          <h2 className="font-bold text-lg mb-2 text-black">Preguntas del formulario</h2>
          {preguntas.map((pregunta, i) => (
            <div key={i}>
              <p className="font-bold text-black">{pregunta}</p>
              <p className="ml-2 mt-1 text-black">
                {request[`pregunta_${i + 1}`] ?? "Sin respuesta"}
              </p>
            </div>
          ))}
        </div>

        
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="font-bold text-lg mb-2 text-black">Estado de la solicitud</h2>
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