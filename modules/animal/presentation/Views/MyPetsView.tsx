"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { uploadImagesPet } from "../../application/uploadImagesPet";
import DeletePetModal from "../components/DeletePetModal";
import { getUserPets } from "@/modules/user/application/getUserPets";

export default function MyPetsScreen() {
  const [pets, setPets] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);

  const router = useRouter();

  const loadPets = async () => {
    try {
      const data = await getUserPets();
      setPets(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadPets();
  }, []);

  const openDeleteModal = (id: string) => {
    setSelectedPetId(id);
    setModalVisible(true);
  };

  const chunks: any[][] = [];
  for (let i = 0; i < pets.length; i += 2) {
    chunks.push(pets.slice(i, i + 2));
  }

  return (
    <div className="min-h-screen bg-[#FDF8F0] relative">
      <div className="w-full h-16 bg-[#B7C979] flex items-center justify-center mb-4">
        <h1 className="text-white font-bold text-2xl">Animaland</h1>
      </div>

      <div className="px-4 pb-32">
        {pets.length === 0 ? (
          <p className="text-center mt-10 text-gray-500">No tienes mascotas registradas</p>
        ) : (
          chunks.map((row, rowIndex) => (
            <div key={rowIndex} className="flex flex-wrap justify-center gap-6 mb-8">
              {row.map((item) => {
                const images = uploadImagesPet(item.image_url);
                return (
                  <div
                    key={item.id}
                    className="bg-white p-5 rounded-lg shadow-md w-[48%] flex-shrink-0 flex flex-col justify-between"
                  >
                    {images.length > 0 && (
                      <img
                        src={images[0]}
                        alt={item.name}
                        className="w-full h-96 sm:h-96 md:h-96 object-cover rounded-lg bg-[#F5F5F5] mb-4"
                      />
                    )}
                    <h2 className="font-bold text-xl text-black mb-3">{item.name}</h2>

                    <div className="flex gap-3 mt-auto">
                      <button
                        className="bg-[#F3D58D] flex-1 py-3 rounded-lg font-bold hover:bg-[#e0c37b] transition-colors text-black"
                        onClick={() =>
                          router.push(`/pet/updatepet?pet=${encodeURIComponent(JSON.stringify(item))}`)
                        }
                      >
                        Editar
                      </button>

                      <button
                        className="bg-[#B7413E] flex-1 py-3 rounded-lg font-bold hover:bg-[#9b332f] transition-colors text-black"
                        onClick={() => openDeleteModal(item.id)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ))
        )}
      </div>

      <button
        className="fixed bottom-5 right-5 bg-blue-600 w-14 h-14 rounded-full flex items-center justify-center text-white text-2xl shadow-lg"
        onClick={() => router.push("/pet/addpet")}
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