"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Pet } from "../../domain/pet";
import { checkUserSession, getUserData } from "../../application/checkUserSession";
import { checkAdoptionRequest } from "../../application/checkAdoptionRequest";
import { toggleFavoritePet } from "../../application/toggleFavoritePets";
import { checkFavoritePet } from "../../application/checkFavoritePet";

export default function ProfileAnimal() {

  const router = useRouter();
  const searchParams = useSearchParams();
  const petParam = searchParams.get("pet");

  const [mascota, setMascota] = useState<Pet | null>(null);
  const [tab, setTab] = useState<"info" | "salud">("info");
  const [isFavorite, setIsFavorite] = useState(false);
  const [imagePage, setImagePage] = useState(0);
  const [hasRequested, setHasRequested] = useState(false);
  const [userLogged, setUserLogged] = useState(false);

  useEffect(() => {

    const loadData = async () => {

      if (!petParam) return;

      try {

        const pet: Pet = JSON.parse(petParam);
        setMascota(pet);

        const logged = await checkUserSession();
        setUserLogged(logged);

        if (!logged) return;

        const user = await getUserData();
        if (!user) return;

        const fav = await checkFavoritePet(
          user.id.toString(),
          pet.id.toString()
        );

        setIsFavorite(fav);

        const requested = await checkAdoptionRequest(
          user.id.toString(),
          pet.id.toString()
        );

        setHasRequested(requested);

      } catch (error) {

        console.log("Error cargando datos:", error);

      }

    };

    loadData();

  }, [petParam]);

  const handleToggleFavorite = async () => {

    if (!(await checkUserSession())) {
      alert("Debes iniciar sesión para agregar favoritos");
      return;
    }

    const user = await getUserData();
    if (!user || !mascota) return;

    const newStatus = await toggleFavoritePet(
      user.id.toString(),
      mascota
    );

    setIsFavorite(newStatus);

  };

  const llamar = () => {

    if (!mascota?.phone) return;

    window.location.href = `tel:${mascota.phone}`;

  };

  const copiarEnlace = async () => {

    if (!mascota) return;

    const url = `${window.location.origin}${window.location.pathname}?pet=${encodeURIComponent(
      JSON.stringify(mascota)
    )}`;

    await navigator.clipboard.writeText(url);

    alert("Enlace copiado");

  };

  const abrirMapa = () => {

    if (!mascota?.location) return;

    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      mascota.location
    )}`;

    window.open(url, "_blank");

  };

  const nextImage = () => {

    if (imagePage < images.length - 1) {
      setImagePage(imagePage + 1);
    }

  };

  const prevImage = () => {

    if (imagePage > 0) {
      setImagePage(imagePage - 1);
    }

  };

  const images: string[] = (() => {

    if (!mascota) return [];

    if (Array.isArray(mascota.image_url)) {
      return mascota.image_url.filter(Boolean);
    }

    if (typeof mascota.image_url === "string") {

      try {

        const parsed = JSON.parse(mascota.image_url);

        return Array.isArray(parsed)
          ? parsed.filter(Boolean)
          : [mascota.image_url];

      } catch {

        return [mascota.image_url];

      }

    }

    return [];

  })();

  if (!mascota) {

    return (
      <div className="flex items-center justify-center h-screen text-gray-700 font-medium">
        No hay datos de la mascota
      </div>
    );

  }

  return (

    <div className="bg-[#F3F2ED] min-h-screen pb-20 font-sans">

      <div className="relative h-28 bg-[#C7D383] flex items-end justify-center pb-4 shadow-md rounded-b-2xl">

        <button
          className="absolute left-5 bottom-4 text-xl font-bold text-white hover:text-gray-200 transition"
          onClick={() => router.back()}
        >
          ←
        </button>

        <h1 className="text-white text-2xl font-bold">{mascota.name}</h1>

        <button
          className="absolute right-5 bottom-4 text-xl transition"
          onClick={handleToggleFavorite}
        >
          {isFavorite ? "❤️" : "🤍"}
        </button>

      </div>

      <div className="relative my-4 mx-4 rounded-xl overflow-hidden shadow-lg">

        <div className="relative w-full h-80 md:h-[420px] rounded-xl overflow-hidden flex items-center justify-center bg-[#EDEBE4]">

          <img
            src={images[imagePage]}
            alt={mascota.name}
            className="max-h-[85%] max-w-[92%] object-cover rounded-xl shadow-md"
          />

          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white px-3 py-1 rounded-full hover:bg-black/60 transition"
              >
                ‹
              </button>

              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white px-3 py-1 rounded-full hover:bg-black/60 transition"
              >
                ›
              </button>
            </>
          )}

          <button
            className="absolute top-3 right-3 bg-black bg-opacity-30 p-2 rounded-full text-white hover:bg-opacity-50 transition"
            onClick={copiarEnlace}
          >
            🔗
          </button>

        </div>

        <div className="flex justify-center gap-2 mt-2">
          {images.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full ${imagePage === index ? "bg-black" : "bg-gray-400"}`}
            />
          ))}
        </div>

      </div>

      <button
        onClick={abrirMapa}
        className="flex items-center gap-2 mx-5 mt-2 text-[#3B82F6] underline font-medium"
      >
        <span>{mascota.location}</span>
      </button>

      <div className="flex justify-between bg-[#DAD2C3] rounded-2xl mx-5 mt-4 overflow-hidden shadow-sm">
        <button
          className={`flex-1 text-black py-2 font-medium transition ${tab === "info" ? "bg-white" : ""}`}
          onClick={() => setTab("info")}
        >
          Información
        </button>
        <button
          className={`flex-1 text-black py-2 font-medium transition ${tab === "salud" ? "bg-white" : ""}`}
          onClick={() => setTab("salud")}
        >
          Salud
        </button>
      </div>

      {/* CONTENIDO */}
      <div className="px-5 py-5">

        {tab === "info" && (
          <>
            <div className="flex justify-around flex-wrap gap-2 mb-5">
              <div className="text-black bg-white rounded-xl p-3 text-center shadow">{mascota.sex}</div>
              <div className="text-black bg-white rounded-xl p-3 text-center shadow">{mascota.size}</div>
              <div className="text-black bg-white rounded-xl p-3 text-center shadow">{mascota.age}</div>
              <div className="text-black bg-white rounded-xl p-3 text-center shadow">{mascota.breed}</div>
            </div>

            <p className="text-black text-center font-bold text-lg mb-2">Descripción</p>
            <div className="bg-white p-4 rounded-xl text-black shadow">{mascota.description}</div>

            <p className="text-black text-center font-bold text-lg mt-5 mb-2">Contacto</p>
            <div
              className="text-center text-black bg-white rounded-xl p-3 shadow cursor-pointer hover:bg-gray-100 transition"
              onClick={llamar}
            >
              {mascota.phone}
            </div>
          </>
        )}

        {tab === "salud" && (
          <div className="bg-white p-4 rounded-xl shadow text-black">{mascota.health_info}</div>
        )}

      </div>

    </div>

  );

}