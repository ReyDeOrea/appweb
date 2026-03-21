"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PetSex, PetSize, PetType } from "../../domain/pet";
import { addPetUseCase } from "../../application/addPet";
import { saveS } from "../components/uploadImage";
import { FaPaw } from "react-icons/fa";
import { IoCameraOutline } from "react-icons/io5";

const petTypes: PetType[] = ["perro", "gato"];
const petSex: PetSex[] = ["macho", "hembra"];

export default function AddPetScreen() {
  const router = useRouter();
  const [type, setType] = useState<PetType | "">("");
  const [name, setName] = useState("");
  const [sex, setSex] = useState<PetSex | "">("");
  const [size, setSize] = useState<PetSize | "">("");
  const [age, setAge] = useState("");
  const [breed, setBreed] = useState("");
  const [healthInfo, setHealthInfo] = useState("");
  const [description, setDescription] = useState("");
  const [img, setImage] = useState<string[]>([]);
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [bannerPage, setBannerPage] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  const pickImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    const uris = files.map((f) => URL.createObjectURL(f));
    setImage(uris);
  };

  const clearFields = () => {
    setType("");
    setName("");
    setSex("");
    setAge("");
    setSize("");
    setBreed("");
    setHealthInfo("");
    setDescription("");
    setPhone("");
    setLocation("");
    setImage([]);
  };

  const savePet = async () => {
    if (img.length !== 5) {
      alert("Debes seleccionar exactamente 5 imágenes");
      setIsSaving(false);
      return;
    }

    if (isSaving) return;
    setIsSaving(true);

    try {
      const u = localStorage.getItem("user");
      if (!u) {
        alert("No hay sesión iniciada");
        setIsSaving(false);
        return;
      }

      const user = JSON.parse(u);
      let imageUrl: string[] = [];

      for (const uri of img) {
        const url = await saveS({ uri });
        if (!url) {
          alert("Error al subir una imagen");
          setIsSaving(false);
          return;
        }
        imageUrl.push(url);
      }

      await addPetUseCase({
        user: user.id,
        type: type as PetType,
        name: name.trim(),
        sex: sex as PetSex,
        age: age.trim(),
        size: size as PetSize,
        breed: breed.trim(),
        health_info: healthInfo.trim(),
        description: description.trim(),
        image_url: JSON.stringify(imageUrl),
        phone: phone.trim(),
        location: location.trim(),
      });

      alert("Mascota guardada");
      clearFields();
      router.back();

    } catch (error: any) {
      alert("Error: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

return (
    <div className="min-h-screen bg-[#FDF8F0]">
      <div className="bg-[#B7C979] py-6 shadow-md">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <button
            className="text-white font-bold hover:underline"
            onClick={() => router.back()}
          >
            &#8592; Volver
          </button>

          <div className="flex items-center gap-3">
            <h1 className="text-white font-bold text-3xl md:text-4xl">
              Animaland
            </h1>
            <span className="text-white text-3xl md:text-4xl">
              <FaPaw/>
            </span>
          </div>

          <div className="w-[70px]" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-8 items-start">

          <div className="xl:col-span-3 bg-white rounded-2xl shadow-md p-6 md:p-8">
            <h2 className="text-center font-bold text-2xl text-[#311c1c] mb-8">
              Registrar mascota
            </h2>

            <div className="space-y-8">
              <div>
                <h3 className="font-bold text-lg text-[#311c1c] mb-4">
                  Información básica
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <label className="block text-gray-600 text-sm font-medium mb-2">
                      Tipo de animal
                    </label>
                    <div className="flex gap-3">
                      {petTypes.map((t) => (
                        <button
                          key={t}
                          className={`px-4 py-2 text-black rounded-lg border transition ${
                            type === t
                              ? "bg-[#E5DCCC] border-[#DAC193]"
                              : "bg-white border-[#DAC193]"
                          }`}
                          onClick={() => setType(t)}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-600 text-sm font-medium mb-2">
                      Nombre del animal
                    </label>
                    <input
                      type="text"
                      placeholder="Nombre del animal"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="text-black border border-[#E8E0D0] rounded-lg p-3 text-sm w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-600 text-sm font-medium mb-2">
                      Edad
                    </label>
                    <input
                      type="text"
                      placeholder="Edad"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className="text-black border border-[#E8E0D0] rounded-lg p-3 text-sm w-full"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-gray-600 text-sm font-medium mb-2">
                      Sexo
                    </label>
                    <div className="flex gap-3 flex-wrap">
                      {petSex.map((s) => (
                        <button
                          key={s}
                          className={`px-4 py-2 text-black rounded-lg border transition ${
                            sex === s
                              ? "bg-[#E5DCCC] border-[#DAC193]"
                              : "bg-white border-[#DAC193]"
                          }`}
                          onClick={() => setSex(s)}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-gray-600 text-sm font-medium mb-2">
                      Tamaño
                    </label>
                    <div className="flex gap-3 flex-wrap">
                      {Object.values(PetSize).map((s) => (
                        <button
                          key={s}
                          className={`px-4 py-2 text-black rounded-lg border transition ${
                            size === s
                              ? "bg-[#E5DCCC] border-[#DAC193]"
                              : "bg-white border-[#DAC193]"
                          }`}
                          onClick={() => setSize(s)}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-600 text-sm font-medium mb-2">
                      Raza
                    </label>
                    <input
                      type="text"
                      placeholder="Raza"
                      value={breed}
                      onChange={(e) => setBreed(e.target.value)}
                      className="text-black border border-[#E8E0D0] rounded-lg p-3 text-sm w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-600 text-sm font-medium mb-2">
                      Ubicación
                    </label>
                    <input
                      type="text"
                      placeholder="Ubicación"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="text-black border border-[#E8E0D0] rounded-lg p-3 text-sm w-full"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-gray-600 text-sm font-medium mb-2">
                      Descripción
                    </label>
                    <textarea
                      placeholder="Da una breve descripción"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="text-black border border-[#E8E0D0] rounded-lg p-3 text-sm w-full h-28 resize-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-lg text-[#311c1c] mb-4">Salud</h3>
                <textarea
                  placeholder="Alergias / Vacunas / Discapacidad"
                  value={healthInfo}
                  onChange={(e) => setHealthInfo(e.target.value)}
                  className="text-black border border-[#E8E0D0] rounded-lg p-3 text-sm w-full h-24 resize-none"
                />
              </div>

              <div>
                <h3 className="font-bold text-lg text-[#311c1c] mb-4">
                  Contacto
                </h3>
                <input
                  type="text"
                  placeholder="Número de teléfono"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="text-black border border-[#E8E0D0] rounded-lg p-3 text-sm w-full"
                />
              </div>

              <div className="flex flex-col md:flex-row gap-4 pt-2">
                <button
                  className={`flex-1 bg-[#B7C979] hover:bg-[#aabd68] text-white font-semibold py-3 rounded-xl transition ${
                    isSaving ? "opacity-50" : ""
                  }`}
                  onClick={savePet}
                  disabled={isSaving}
                >
                  {isSaving ? "Guardando..." : "Guardar mascota"}
                </button>

                <button
                  className="flex-1 bg-[#E8B4B4] hover:bg-[#dda3a3] text-white font-semibold py-3 rounded-xl transition"
                  onClick={() => router.back()}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>


          <div className="xl:col-span-2 bg-white rounded-2xl shadow-md p-5 xl:sticky xl:top-6">
            <div className="flex justify-center mb-6">
              <label className="bg-[#D4B37A] hover:bg-[#c8a66b] transition px-5 py-3 rounded-xl flex items-center gap-2 cursor-pointer font-medium text-white">
                <span><IoCameraOutline /></span>
                <span>Subir 5 fotos</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={pickImage}
                />
              </label>
            </div>

            {img.length > 0 ? (
              <>
                <div className="relative flex justify-center mb-4">
                  <button
                    onClick={() =>
                      setBannerPage(
                        bannerPage === 0 ? img.length - 1 : bannerPage - 1
                      )
                    }
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 text-white px-3 py-2 rounded-full"
                  >
                    ‹
                  </button>

                  <img
                    src={img[bannerPage]}
                    className="w-full h-[320px] md:h-[420px] rounded-2xl object-cover"
                  />

                  <button
                    onClick={() =>
                      setBannerPage(
                        bannerPage === img.length - 1 ? 0 : bannerPage + 1
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 text-white px-3 py-2 rounded-full"
                  >
                    ›
                  </button>
                </div>

                <div className="flex justify-center gap-2 mb-2">
                  {img.map((_, i) => (
                    <div
                      key={i}
                      className={`w-2.5 h-2.5 rounded-full ${
                        bannerPage === i ? "bg-black" : "bg-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="w-full h-[320px] md:h-[420px] rounded-2xl border-2  border-[#DAC193] flex items-center justify-center text-gray-500 text-center px-4">
                Aquí se mostrarán las imágenes seleccionadas
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}