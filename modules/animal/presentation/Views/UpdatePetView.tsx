"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { updatePetUseCase } from "@/modules/animal/application/updatePet";
import { PetSex, PetSize, PetType } from "@/modules/animal/domain/pet";
import { saveS } from "../components/uploadImage";

export default function UpdatePetWeb() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const petParam = useMemo(() => {
    const petStr = searchParams.get("pet");
    return petStr ? JSON.parse(petStr) : null;
  }, [searchParams]);

  const [selectedPet, setSelectedPet] = useState<any>(null);
  const [type, setType] = useState("");
  const [name, setName] = useState("");
  const [sex, setSex] = useState("");
  const [age, setAge] = useState("");
  const [size, setSize] = useState("");
  const [breed, setBreed] = useState("");
  const [healthInfo, setHealthInfo] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [adopted, setAdopted] = useState(false);

  useEffect(() => {
    if (!petParam) return;
    setSelectedPet(petParam);
    setType(petParam.type ?? "");
    setName(petParam.name ?? "");
    setSex(petParam.sex ?? "");
    setAge(petParam.age ?? "");
    setSize(petParam.size ?? "");
    setBreed(petParam.breed ?? "");
    setHealthInfo(petParam.health_info ?? "");
    setDescription(petParam.description ?? "");
    setPhone(petParam.phone ?? "");
    setLocation(petParam.location ?? "");
    setAdopted(petParam.adopted ?? false);

    if (Array.isArray(petParam.image_url)) {
      setImages(petParam.image_url);
    } else if (typeof petParam.image_url === "string") {
      try {
        const parsed = JSON.parse(petParam.image_url);
        setImages(Array.isArray(parsed) ? parsed : [petParam.image_url]);
      } catch {
        setImages([petParam.image_url]);
      }
    }
  }, [petParam]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const uris: string[] = [];
    for (let i = 0; i < files.length; i++) {
      uris.push(URL.createObjectURL(files[i]));
    }
    setImages(uris);
  };

  const handleUpdatePet = async () => {
    if (!selectedPet) {
      alert("No hay mascota seleccionada");
      return;
    }

    if (images.length !== 5) {
      alert("Debes seleccionar exactamente 5 imágenes");
      return;
    }

    try {
      let imageUrl: string[] = [];

      for (const uri of images) {
        if (uri.startsWith("http")) {
          imageUrl.push(uri);
        } else {
          const uploaded = await saveS({ uri });
          if (!uploaded) {
            alert("Error al subir imagen");
            return;
          }
          imageUrl.push(uploaded);
        }
      }

      await updatePetUseCase(selectedPet.id, {
        type: type as PetType,
        name: name.trim(),
        sex: sex as PetSex,
        age: age.trim(),
        size: size as PetSize,
        breed: breed.trim(),
        health_info: healthInfo.trim(),
        description: description.trim(),
        phone: phone.replace(/[^0-9]/g, ""),
        location: location.trim(),
        image_url: JSON.stringify(imageUrl),
        adopted,
      });

      alert("Mascota actualizada ✨");
      router.back();
    } catch (error: any) {
      alert("Error: " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-5">
      <header className="bg-green-400 text-white rounded-xl p-4 mb-6 flex items-center justify-center gap-2">
        <span className="text-2xl font-bold">Animaland</span>
        <svg
          className="w-8 h-8"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M5 20l14-8-14-8v16z" />
        </svg>
      </header>

      <div className="flex items-center mb-6 gap-3">
        <label>¿Adoptada?</label>
        <input
          type="checkbox"
          checked={adopted}
          onChange={() => setAdopted(!adopted)}
          className="w-5 h-5 accent-green-500"
        />
      </div>

      <div className="flex gap-3 overflow-x-auto mb-4">
        {images.map((uri, i) => (
          <img
            key={i}
            src={uri}
            alt={`Imagen ${i + 1}`}
            className="w-48 h-48 object-cover rounded-lg"
          />
        ))}
      </div>

      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleImageChange}
        className="mb-4"
      />

      <section className="mb-6">
        <h2 className="text-lg font-bold mb-2 text-center">Información general</h2>

        <label className="block text-sm font-medium mb-1">Tipo de animal</label>
        <div className="flex gap-2 mb-3">
          {["perro", "gato"].map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`px-3 py-1 rounded-lg border ${
                type === t ? "bg-yellow-200 border-yellow-400" : "bg-white border-gray-300"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <label className="block text-sm font-medium mb-1">Nombre</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border rounded p-2 mb-3"
        />

        <label className="block text-sm font-medium mb-1">Sexo</label>
        <div className="flex gap-2 mb-3">
          {["macho", "hembra"].map((s) => (
            <button
              key={s}
              onClick={() => setSex(s)}
              className={`px-3 py-1 rounded-lg border ${
                sex === s ? "bg-yellow-200 border-yellow-400" : "bg-white border-gray-300"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <label className="block text-sm font-medium mb-1">Edad</label>
        <input
          type="text"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          className="w-full border rounded p-2 mb-3"
        />

        <label className="block text-sm font-medium mb-1">Tamaño</label>
        <div className="flex gap-2 mb-3">
          {["pequeño", "mediano", "grande"].map((s) => (
            <button
              key={s}
              onClick={() => setSize(s)}
              className={`px-3 py-1 rounded-lg border ${
                size === s ? "bg-yellow-200 border-yellow-400" : "bg-white border-gray-300"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <label className="block text-sm font-medium mb-1">Raza</label>
        <input
          type="text"
          value={breed}
          onChange={(e) => setBreed(e.target.value)}
          className="w-full border rounded p-2 mb-3"
        />
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-bold mb-2 text-center">Salud</h2>
        <textarea
          value={healthInfo}
          onChange={(e) => setHealthInfo(e.target.value)}
          className="w-full border rounded p-2 mb-3 h-24"
        />
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-bold mb-2 text-center">Descripción</h2>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border rounded p-2 mb-3 h-24"
        />
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-bold mb-2 text-center">Contacto</h2>
        <input
          type="text"
          placeholder="Teléfono"
          value={phone}
          onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ""))}
          className="w-full border rounded p-2 mb-3"
        />
        <input
          type="text"
          placeholder="Ubicación"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full border rounded p-2 mb-3"
        />
      </section>

      <div className="flex gap-4 justify-center mb-6">
        <button
          onClick={handleUpdatePet}
          className="bg-green-400 text-white px-6 py-3 rounded-lg font-semibold"
        >
          Actualizar
        </button>
        <button
          onClick={() => router.back()}
          className="bg-red-400 text-white px-6 py-3 rounded-lg font-semibold"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}