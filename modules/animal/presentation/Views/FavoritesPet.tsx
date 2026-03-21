"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getFavoritesPetsUseCase } from "../../application/getFavoritesPets";
import { Pet } from "../../domain/pet";
import { FaPaw } from "react-icons/fa";

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

  const chunkArray = (arr: Pet[], size: number) => {
    const result: Pet[][] = [];
    for (let i = 0; i < arr.length; i += size) {
      result.push(arr.slice(i, i + size));
    }
    return result;
  };

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
        className={`bg-white border p-4 mb-4 rounded-2xl shadow w-5/12 mx-3 ${
          isAdopted ? "bg-gray-200" : ""
        } cursor-pointer`}
        onClick={() => {
          if (isAdopted) return;
          router.push(`/pet/profileanimal?pet=${encodeURIComponent(JSON.stringify(item))}`);
        }}
      >
        <div className="relative">
          <img
            src={images[0]}
            alt={item.name}
            className={`w-full h-80 object-cover rounded-2xl ${
              isAdopted ? "opacity-40" : ""
            }`}
          />

          {isAdopted && (
            <div className="absolute top-2 left-2 bg-yellow-400 px-2 py-1 rounded-lg">
              <span className="text-xs font-bold text-black">
                ¡{item.name} ha sido adoptado!
              </span>
            </div>
          )}
        </div>

        <h2 className="text-center font-bold text-lg mt-2 text-[#291110]">
          {item.name}
        </h2>

        {isAdopted && (
          <p className="text-center text-sm font-bold text-gray-500 mt-1">
            No disponible
          </p>
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

      <div className="pb-10 flex flex-wrap justify-center mt-6">
        {favorites.length === 0 ? (
          <p className="text-center mt-10 text-gray-500 w-full">
            No tienes favoritos aún
          </p>
        ) : (
          chunkArray(favorites, 2).map((pair, index) => (
            <div key={index} className="flex w-full justify-center">
              {pair.map(renderItem)}
            </div>
          ))
        )}
      </div>
    </div>
  );
}