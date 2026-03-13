"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Pet } from "../../domain/pet";
import { checkAdoptionRequest } from "../../application/checkAdoptionRequest";
import { checkFavoritePet } from "../../application/checkFavoritePet";
import { toggleFavoritePet } from "../../application/toggleFavoritePets";
import { checkUserSession, getUserData } from "../../application/checkUserSession";

export default function ProfileAnimal() {

  const router = useRouter();
  const params = useSearchParams();


  const [tab, setTab] = useState<"info" | "salud">("info");
  const [isFavorite, setIsFavorite] = useState(false);
  const [imagePage, setImagePage] = useState(0);
  const [hasRequested, setHasRequested] = useState(false);
  const [userLogged, setUserLogged] = useState(false);

  let mascota: Pet | null = null;

  const petParam = params.get("pet");

  if (petParam) {
    try {
      mascota = JSON.parse(petParam);
    } catch {
      console.log("Error parseando mascota");
    }
  }

  useEffect(() => {
    if (!mascota) return;
    initialize();
  }, []);

  const initialize = async () => {

    const logged = await checkUserSession();
    setUserLogged(logged);

    if (!logged) return;

    const user = await getUserData();
    if (!user || !mascota) return;

    const fav = await checkFavoritePet(user.id.toString(), mascota.id.toString());
    setIsFavorite(fav);

    const requested = await checkAdoptionRequest(
      user.id.toString(),
      mascota.id.toString()
    );

    setHasRequested(requested);
  };

  const handleToggleFavorite = async () => {

    if (!(await checkUserSession())) {
      alert("Debes iniciar sesión para agregar favoritos");
      return;
    }

    const user = await getUserData();
    if (!user || !mascota) return;

    const newStatus = await toggleFavoritePet(user.id.toString(), mascota);

    setIsFavorite(newStatus);

    alert(newStatus ? "Se agregó a favoritos" : "Se quitó de favoritos");
  };

  const llamar = () => {
    window.location.href = `tel:${mascota?.phone}`;
  };

  const copiarEnlace = async () => {

    if (!mascota) return;

    const url = `${window.location.origin}/pet/profileanimal?pet=${encodeURIComponent(
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

  const images: string[] = (() => {

    if (!mascota) return [];

    if (Array.isArray(mascota.image_url))
      return mascota.image_url.filter(Boolean);

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
      <div className="flex justify-center items-center h-screen">
        No hay datos de la mascota
      </div>
    );
  }

  return (

    <div className="min-h-screen bg-[#F3F2ED]">

      <div className="bg-[#B8C76F] h-[110px] flex items-end pb-5 relative">

        <button
          onClick={() => router.back()}
          className="absolute left-5 text-white text-xl"
        >
          ←
        </button>

        <h1 className="text-white text-2xl font-bold w-full text-center">
          {mascota.name}
        </h1>

        <button
          onClick={handleToggleFavorite}
          className="absolute right-5 text-white text-xl"
        >
          {isFavorite ? "❤️" : "🤍"}
        </button>

      </div>


      <div className="mx-5 mt-4 rounded-xl overflow-hidden relative flex justify-center">

        <div className="relative w-3/4 h-[390px]"> 

          <img
            src={images[imagePage]}
            className="w-full h-full object-cover transition-all duration-300 rounded-xl"
          />

          {imagePage > 0 && (
            <button
              onClick={() => setImagePage(imagePage - 1)}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 text-white px-3 py-1 rounded-full"
            >
              ‹
            </button>
          )}

          {imagePage < images.length - 1 && (
            <button
              onClick={() => setImagePage(imagePage + 1)}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 text-white px-3 py-1 rounded-full"
            >
              ›
            </button>
          )}

          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2">
            {images.map((_, i) => (
              <div
                key={i}
                className={`h-2 w-2 rounded-full ${i === imagePage ? "bg-white" : "bg-white/40"}`}
              />
            ))}
          </div>

        </div>

        <button
          onClick={copiarEnlace}
          className="absolute top-3 right-3 bg-black/40 text-white p-2 rounded-full"
        >
          🔗
        </button>

      </div>

      <button
        onClick={abrirMapa}
        className="text-black  underline flex items-center gap-2 mx-5 mt-3"
      >
        📍
        <span>{mascota.location}</span>
      </button>


      {mascota.adopted && (
        <p className="text-center text-red-500 font-bold">
          Esta mascota ya fue adoptada
        </p>
      )}


      <div className="flex mx-5 mt-4 bg-[#DAD2C3] p-1 rounded-full">

        <button
          onClick={() => setTab("info")}
          className={`text-black flex-1 p-2 rounded-full ${tab === "info" ? "bg-white" : ""
            }`}
        >
          Información
        </button>

        <button
          onClick={() => setTab("salud")}
          className={`text-black flex-1 p-2 rounded-full ${tab === "salud" ? "bg-white" : ""
            }`}
        >
          Salud
        </button>

      </div>


      <div className="p-5">

        {tab === "info" && (

          <>
            <div className="grid grid-cols-4 gap-3">

              <div className="bg-white border rounded-xl p-3 text-center flex flex-col items-center">
                <span className="text-black text-xl mb-1">⚥</span>
                <span className="text-black">{mascota.sex}</span>
              </div>

              <div className="bg-white border rounded-xl p-3 text-center flex flex-col items-center">
                <span className="text-xl mb-1">📏</span>
                <span className="text-black">{mascota.size}</span>
              </div>

              <div className="bg-white border rounded-xl p-3 text-center flex flex-col items-center">
                <span className="text-xl mb-1">🎂</span>
                <span className="text-black">{mascota.age}</span>
              </div>

              <div className="bg-white border rounded-xl p-3 text-center flex flex-col items-center">
                <span className="text-xl mb-1">🐾</span>
                <span className="text-black">{mascota.breed}</span>
              </div>

            </div>


            <div className="border-b-2 border-[#E5DCCC] my-6"></div>


            <h3 className="text-black text-center font-bold mb-3">
              Descripción
            </h3>

            <div className="text-black bg-white border rounded-xl p-4">
              {mascota.description}
            </div>


            <div className="border-b-2 border-[#E5DCCC] my-6"></div>


            <h3 className="text-black text-center font-bold mb-3">
              Contacto
            </h3>

            <button
              onClick={llamar}
              className="text-black bg-white border rounded-xl p-4 w-full"
            >
              📞 {mascota.phone}
            </button>


            <div className="flex justify-center mt-6">

              <button
                onClick={() => {

                  if (!userLogged) {
                    alert("Debes iniciar sesión para enviar la solicitud");
                    return;
                  }

                  if (hasRequested) {
                    alert("Ya enviaste una solicitud para esta mascota");
                    return;
                  }

                  router.push(
                    `/adoption/adoptionRequest?pet=${encodeURIComponent(
                      JSON.stringify(mascota)
                    )}`
                  );

                }}
                disabled={!userLogged || hasRequested}
                className={`px-8 py-3 rounded-full text-white font-bold ${!userLogged || hasRequested
                  ? "bg-gray-400"
                  : "bg-[#D4B37A]"
                  }`}
              >
                {hasRequested
                  ? "Solicitud enviada"
                  : "Mandar solicitud de adopción"}
              </button>

            </div>

          </>
        )}

        {tab === "salud" && (

          <div className="p-5 text-black">
            {mascota.health_info}
          </div>

        )}

      </div>

    </div>

  );

}