"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserPets } from "../../../user/application/getUserPets";
import { uploadImagesPet } from "../../application/uploadImagesPet";
import DeletePetModal from "../components/DeletePetModal";

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

  return (
    <div className="min-h-screen bg-[#FDF8F0] p-3 relative">

      <div className="w-full h-[100px] pt-7 bg-[#B7C979] flex items-center justify-center mb-3 relative">

        <button
          onClick={() => router.back()}
          className="absolute left-4 top-10 text-white text-2xl"
        >
          ←
        </button>

        <div className="flex items-center gap-1">
          <span className="text-white font-bold text-[25px]">
            Animaland
          </span>
          🐶
        </div>

      </div>


      {pets.length === 0 && (
        <p className="text-center mt-5">
          No tienes mascotas registradas
        </p>
      )}

      <div className="space-y-3 pb-32">

        {pets.map((item, index) => {

          const images = uploadImagesPet(item.image_url);
          const isAdopted = item.adopted === true;

          return (
            <div
              key={item?.id ? item.id : index}
              className={`bg-white p-3 rounded-xl shadow ${isAdopted ? "opacity-50" : ""
                }`}
            >

              {images.length > 0 && (
                <img
                  src={images[0]}
                  className={`w-full h-[150px] object-cover rounded-xl ${isAdopted ? "opacity-50" : ""
                    }`}
                />
              )}

              <p className="font-bold text-[16px] mt-1">
                {item.name}
              </p>

              {isAdopted && (
                <p className="text-green-600 font-bold mt-1">
                  🐾 Esta mascota ya fue adoptada
                </p>
              )}

              {!isAdopted && (
                <div className="flex justify-between mt-3">

                  <button
                    className="bg-[#ffdfba] px-3 py-2 rounded-lg flex-1 mr-1 font-bold"
                    onClick={() =>
                      router.push(
                        `/pet/updatepet?pet=${encodeURIComponent(
                          JSON.stringify(item)
                        )}`
                      )
                    }
                  >
                    Editar
                  </button>

                  <button
                    className="bg-[#d3a9a9] px-3 py-2 rounded-lg flex-1 ml-1 font-bold"
                    onClick={() => openDeleteModal(item.id)}
                  >
                    Eliminar
                  </button>

                </div>
              )}

            </div>
          );
        })}

      </div>

      <button
        onClick={() => router.push("/pet/addpet")}
        className="fixed bottom-[60px] right-5 w-[60px] h-[60px] bg-[#8cb56e] rounded-full text-white text-[30px] flex items-center justify-center"
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