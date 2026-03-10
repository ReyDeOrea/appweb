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

  return (
    <div className="min-h-screen bg-[#FDF8F0] relative">

      <div className="w-full h-16 bg-[#B7C979] flex items-center justify-center mb-4">
        <div className="flex items-center justify-center gap-2">
          <h1 className="text-white font-bold text-2xl">Animaland</h1>
        </div>
      </div>

      <div className="px-4 pb-32">
        {pets.length === 0 ? (
          <p className="text-center mt-10 text-gray-500">No tienes mascotas registradas</p>
        ) : (
          pets.map((item) => {
            const images = uploadImagesPet(item.image_url);
            return (
              <div
                key={item.id}
                className="bg-white p-4 mb-4 rounded-lg shadow"
              >
                {images.length > 0 && (
                  <img
                    src={images[0]}
                    alt={item.name}
                    className="w-full h-36 object-cover rounded-lg"
                  />
                )}
                <h2 className="font-bold text-lg mt-2">{item.name}</h2>

                <div className="flex gap-2 mt-2">
                  <button
                    className="bg-[#E5DCCC] flex-1 py-2 rounded-lg font-bold"
                    onClick={() =>
                      router.push(`/pet/updatepet?pet=${encodeURIComponent(JSON.stringify(item))}`)
                    }
                  >
                    Editar
                  </button>

                  <button
                    className="bg-[#E5DCCC] flex-1 py-2 rounded-lg font-bold"
                    onClick={() => openDeleteModal(item.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            );
          })
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