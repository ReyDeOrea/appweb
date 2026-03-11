
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Pet } from "../../domain/pet";
import { checkUserSession, getUserData } from "../../application/checkUserSession";
import { checkFavoritePet } from "../../application/checkFavoritePet";
import { checkAdoptionRequest } from "../../application/checkAdoptionRequest";
import { toggleFavoritePet } from "../../application/toggleFavoritePets";

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

    alert(newStatus ? "Se agregó a favoritos" : "Se quitó de favoritos");

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
      <div className="flex items-center justify-center h-screen">
        No hay datos de la mascota
      </div>
    );
  }

  return (

    <div className="bg-[#F3F2ED] min-h-screen pb-20">

      <div className="relative h-28 bg-[#B8C76F] flex items-end justify-center pb-5">

        <button
          className="absolute left-5 bottom-5"
          onClick={() => router.back()}
        />

        <h1 className="text-white text-2xl font-bold">
          {mascota.name}
        </h1>

        <button
          className="absolute right-5 bottom-5"
          onClick={handleToggleFavorite}
        />

      </div>

      <div className="relative my-4 mx-4 rounded-xl overflow-hidden">

        <div className="flex overflow-x-scroll snap-x snap-mandatory scrollbar-hide">

          {images.map((uri, idx) => (

            <img
              key={idx}
              src={uri}
              alt={mascota.name}
              className="w-[calc(100%-2rem)] h-56 object-cover rounded-xl mr-2 snap-center"
              onScroll={() => setImagePage(idx)}
            />

          ))}

        </div>

        <button
          className="absolute top-3 right-3 bg-black bg-opacity-30 p-2 rounded-full"
          onClick={copiarEnlace}
        >
          Copiar enlace
        </button>

      </div>

      <button
        onClick={abrirMapa}
        className="flex items-center gap-2 mx-5 mt-2 text-blue-600 underline"
      >
        <span>{mascota.location}</span>
      </button>

      {mascota.adopted && (
        <p className="text-center text-red-600 font-bold mt-2">
          Esta mascota ya fue adoptada
        </p>
      )}

      <div className="flex justify-between bg-[#DAD2C3] rounded-2xl mx-5 mt-4 overflow-hidden">

        <button
          className={`flex-1 py-2 ${tab === "info" ? "bg-white" : ""}`}
          onClick={() => setTab("info")}
        >
          Información
        </button>

        <button
          className={`flex-1 py-2 ${tab === "salud" ? "bg-white" : ""}`}
          onClick={() => setTab("salud")}
        >
          Salud
        </button>

      </div>

      <div className="px-5 py-5">

        {tab === "info" && (

          <>

            <div className="flex justify-around flex-wrap gap-2 mb-5">

              <div className="bg-white rounded-xl p-3">
                <span>{mascota.sex}</span>
              </div>

              <div className="bg-white rounded-xl p-3">
                <span>{mascota.size}</span>
              </div>

              <div className="bg-white rounded-xl p-3">
                <span>{mascota.age}</span>
              </div>

              <div className="bg-white rounded-xl p-3">
                <span>{mascota.breed}</span>
              </div>

            </div>

            <p className="text-center font-bold text-lg mb-2">
              Descripción
            </p>

            <div className="bg-white p-4 rounded-xl">
              {mascota.description}
            </div>

            <p className="text-center font-bold text-lg mt-5 mb-2">
              Contacto
            </p>

            <button
              className="mb-5"
              onClick={llamar}
            >
              {mascota.phone}
            </button>

            <div className="flex justify-center">

              <button
                className={`py-3 px-6 rounded-full font-bold ${
                  !userLogged || hasRequested
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#D4B37A]"
                }`}
                disabled={!userLogged || hasRequested}
               onClick={async () => {

                  if (!userLogged) {
                    alert("Debes iniciar sesión");
                    return;
                  }
 const user = await getUserData();
    if (!user || !mascota) return;

    const requested = checkAdoptionRequest(
      user.id.toString(),
      mascota.id.toString()
    );

    if (requested) {

      setHasRequested(true);

      alert("Ya enviaste una solicitud para esta mascota");

      return;

    }

                  router.push(
                    `/adoption/adoptionRequest?pet=${encodeURIComponent(
                      JSON.stringify(mascota)
                    )}`
                  );

                }}
              >

                {hasRequested
                  ? "Solicitud enviada"
                  : "Mandar solicitud de adopción"}

              </button>

            </div>

          </>

        )}

        {tab === "salud" && (
          <p>{mascota.health_info}</p>
        )}

      </div>

    </div>

  );

}
 