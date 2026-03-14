"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AvatarView from "../components/Avatar";
import { validateUserProfile } from "../../application/valideteUpdate";
import { checkUserExistsUpdate } from "../../application/checkUserExistsUpdate";
import { updateUserProfile } from "../../application/updateUserProfile";
import { getUserProfile } from "../../application/getUserProfile";

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
        avatar_url: avatarUrl
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
      <div className="p-6">
        No hay usuario logueado
      </div>
    );
  }

  return (

    <div className="min-h-screen bg-[#FDF8F0] flex flex-col items-center">

      <div className="w-full h-[100px] bg-[#B7C979] flex items-center justify-center relative">

        <button
          onClick={() => router.back()}
          className="absolute left-4 top-6 text-white"
        >
           &#8592; Volver
        </button>

        <div className="flex items-center gap-2 text-white font-bold text-2xl">
          Animaland
        </div>

      </div>

      <div className="w-[90%] max-w-md bg-white rounded-2xl p-6 mt-6 shadow">

        <div className="flex justify-center mb-6">
          <AvatarView
            size={120}
            url={avatarUrl}
            onUpload={(url: string) => setAvatarUrl(url)}
          />
        </div>

        <div className="flex flex-col">

          <label className="text-sm text-gray-500 mb-1 font-medium">
            Correo
          </label>

          <input
            className="w-full p-3 rounded-lg border border-[#E8E0D0] mb-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Correo electrónico"
            type="email"
          />

          <label className="text-sm text-gray-500 mb-1 font-medium">
            Nombre de usuario
          </label>

          <input
            className="w-full p-3 rounded-lg border border-[#E8E0D0] mb-4"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Tu nombre"
          />

          <label className="text-sm text-gray-500 mb-1 font-medium">
            Teléfono
          </label>

          <input
            className="w-full p-3 rounded-lg border border-[#E8E0D0] mb-4"
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
  );
}