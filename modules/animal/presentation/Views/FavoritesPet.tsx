"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getFavoritesPetsUseCase } from "../../application/getFavoritesPets";
import { Pet } from "../../domain/pet";

export default function FavoritesPet() {
  const [favorites, setFavorites] = useState<Pet[]>([]);
  const router = useRouter();

  const loadFavorites = async () => {
    const favorites = await getFavoritesPetsUseCase();
    setFavorites(favorites);
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  const renderItem = (item: Pet) => {
    const isAdopted = item.adopted === true;

    let images: string[] = [];
    try {
      images = JSON.parse(item.image_url || "[]");
      if (!Array.isArray(images)) images = [images];
    } catch {
      images = item.image_url ? [item.image_url] : [];
    }

    return (
      <div
        key={item.id}
        className={`bg-white border p-4 mb-4 rounded-2xl mx-6 shadow ${isAdopted ? "bg-gray-200" : ""} cursor-pointer`}
        onClick={() => {
          if (isAdopted) return;
          router.push(`/pet/profileanimal?pet=${encodeURIComponent(JSON.stringify(item))}`);
        }}
      >
        <div className="relative">
          <img
            src={images[0]}
            alt={item.name}
            className={`w-full h-52 object-cover rounded-2xl ${isAdopted ? "opacity-40" : ""}`}
          />
          {isAdopted && (
            <div className="absolute top-2 left-2 bg-yellow-400 px-2 py-1 rounded-lg">
              <span className="text-xs font-bold text-black">
                ¡{item.name} ha sido adoptado!
              </span>
            </div>
          )}
        </div>
        <h2 className="text-center font-bold text-lg mt-2 text-[#291110]">{item.name}</h2>
        {isAdopted && (
          <p className="text-center text-sm font-bold text-gray-500 mt-1">No disponible</p>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#FDF8F0]">
  
      <div className="w-full h-16 bg-[#B7C979] flex items-center justify-center mb-4">
        <div className="flex items-center justify-center gap-2">
          <h1 className="text-white font-bold text-2xl">Animaland</h1>
          <span className="text-white text-2xl">🐶</span>
        </div>
      </div>

      <div className="pb-10">
        {favorites.length === 0 ? (
          <p className="text-center mt-10 text-gray-500">No tienes favoritos aún</p>
        ) : (
          favorites.map(renderItem)
        )}
      </div>
    </div>
  );
}