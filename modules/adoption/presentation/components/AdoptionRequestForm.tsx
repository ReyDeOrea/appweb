"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { AdoptionRepository } from "../../infraestructure/adoptionDataSource";
import { CreateAdoptionRequest } from "../../application/createAdoption";
import { validateAdoptionForm } from "../../application/adoptionFormValidator";

const repository = new AdoptionRepository();
const createRequest = new CreateAdoptionRequest(repository);

export default function AdoptionForm() {
  const router = useRouter();
  const params = useSearchParams();

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [edad, setEdad] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [telefono, setTelefono] = useState("");

  const [pregunta_1, setPregunta1] = useState("");
  const [pregunta_2, setPregunta2] = useState("");
  const [pregunta_3, setPregunta3] = useState("");
  const [pregunta_4, setPregunta4] = useState("");
  const [pregunta_5, setPregunta5] = useState("");
  const [pregunta_6, setPregunta6] = useState("");
  const [pregunta_7, setPregunta7] = useState("");
  const [pregunta_8, setPregunta8] = useState("");
  const [pregunta_9, setPregunta9] = useState("");
  const [pregunta_10, setPregunta10] = useState("");
  const [pregunta_11, setPregunta11] = useState("");
  const [pregunta_12, setPregunta12] = useState("");
  const [pregunta_13, setPregunta13] = useState("");

  const enviarSolicitud = async () => {
    try {

      validateAdoptionForm({
        nombre,
        apellido,
        edad,
        ubicacion,
        telefono,
        pregunta_1,
        pregunta_2,
        pregunta_3,
        pregunta_4,
        pregunta_5,
        pregunta_6,
        pregunta_7,
        pregunta_8,
        pregunta_9,
        pregunta_10,
        pregunta_11,
        pregunta_12,
        pregunta_13,
      });

      const userData = localStorage.getItem("user");
      const user = JSON.parse(userData!);

      let pet: any = null;

      const petParam = params.get("pet");
      if (petParam) {
        pet = JSON.parse(petParam);
      }

      await createRequest.execute({
        pet_id: pet.id,
        user_id: user.id,
        owner_id: pet.user,
        adoptante_nombre: nombre,
        adoptante_apellido: apellido,
        adoptante_edad: Number(edad),
        adoptante_ubicacion: ubicacion,
        adoptante_telefono: telefono,
        pregunta_1,
        pregunta_2,
        pregunta_3,
        pregunta_4,
        pregunta_5,
        pregunta_6,
        pregunta_7,
        pregunta_8,
        pregunta_9,
        pregunta_10,
        pregunta_11,
        pregunta_12,
        pregunta_13,
      });

      const key = `adoptionRequest_${user.id}`;

      const data = localStorage.getItem(key);
      const requests = data ? JSON.parse(data) : [];

      const exists = requests.some((p: any) => String(p.id) === String(pet.id));

      if (!exists) {
        requests.push(pet);
      }

      localStorage.setItem(key, JSON.stringify(requests));

      alert("Solicitud enviada");
      router.back();

    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF8F0]">

      {/* HEADER */}
      <div className="bg-[#B7C979] flex items-center px-4 py-4">

        <button
          onClick={() => router.back()}
          className="text-white text-xl"
        >
          ←
        </button>

        <div className="flex-1 flex justify-center items-center gap-2">
          <h1 className="text-white text-2xl font-bold">Animaland</h1>
          🐶
        </div>

      </div>

      {/* FORM */}
      <div className="max-w-2xl mx-auto p-6">

        <h2 className="text-lg font-bold mb-4">Datos personales</h2>

        <label className="block text-gray-700">Nombre</label>
        <input
          className="w-full border rounded-lg p-3 mb-3"
          onChange={(e) => setNombre(e.target.value)}
        />

        <label className="block text-gray-700">Apellido</label>
        <input
          className="w-full border rounded-lg p-3 mb-3"
          onChange={(e) => setApellido(e.target.value)}
        />

        <label className="block text-gray-700">Edad</label>
        <input
          type="number"
          className="w-full border rounded-lg p-3 mb-3"
          onChange={(e) => setEdad(e.target.value)}
        />

        <label className="block text-gray-700">Ubicación</label>
        <input
          className="w-full border rounded-lg p-3 mb-3"
          onChange={(e) => setUbicacion(e.target.value)}
        />

        <label className="block text-gray-700">Teléfono</label>
        <input
          className="w-full border rounded-lg p-3 mb-3"
          onChange={(e) => setTelefono(e.target.value)}
        />

        <h2 className="text-lg font-bold mt-6 mb-4">Preguntas</h2>

        <label>¿Por qué quieres adoptar una mascota?</label>
        <textarea
          className="w-full border rounded-lg p-3 mb-3"
          onChange={(e) => setPregunta1(e.target.value)}
        />

        <label>¿Vives en casa o departamento?</label>
        <input
          className="w-full border rounded-lg p-3 mb-3"
          onChange={(e) => setPregunta2(e.target.value)}
        />

        <label>Si es rentado ¿te permiten mascotas?</label>
        <input
          className="w-full border rounded-lg p-3 mb-3"
          onChange={(e) => setPregunta3(e.target.value)}
        />

        <label>¿Tienes jardín o espacio exterior?</label>
        <input
          className="w-full border rounded-lg p-3 mb-3"
          onChange={(e) => setPregunta4(e.target.value)}
        />

        <label>¿Has tenido mascotas antes?</label>
        <input
          className="w-full border rounded-lg p-3 mb-3"
          onChange={(e) => setPregunta5(e.target.value)}
        />

        <label>¿Qué pasó con esas mascotas?</label>
        <textarea
          className="w-full border rounded-lg p-3 mb-3"
          onChange={(e) => setPregunta6(e.target.value)}
        />

        <label>¿Actualmente tienes mascotas?</label>
        <input
          className="w-full border rounded-lg p-3 mb-3"
          onChange={(e) => setPregunta7(e.target.value)}
        />

        <label>¿Qué tipo y cuántas?</label>
        <input
          className="w-full border rounded-lg p-3 mb-3"
          onChange={(e) => setPregunta8(e.target.value)}
        />

        <label>¿Cuánto tiempo estará sola la mascota?</label>
        <input
          className="w-full border rounded-lg p-3 mb-3"
          onChange={(e) => setPregunta9(e.target.value)}
        />

        <label>¿Quién cuidará cuando no estés?</label>
        <input
          className="w-full border rounded-lg p-3 mb-3"
          onChange={(e) => setPregunta10(e.target.value)}
        />

        <label>¿Todos están de acuerdo con la adopción?</label>
        <input
          className="w-full border rounded-lg p-3 mb-3"
          onChange={(e) => setPregunta11(e.target.value)}
        />

        <label>¿Presupuesto mensual para la mascota?</label>
        <input
          className="w-full border rounded-lg p-3 mb-3"
          onChange={(e) => setPregunta12(e.target.value)}
        />

        <label>¿Aceptas esterilización/castración si es necesario?</label>
        <input
          className="w-full border rounded-lg p-3 mb-3"
          onChange={(e) => setPregunta13(e.target.value)}
        />

        <button
          onClick={enviarSolicitud}
          className="w-full bg-[#E5DCCC] font-bold py-4 rounded-xl mt-4 hover:opacity-90"
        >
          Enviar solicitud
        </button>

      </div>
    </div>
  );
}