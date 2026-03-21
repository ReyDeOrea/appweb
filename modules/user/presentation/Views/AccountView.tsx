"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AvatarView from "../components/Avatar";
import { validateUserProfile } from "../../application/valideteUpdate";
import { checkUserExistsUpdate } from "../../application/checkUserExistsUpdate";
import { updateUserProfile } from "../../application/updateUserProfile";
import { getUserProfile } from "../../application/getUserProfile";
import { FaPaw } from "react-icons/fa";

export default function Account() {
  const [user, setUser] = useState<any>(null);
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      try {
        const u = await getUserProfile();

        if (u) {
          setUser(u);
          setUsername(u.username ?? "");
          setPhone(u.phone ?? "");
          setAvatarUrl(u.avatar_url ?? "");
          setEmail(u.email ?? "");
        }
      } catch (err: any) {
        alert("No se pudo cargar el perfil");
      }
    };

    load();
  }, []);

  const UpdateProfile = async () => {
    try {
      setLoading(true);

      validateUserProfile(email, username, phone);

      await checkUserExistsUpdate(
        email.trim().toLowerCase(),
        username.trim(),
        phone.trim(),
        user.id
      );

      const updated = await updateUserProfile(user, {
        username: username.trim(),
        phone: phone.trim(),
        email: email.trim().toLowerCase(),
        avatar_url: avatarUrl,
      });

      setUser(updated);

      alert("Perfil actualizado");

      router.push("/pet");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="p-6 text-black">
        No hay usuario logueado
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDF8F0]">
      <div className="bg-[#B7C979] py-6 shadow-md">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="text-white font-bold hover:underline"
          >
            &#8592; Volver
          </button>

          <div className="flex items-center gap-3">
            <h1 className="text-white font-bold text-3xl md:text-4xl">
              Animaland
            </h1>
            <span className="text-white text-3xl md:text-4xl">
              <FaPaw />
            </span>
          </div>

          <div className="w-[70px]" />
        </div>
      </div>

      <div className="flex justify-center items-start px-4 py-10">
        <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-md">
          <h2 className="text-2xl font-bold text-center text-black mb-6">
            Mi perfil
          </h2>

          <div className="flex justify-center mb-6">
            <AvatarView
              size={120}
              url={avatarUrl}
              onUpload={(url: string) => setAvatarUrl(url)}
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm text-black mb-1 font-medium">
              Correo
            </label>

            <input
              className="w-full p-3 rounded-lg border border-[#E8E0D0] mb-4 text-black placeholder:text-gray-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Correo electrónico"
              type="email"
            />

            <label className="text-sm text-black mb-1 font-medium">
              Nombre de usuario
            </label>

            <input
              className="w-full p-3 rounded-lg border border-[#E8E0D0] mb-4 text-black placeholder:text-gray-400"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Tu nombre"
            />

            <label className="text-sm text-black mb-1 font-medium">
              Teléfono
            </label>

            <input
              className="w-full p-3 rounded-lg border border-[#E8E0D0] mb-4 text-black placeholder:text-gray-400"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Número de teléfono"
            />
          </div>

          <button
            onClick={UpdateProfile}
            disabled={loading}
            className="w-full bg-[#B7C979] p-4 rounded-xl mt-2 text-white font-bold hover:opacity-90 transition"
          >
            {loading ? "Guardando..." : "Actualizar Perfil"}
          </button>
        </div>
      </div>
    </div>
  );
}