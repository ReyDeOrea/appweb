"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PetSex, PetSize, PetType } from "../../domain/pet";
import { addPetUseCase } from "../../application/addPet";
import { saveS } from "../components/uploadImage";

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

  // Selector de imágenes web
  const pickImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    const uris = files.map((f) => URL.createObjectURL(f));
    setImage([...img, ...uris]);
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
    <div className="flex flex-col bg-[#FDF8F0] min-h-screen pb-20">

      <div className="bg-[#B7C979] py-6 mb-6">
        <div className="flex justify-center items-center gap-4">
          <h1 className="text-white font-bold text-4xl">Animaland</h1>
          <span className="text-white text-4xl">🐾</span>
        </div>
      </div>

      {img.length > 0 && (
        <div className="overflow-x-auto flex snap-x snap-mandatory mb-4">
          {img.map((uri, idx) => (
            <div key={idx} className="flex-shrink-0 snap-center w-[90vw] mx-2 my-2 flex justify-center">
              <img src={uri} className="h-[42vw] rounded-xl object-cover" />
            </div>
          ))}
        </div>
      )}
      <div className="flex justify-center gap-2 mb-4">
        {img.map((_, i) => (
          <div key={i} className={`w-2 h-2 rounded-full ${bannerPage === i ? "bg-black" : "bg-gray-300"}`} />
        ))}
      </div>

      <div className="px-5 flex flex-col gap-5">

        <div className="flex justify-center">
          <label className="bg-[#D4B37A] px-4 py-3 rounded-xl flex items-center gap-2 cursor-pointer">
            <span>📷</span>
            <span>Subir foto</span>
            <input type="file" multiple accept="image/*" className="hidden" onChange={pickImage} />
          </label>
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="text-center font-bold text-lg text-[#311c1c]">Información Básica</h2>

          <label className="text-gray-600 text-sm font-medium">Tipo de animal</label>
          <div className="flex gap-2">
            {petTypes.map((t) => (
              <button
                key={t}
                className={`px-3 py-2 rounded-lg border ${type === t ? "bg-[#E5DCCC] border-[#DAC193]" : "bg-white border-[#DAC193]"}`}
                onClick={() => setType(t)}
              >
                {t}
              </button>
            ))}
          </div>

          <label className="text-gray-600 text-sm font-medium">Nombre del animal</label>
          <input
            type="text"
            placeholder="Nombre del animal"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-[#E8E0D0] rounded-lg p-3 text-sm w-full"
          />

          <label className="text-gray-600 text-sm font-medium">Sexo</label>
          <div className="flex gap-2">
            {petSex.map((s) => (
              <button
                key={s}
                className={`px-3 py-2 rounded-lg border ${sex === s ? "bg-[#E5DCCC] border-[#DAC193]" : "bg-white border-[#DAC193]"}`}
                onClick={() => setSex(s)}
              >
                {s}
              </button>
            ))}
          </div>

          <label className="text-gray-600 text-sm font-medium">Tamaño</label>
          <div className="flex gap-2">
            {Object.values(PetSize).map((s) => (
              <button
                key={s}
                className={`px-3 py-2 rounded-lg border ${size === s ? "bg-[#E5DCCC] border-[#DAC193]" : "bg-white border-[#DAC193]"}`}
                onClick={() => setSize(s)}
              >
                {s}
              </button>
            ))}
          </div>

          <label className="text-gray-600 text-sm font-medium">Edad</label>
          <input
            type="text"
            placeholder="Edad"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="border border-[#E8E0D0] rounded-lg p-3 text-sm w-full"
          />

          <label className="text-gray-600 text-sm font-medium">Raza</label>
          <input
            type="text"
            placeholder="Raza"
            value={breed}
            onChange={(e) => setBreed(e.target.value)}
            className="border border-[#E8E0D0] rounded-lg p-3 text-sm w-full"
          />

          <label className="text-gray-600 text-sm font-medium">Ubicación</label>
          <input
            type="text"
            placeholder="Ubicación"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="border border-[#E8E0D0] rounded-lg p-3 text-sm w-full"
          />

          <label className="text-gray-600 text-sm font-medium">Descripción</label>
          <textarea
            placeholder="Da una breve descripción"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border border-[#E8E0D0] rounded-lg p-3 text-sm w-full h-24"
          />
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="text-center font-bold text-lg text-[#311c1c]">Salud</h2>
          <textarea
            placeholder="Alergias / Vacunas / Discapacidad"
            value={healthInfo}
            onChange={(e) => setHealthInfo(e.target.value)}
            className="border border-[#E8E0D0] rounded-lg p-3 text-sm w-full h-20"
          />
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="text-center font-bold text-lg text-[#311c1c]">Contacto</h2>
          <input
            type="text"
            placeholder="Número de teléfono"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="border border-[#E8E0D0] rounded-lg p-3 text-sm w-full"
          />
        </div>

        <div className="flex flex-col gap-2 mt-4">
          <button
            className={`bg-[#B7C979] text-white font-semibold py-3 rounded-xl ${isSaving ? "opacity-50" : ""}`}
            onClick={savePet}
            disabled={isSaving}
          >
            {isSaving ? "Guardando..." : "Guardar mascota"}
          </button>

          <button
            className="bg-[#E8B4B4] text-white font-semibold py-3 rounded-xl"
            onClick={() => router.back()}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}