"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserPets } from "../../../user/application/getUserPets";
import { uploadImagesPet } from "../../application/uploadImagesPet";
import DeletePetModal from "../components/DeletePetModal";
import { FaPaw } from "react-icons/fa";

export default function MyPetsScreen() {
  const [pets, setPets] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    loadPets();
  }, []);

  const loadPets = async () => {
    try {
      const data = await getUserPets();
      setPets(data);
    } catch (error) {
      console.log(error);
    }
  };

  const openDeleteModal = (id: string) => {
    setSelectedPetId(id);
    setModalVisible(true);
  };

  const chunks: any[][] = [];
  for (let i = 0; i < pets.length; i += 2) {
    chunks.push(pets.slice(i, i + 2));
  }

  const renderItem = (item: any) => {
    const images = uploadImagesPet(item.image_url);
    const isAdopted = item.adopted === true;

    return (
      <div
        key={item.id}
        className={`bg-white p-5 rounded-lg shadow-md w-[48%] flex-shrink-0 flex flex-col justify-between ${isAdopted ? "opacity-50" : ""
          }`}
      >
        {images.length > 0 && (
          <img
            src={images[0]}
            alt={item.name}
            className="w-full h-96 object-cover rounded-lg bg-[#F5F5F5] mb-4"
          />
        )}

        <h2 className="font-bold text-xl text-black mb-3">{item.name}</h2>

        {isAdopted ? (
          <p className="text-green-700 font-bold text-center py-2">
            🐾 Esta mascota ya fue adoptada
          </p>
        ) : (
          <div className="flex gap-3 mt-auto">
            <button
              className="bg-[#B7C979] flex-1 py-3 rounded-lg font-bold hover:bg-[#e0c37b] transition-colors text-black"
              onClick={() =>
                router.push(
                  `/pet/updatepet?pet=${encodeURIComponent(JSON.stringify(item))}`
                )
              }
            >
              Editar
            </button>

            <button
              className="bg-[#E8B4B4] flex-1 py-3 rounded-lg font-bold hover:bg-[#9b332f] transition-colors text-black"
              onClick={() => openDeleteModal(item.id)}
            >
              Eliminar
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#FDF8F0]">
      <div className="bg-[#B7C979] py-6 shadow-md">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="text-white font-bold hover:underline"
          >
            ← Volver
          </button>

          <div className="flex items-center gap-3">
            <h1 className="text-white font-bold text-3xl md:text-4xl">
              Animaland
            </h1>
            <FaPaw className="text-white text-3xl md:text-4xl" />
          </div>

          <div className="w-[70px]" />
        </div>
      </div>

      <div className="px-4 pb-32 mt-6">
        {pets.length === 0 ? (
          <p className="text-center mt-10 text-gray-500">
            No tienes mascotas registradas
          </p>
        ) : (
          chunks.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className="flex flex-wrap justify-center gap-6 mb-8"
            >
              {row.map((item) => renderItem(item))}
            </div>
          ))
        )}
      </div>

      <button
        onClick={() => router.push("/pet/addpet")}
        className="fixed bottom-[60px] right-5 w-[60px] h-[60px] bg-[#8cb56e] rounded-full text-white text-[30px] flex items-center justify-center shadow-lg hover:scale-105 transition"
      >
        +
      </button>

      <DeletePetModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        petId={selectedPetId}
        onDeleted={loadPets}
      />
    </div>
  );
}