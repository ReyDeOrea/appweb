"use client";

import { updatePetUseCase } from "../../application/updatePet";
import { PetSex, PetSize, PetType } from "../../domain/pet";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { saveS } from "../components/uploadImage";
import { IoCameraOutline } from "react-icons/io5";
import { FaPaw } from "react-icons/fa";

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
            Actualizar mascota
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
                    {["perro", "gato"].map((t) => (
                      <button
                        key={t}
                        onClick={() => setType(t)}
                        className={`px-4 py-2 text-black rounded-lg border transition capitalize ${
                          type === t
                            ? "bg-[#E5DCCC] border-[#DAC193]"
                            : "bg-white border-[#DAC193]"
                        }`}
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
                    className="w-full border border-[#E8E0D0] bg-white p-3 rounded-lg text-black text-sm"
                    placeholder="Nombre"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-gray-600 text-sm font-medium mb-2">
                    Edad
                  </label>
                  <input
                    className="w-full border border-[#E8E0D0] bg-white p-3 rounded-lg text-black text-sm"
                    placeholder="Edad"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-gray-600 text-sm font-medium mb-2">
                    Sexo
                  </label>
                  <div className="flex gap-3 flex-wrap">
                    {["macho", "hembra"].map((s) => (
                      <button
                        key={s}
                        onClick={() => setSex(s)}
                        className={`px-4 py-2 text-black rounded-lg border transition capitalize ${
                          sex === s
                            ? "bg-[#E5DCCC] border-[#DAC193]"
                            : "bg-white border-[#DAC193]"
                        }`}
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
                    {["pequeño", "mediano", "grande"].map((s) => (
                      <button
                        key={s}
                        onClick={() => setSize(s)}
                        className={`px-4 py-2 text-black rounded-lg border transition capitalize ${
                          size === s
                            ? "bg-[#E5DCCC] border-[#DAC193]"
                            : "bg-white border-[#DAC193]"
                        }`}
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
                    className="w-full border border-[#E8E0D0] bg-white p-3 rounded-lg text-black text-sm"
                    placeholder="Raza"
                    value={breed}
                    onChange={(e) => setBreed(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-gray-600 text-sm font-medium mb-2">
                    Ubicación
                  </label>
                  <input
                    className="w-full border border-[#E8E0D0] bg-white p-3 rounded-lg text-black text-sm"
                    placeholder="Ubicación"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-gray-600 text-sm font-medium mb-2">
                    Descripción
                  </label>
                  <textarea
                    className="w-full border border-[#E8E0D0] bg-white p-3 rounded-lg text-black text-sm h-28 resize-none"
                    placeholder="Descripción"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg text-[#311c1c] mb-4">Salud</h3>
              <textarea
                className="w-full border border-[#E8E0D0] bg-white p-3 rounded-lg text-black text-sm h-24 resize-none"
                placeholder="Información de salud"
                value={healthInfo}
                onChange={(e) => setHealthInfo(e.target.value)}
              />
            </div>

            <div>
              <h3 className="text-black font-bold text-lg mb-4">Contacto</h3>
              <input
                className="w-full border border-[#E8E0D0] bg-white p-3 rounded-lg text-black text-sm"
                placeholder="Teléfono"
                value={phone}
                maxLength={10}
                onChange={(e) =>
                  setPhone(e.target.value.replace(/[^0-9]/g, ""))
                }
              />
            </div>

            <div className="flex flex-col md:flex-row gap-4 pt-2">
              <button
                onClick={handleUpdatePet}
                className="flex-1 bg-[#B7C979] hover:bg-[#aabd68] text-white py-3 rounded-xl font-semibold transition"
              >
                Actualizar
              </button>

              <button
                onClick={() => router.back()}
                className="flex-1 bg-[#E8B4B4] hover:bg-[#dda3a3] text-white py-3 rounded-xl font-semibold transition"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>

        <div className="xl:col-span-2 bg-white rounded-2xl shadow-md p-5 xl:sticky xl:top-6">
          <div className="flex justify-center mb-6">
            <label className="bg-[#D4B37A] hover:bg-[#c8a66b] transition px-5 py-3 rounded-xl flex items-center gap-2 cursor-pointer font-medium text-white">
              <span>
                <IoCameraOutline />
              </span>
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

          {images.length > 0 ? (
            <>
              <div className="relative flex justify-center mb-4">
                <button
                  onClick={() =>
                    setImagePage(
                      imagePage === 0 ? images.length - 1 : imagePage - 1
                    )
                  }
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 text-white px-3 py-2 rounded-full"
                >
                  ‹
                </button>

                <img
                  src={images[imagePage]}
                  className="w-full h-[320px] md:h-[420px] rounded-2xl object-cover"
                />

                <button
                  onClick={() =>
                    setImagePage(
                      imagePage === images.length - 1 ? 0 : imagePage + 1
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 text-white px-3 py-2 rounded-full"
                >
                  ›
                </button>
              </div>

              <div className="flex justify-center gap-2 mb-2">
                {images.map((_, i) => (
                  <div
                    key={i}
                    className={`w-2.5 h-2.5 rounded-full ${
                      imagePage === i ? "bg-black" : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="w-full h-[320px] md:h-[420px] rounded-2xl border-2 border-[#DAC193] flex items-center justify-center text-gray-500 text-center px-4">
              Aquí se mostrarán las imágenes seleccionadas
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);

}