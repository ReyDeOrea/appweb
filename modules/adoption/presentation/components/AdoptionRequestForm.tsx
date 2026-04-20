"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { AdoptionRepository } from "../../infraestructure/adoptionDataSource";
import { CreateAdoptionRequest } from "../../application/createAdoption";
import { validateAdoptionForm } from "../../application/adoptionFormValidator";
import { FaPaw } from "react-icons/fa";

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

  const inputStyle =
    "w-full text-black border border-[#E8E0D0] bg-white rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#D4B37A] focus:border-[#D4B37A] transition";
  const textareaStyle =
    "w-full text-black border border-[#E8E0D0] bg-white rounded-xl p-3 min-h-[110px] outline-none focus:ring-2 focus:ring-[#D4B37A] focus:border-[#D4B37A] transition resize-none";

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

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-md p-6 md:p-8">
          <h2 className="text-center font-bold text-2xl text-[#311c1c] mb-8">
            Formulario de adopción
          </h2>

          <div className="space-y-10">
            <div>
              <h3 className="font-bold text-lg text-[#311c1c] mb-5">
                Datos personales
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-gray-600 text-sm font-medium mb-2">
                    Nombre
                  </label>
                  <input
                    className={inputStyle}
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-gray-600 text-sm font-medium mb-2">
                    Apellido/s
                  </label>
                  <input
                    className={inputStyle}
                    value={apellido}
                    onChange={(e) => setApellido(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-gray-600 text-sm font-medium mb-2">
                    Edad
                  </label>
                  <input
                    type="number"
                    className={inputStyle}
                    value={edad}
                    onChange={(e) => setEdad(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-gray-600 text-sm font-medium mb-2">
                    Teléfono
                  </label>
                  <input
                    type="number"
                    className={inputStyle}
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-gray-600 text-sm font-medium mb-2">
                    Ubicación
                  </label>
                  <input
                    className={inputStyle}
                    value={ubicacion}
                    onChange={(e) => setUbicacion(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg text-[#311c1c] mb-5">
                Preguntas del formulario
              </h3>

              <div className="grid grid-cols-1 gap-5">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    1. ¿Por qué quieres adoptar una mascota?
                  </label>
                  <textarea
                    className={textareaStyle}
                    value={pregunta_1}
                    onChange={(e) => setPregunta1(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    2. ¿Vives en casa o departamento?
                  </label>
                  <input
                    className={inputStyle}
                    value={pregunta_2}
                    onChange={(e) => setPregunta2(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    3. Si es rentado ¿te permiten mascotas?
                  </label>
                  <input
                    className={inputStyle}
                    value={pregunta_3}
                    onChange={(e) => setPregunta3(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    4. ¿Tienes jardín o espacio exterior?
                  </label>
                  <input
                    className={inputStyle}
                    value={pregunta_4}
                    onChange={(e) => setPregunta4(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    5. ¿Has tenido mascotas antes?
                  </label>
                  <input
                    className={inputStyle}
                    value={pregunta_5}
                    onChange={(e) => setPregunta5(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    6. ¿Qué pasó con esas mascotas?
                  </label>
                  <textarea
                    className={textareaStyle}
                    value={pregunta_6}
                    onChange={(e) => setPregunta6(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    7. ¿Actualmente tienes mascotas?
                  </label>
                  <input
                    className={inputStyle}
                    value={pregunta_7}
                    onChange={(e) => setPregunta7(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    8. ¿Qué tipo y cuántas?
                  </label>
                  <input
                    className={inputStyle}
                    value={pregunta_8}
                    onChange={(e) => setPregunta8(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    9. ¿Cuánto tiempo estará sola la mascota?
                  </label>
                  <input
                    className={inputStyle}
                    value={pregunta_9}
                    onChange={(e) => setPregunta9(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    10. ¿Quién cuidará a la mascota cuando no estés?
                  </label>
                  <input
                    className={inputStyle}
                    value={pregunta_10}
                    onChange={(e) => setPregunta10(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    11. ¿Todos están de acuerdo con la adopción?
                  </label>
                  <input
                    className={inputStyle}
                    value={pregunta_11}
                    onChange={(e) => setPregunta11(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    12. ¿Cúal es tu presupuesto mensual?
                  </label>
                  <input
                    className={inputStyle}
                    value={pregunta_12}
                    onChange={(e) => setPregunta12(e.target.value)}
                    type="number"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    13.  ¿Aceptas esterilización/castración si es necesario?
                  </label>
                  <input
                    className={inputStyle}
                    value={pregunta_13}
                    onChange={(e) => setPregunta13(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={enviarSolicitud}
                className="w-full md:w-auto md:px-20 bg-[#D4B37A] hover:bg-[#c8a66b] text-white font-bold py-4 rounded-xl transition"
              >
                Enviar solicitud
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}