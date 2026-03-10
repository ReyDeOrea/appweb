"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AdoptionRepository } from "../../infraestructure/adoptionDataSource";
import { CreateAdoptionRequest } from "../../application/createAdoption";
import { validateAdoptionForm } from "../../application/adoptionFormValidator";

const repository = new AdoptionRepository();
const createRequest = new CreateAdoptionRequest(repository);

export default function AdoptionForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const petParam = searchParams.get("pet");
  const pet = petParam ? JSON.parse(petParam) : null;

  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    edad: "",
    ubicacion: "",
    telefono: "",
    pregunta_1: "",
    pregunta_2: "",
    pregunta_3: "",
    pregunta_4: "",
    pregunta_5: "",
    pregunta_6: "",
    pregunta_7: "",
    pregunta_8: "",
    pregunta_9: "",
    pregunta_10: "",
    pregunta_11: "",
    pregunta_12: "",
    pregunta_13: "",
  });

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const enviarSolicitud = async () => {
    try {
      validateAdoptionForm(form);

      const userData = localStorage.getItem("user");
      if (!userData) throw new Error("Usuario no encontrado");

      const user = JSON.parse(userData);

      if (!pet) throw new Error("Mascota no seleccionada");

      await createRequest.execute({
        pet_id: pet.id,
        user_id: user.id,
        owner_id: pet.user,
        adoptante_nombre: form.nombre,
        adoptante_apellido: form.apellido,
        adoptante_edad: Number(form.edad),
        adoptante_ubicacion: form.ubicacion,
        adoptante_telefono: form.telefono,
        pregunta_1: form.pregunta_1,
        pregunta_2: form.pregunta_2,
        pregunta_3: form.pregunta_3,
        pregunta_4: form.pregunta_4,
        pregunta_5: form.pregunta_5,
        pregunta_6: form.pregunta_6,
        pregunta_7: form.pregunta_7,
        pregunta_8: form.pregunta_8,
        pregunta_9: form.pregunta_9,
        pregunta_10: form.pregunta_10,
        pregunta_11: form.pregunta_11,
        pregunta_12: form.pregunta_12,
        pregunta_13: form.pregunta_13,
      });

      alert("Solicitud enviada");
      router.back();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF8F0]">
      {/* Header */}
      <div className="bg-[#B7C979] flex items-center p-4 pt-12">
        <button onClick={() => router.back()} className="text-white mr-4 text-2xl">
          &#8592;
        </button>
        <div className="flex items-center justify-center flex-1">
          <h1 className="text-white font-bold text-3xl mr-2">Animaland</h1>
          <span className="material-icons text-white text-3xl">pets</span>
        </div>
      </div>

      {/* Form */}
      <div className="p-5 max-w-2xl mx-auto">
        <h2 className="text-xl font-bold mb-4 mt-4">Datos personales</h2>

        <label className="block mb-1">Nombre</label>
        <input
          className="w-full border border-[#E8E0D0] bg-white rounded-lg p-3 mb-4"
          value={form.nombre}
          onChange={(e) => handleChange("nombre", e.target.value)}
        />

        <label className="block mb-1">Apellido</label>
        <input
          className="w-full border border-[#E8E0D0] bg-white rounded-lg p-3 mb-4"
          value={form.apellido}
          onChange={(e) => handleChange("apellido", e.target.value)}
        />

        <label className="block mb-1">Edad</label>
        <input
          type="number"
          className="w-full border border-[#E8E0D0] bg-white rounded-lg p-3 mb-4"
          value={form.edad}
          onChange={(e) => handleChange("edad", e.target.value)}
        />

        <label className="block mb-1">Ubicación</label>
        <input
          className="w-full border border-[#E8E0D0] bg-white rounded-lg p-3 mb-4"
          value={form.ubicacion}
          onChange={(e) => handleChange("ubicacion", e.target.value)}
        />

        <label className="block mb-1">Teléfono</label>
        <input
          type="tel"
          className="w-full border border-[#E8E0D0] bg-white rounded-lg p-3 mb-4"
          value={form.telefono}
          onChange={(e) => handleChange("telefono", e.target.value)}
        />

        <h2 className="text-xl font-bold mb-4 mt-6">Preguntas</h2>

        {Array.from({ length: 13 }, (_, i) => (
          <div key={i} className="mb-4">
            <label className="block mb-1">
              {getQuestionLabel(i + 1)}
            </label>
            <textarea
              className="w-full border border-[#E8E0D0] bg-white rounded-lg p-3 h-24 resize-none"
              value={form[`pregunta_${i + 1}` as keyof typeof form]}
              onChange={(e) => handleChange(`pregunta_${i + 1}`, e.target.value)}
            />
          </div>
        ))}

        <button
          onClick={enviarSolicitud}
          className="w-full bg-[#E5DCCC] py-4 rounded-xl font-bold mt-4 mb-10"
        >
          Enviar solicitud
        </button>
      </div>
    </div>
  );
}

function getQuestionLabel(n: number) {
  const questions = [
    "¿Por qué quieres adoptar una mascota?",
    "¿Vives en casa o departamento?",
    "Si es rentado ¿te permiten mascotas?",
    "¿Tienes jardín o espacio exterior?",
    "¿Has tenido mascotas antes?",
    "¿Qué pasó con esas mascotas?",
    "¿Actualmente tienes mascotas?",
    "¿Qué tipo y cuántas?",
    "¿Cuánto tiempo estará sola la mascota?",
    "¿Quién cuidará cuando no estés?",
    "¿Todos están de acuerdo con la adopción?",
    "¿Presupuesto mensual para la mascota?",
    "¿Aceptas esterilización/castración si es necesario?",
  ];
  return questions[n - 1];
}