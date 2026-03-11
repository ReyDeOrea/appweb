"use client";

import { updatePetUseCase } from "../../application/updatePet";
import { PetSex, PetSize, PetType } from "../../domain/pet";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { saveS } from "../components/uploadImage";

export default function UpdatePetsScreen() {

  const router = useRouter();
  const searchParams = useSearchParams();

  const petParam = useMemo(() => {
    const pet = searchParams.get("pet");
    return pet ? JSON.parse(pet) : null;
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
  const [imagePage, setImagePage] = useState(0);
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");

  useEffect(() => {

    if (petParam) {

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

      if (Array.isArray(petParam.image_url)) {
        setImages(petParam.image_url);
      } else if (typeof petParam.image_url === "string") {
        try {

          const parsed = JSON.parse(petParam.image_url);

          if (Array.isArray(parsed)) {
            setImages(parsed);
          } else {
            setImages([petParam.image_url]);
          }

        } catch {
          setImages([petParam.image_url]);
        }
      }

    }

  }, [petParam]);

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
    setImages([]);
    setSelectedPet(null);

  };

  const pickImage = (event: React.ChangeEvent<HTMLInputElement>) => {

    const files = event.target.files;

    if (!files) return;

    const uris: string[] = [];

    for (let i = 0; i < files.length; i++) {

      const file = files[i];
      const url = URL.createObjectURL(file);
      uris.push(url);

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

      });

      alert("Mascota actualizada ✨");

      clearFields();
      router.back();

    } catch (error: any) {

      alert(error.message);

    }

  };

  return (

    <div className="min-h-screen bg-[#FDF8F0] pb-10">

      {/* HEADER */}

      <div className="bg-[#B7C979] pt-10 pb-5 mb-5 flex justify-center items-center relative">

        <button
          onClick={() => router.back()}
          className="absolute left-4 top-12 text-white text-2xl"
        >
          ←
        </button>

        <div className="flex items-center">
          <span className="text-white text-3xl font-bold mr-2">
            Animaland
          </span>
          🐶
        </div>

      </div>

      <div className="max-w-xl mx-auto px-4">

        {/* IMAGENES */}

        {images.length > 0 && (

          <>
            <div className="overflow-x-auto flex gap-4 mb-3">

              {images.map((uri, idx) => (

                <img
                  key={idx}
                  src={uri}
                  className="w-[90%] rounded-2xl"
                />

              ))}

            </div>

            <div className="flex justify-center mb-3">

              {images.map((_, i) => (

                <div
                  key={i}
                  className={`w-2 h-2 rounded-full mx-1 ${
                    imagePage === i ? "bg-black" : "bg-gray-300"
                  }`}
                />

              ))}

            </div>
          </>
        )}

        {/* BOTON IMAGEN */}

        <label className="bg-[#D4B37A] text-white font-semibold p-3 rounded-xl flex justify-center mb-4 cursor-pointer">

          Insertar Imagen

          <input
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={pickImage}
          />

        </label>

        {/* INFORMACION */}

        <h2 className="text-center font-bold text-lg mb-2">
          Información general
        </h2>

        <p className="text-xs text-gray-500 mb-1">Tipo de animal</p>

        <div className="flex justify-around mb-3">

          {["perro", "gato"].map((t) => (

            <button
              key={t}
              onClick={() => setType(t)}
              className={`px-4 py-2 border rounded-lg font-bold capitalize ${
                type === t
                  ? "bg-[#E5DCCC] border-[#DAC193]"
                  : "bg-white border-[#DAC193]"
              }`}
            >
              {t}
            </button>

          ))}

        </div>

        <input
          className="w-full border border-[#E8E0D0] bg-white p-3 rounded-lg mb-3"
          placeholder="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <p className="text-xs text-gray-500 mb-1">Sexo</p>

        <div className="flex justify-around mb-3">

          {["macho", "hembra"].map((s) => (

            <button
              key={s}
              onClick={() => setSex(s)}
              className={`px-4 py-2 border rounded-lg font-bold capitalize ${
                sex === s
                  ? "bg-[#E5DCCC] border-[#DAC193]"
                  : "bg-white border-[#DAC193]"
              }`}
            >
              {s}
            </button>

          ))}

        </div>

        <input
          className="w-full border border-[#E8E0D0] bg-white p-3 rounded-lg mb-3"
          placeholder="Edad"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />

        <p className="text-xs text-gray-500 mb-1">Tamaño</p>

        <div className="flex justify-around mb-3">

          {["pequeño", "mediano", "grande"].map((s) => (

            <button
              key={s}
              onClick={() => setSize(s)}
              className={`px-4 py-2 border rounded-lg font-bold capitalize ${
                size === s
                  ? "bg-[#E5DCCC]"
                  : "bg-white"
              }`}
            >
              {s}
            </button>

          ))}

        </div>

        <input
          className="w-full border border-[#E8E0D0] bg-white p-3 rounded-lg mb-3"
          placeholder="Raza"
          value={breed}
          onChange={(e) => setBreed(e.target.value)}
        />

        <h2 className="text-center font-bold text-lg mb-2">
          Salud
        </h2>

        <textarea
          className="w-full border border-[#E8E0D0] bg-white p-3 rounded-lg mb-3 h-[100px]"
          placeholder="Información de salud"
          value={healthInfo}
          onChange={(e) => setHealthInfo(e.target.value)}
        />

        <h2 className="text-center font-bold text-lg mb-2">
          Descripción
        </h2>

        <textarea
          className="w-full border border-[#E8E0D0] bg-white p-3 rounded-lg mb-3 h-[100px]"
          placeholder="Descripción"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <h2 className="text-center font-bold text-lg mb-2">
          Contacto
        </h2>

        <input
          className="w-full border border-[#E8E0D0] bg-white p-3 rounded-lg mb-3"
          placeholder="Teléfono"
          value={phone}
          maxLength={10}
          onChange={(e) =>
            setPhone(e.target.value.replace(/[^0-9]/g, ""))
          }
        />

        <input
          className="w-full border border-[#E8E0D0] bg-white p-3 rounded-lg mb-3"
          placeholder="Ubicación"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <button
          onClick={handleUpdatePet}
          className="w-full bg-[#B7C979] text-white p-3 rounded-xl font-semibold mt-3"
        >
          Actualizar
        </button>

        <button
          onClick={() => router.back()}
          className="w-full bg-[#E8B4B4] text-white p-3 rounded-xl font-semibold mt-3"
        >
          Cancelar
        </button>

      </div>

    </div>
  );

}