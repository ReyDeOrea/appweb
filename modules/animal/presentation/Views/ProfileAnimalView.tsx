"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Pet } from "../../domain/pet";
import { checkAdoptionRequest } from "../../application/checkAdoptionRequest";
import { checkFavoritePet } from "../../application/checkFavoritePet";
import { toggleFavoritePet } from "../../application/toggleFavoritePets";
import { checkUserSession, getUserData } from "../../application/checkUserSession";
import { LuCake } from "react-icons/lu";
import { CiRuler } from "react-icons/ci";
import { FaHeart, FaPaw, FaRegHeart, FaTransgender } from "react-icons/fa";
import { IoLocationSharp } from "react-icons/io5";

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
    <div className="bg-[#B8C76F] shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="text-white font-bold hover:underline"
        >
          ← Volver
        </button>

        <h1 className="text-white text-3xl md:text-4xl font-bold text-center">
          {mascota.name}
        </h1>

        <button
          onClick={handleToggleFavorite}
          className="text-white text-2xl"
        >
          {isFavorite ?  <FaHeart  style={{ color: '#ffffff', fontSize: '24px' }} /> : <FaRegHeart style={{ color: '#ffffff', fontSize: '24px' }} />
}
        </button>
      </div>
    </div>

    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-8 items-start">

        <div className="xl:col-span-2 space-y-5 xl:sticky xl:top-6">
          <div className="bg-white rounded-2xl shadow-md p-5">
            <button
              onClick={abrirMapa}
              className="text-black underline flex items-center gap-2"
            >
              <span><IoLocationSharp style={{ color: '#d35b5b', fontSize: '24px' }} /></span>
              <span>{mascota.location}</span>
            </button>

            {mascota.adopted && (
              <p className="text-red-500 font-bold mt-4">
                Esta mascota ya fue adoptada
              </p>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-md p-5">
            <div className="flex bg-[#DAD2C3] p-1 rounded-full mb-6">
              <button
                onClick={() => setTab("info")}
                className={`text-black flex-1 p-2 rounded-full transition ${
                  tab === "info" ? "bg-white" : ""
                }`}
              >
                Información
              </button>

              <button
                onClick={() => setTab("salud")}
                className={`text-black flex-1 p-2 rounded-full transition ${
                  tab === "salud" ? "bg-white" : ""
                }`}
              >
                Salud
              </button>
            </div>

            {tab === "info" && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#FDF8F0] border rounded-xl p-4 text-center flex flex-col items-center">
                    <span className="text-black text-xl mb-1"><FaTransgender/>
</span>
                    <span className="text-black capitalize">{mascota.sex}</span>
                  </div>

                  <div className="bg-[#FDF8F0] border rounded-xl p-4 text-center flex flex-col items-center">
                    <span className="text-xl mb-1"><CiRuler  style={{ color: 'black', fontSize: '24px' }}  />
</span>
                    <span className="text-black capitalize">{mascota.size}</span>
                  </div>

                  <div className="bg-[#FDF8F0] border rounded-xl p-4 text-center flex flex-col items-center">
                    <span className="text-xl mb-1"><LuCake   style={{ color: 'black', fontSize: '24px' }} />
                   </span>
                    <span className="text-black">{mascota.age}</span>
                  </div>

                  <div className="bg-[#FDF8F0] border rounded-xl p-4 text-center flex flex-col items-center">
                    <span className="text-xl mb-1">  <FaPaw
style={{ color: 'black', fontSize: '24px' }} /> </span>
                    <span className="text-black">{mascota.breed}</span>
                  </div>
                </div>

                <div className="border-b-2 border-[#E5DCCC] my-6" />

                <h3 className="text-black text-center font-bold mb-3">
                  Descripción
                </h3>

                
                <div className="text-black bg-[#FDF8F0] border rounded-xl p-6 min-h-[100px] max-h-[300px] overflow-y-auto break-words whitespace-pre-wrap">
                  {mascota.description}
                </div>

                <div className="border-b-2 border-[#E5DCCC] my-6" />

                <h3 className="text-black text-center font-bold mb-3">
                  Contacto
                </h3>

                <button
                  onClick={llamar}
                  className="text-black bg-[#FDF8F0] border rounded-xl p-4 w-full hover:bg-[#f7f1e7] transition"
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
                    className={`w-full py-3 rounded-xl text-white font-bold transition ${
                      !userLogged || hasRequested
                        ? "bg-gray-400"
                        : "bg-[#D4B37A] hover:bg-[#c8a66b]"
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
              <div className="text-black bg-[#FDF8F0] border rounded-xl p-4 min-h-[180px] overflow-y-auto break-words whitespace-pre-wrap">
                {mascota.health_info}
              </div>
            )}
          </div>
        </div>

        <div className="xl:col-span-3">
          <div className="bg-white rounded-2xl shadow-md p-4 md:p-6 relative">
            <button
              onClick={copiarEnlace}
              className="absolute top-4 right-4 bg-black/40 text-white p-2 rounded-full z-10"
            >
              🔗
            </button>

            <div className="relative w-full">
              <img
                src={images[imagePage]}
                className="w-full h-[320px] md:h-[500px] object-cover rounded-2xl transition-all duration-300"
              />

              {imagePage > 0 && (
                <button
                  onClick={() => setImagePage(imagePage - 1)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 text-white px-3 py-2 rounded-full"
                >
                  ‹
                </button>
              )}

              {imagePage < images.length - 1 && (
                <button
                  onClick={() => setImagePage(imagePage + 1)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 text-white px-3 py-2 rounded-full"
                >
                  ›
                </button>
              )}

              <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
                {images.map((_, i) => (
                  <div
                    key={i}
                    className={`h-2.5 w-2.5 rounded-full ${
                      i === imagePage ? "bg-white" : "bg-white/40"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
);
}