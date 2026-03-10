"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AvatarView from "../components/Avatar";
import { supabase } from "@/lib/supabase/supabase";

export default function Account() {
  const [user, setUser] = useState<any>(null);
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const u = localStorage.getItem("user");

    if (u) {
      const parsed = JSON.parse(u);
      setUser(parsed);
      setUsername(parsed.username ?? "");
      setPhone(parsed.phone ?? "");
      setAvatarUrl(parsed.avatar_url ?? "");
    }
  }, []);

  if (!user) return <p className="p-5">No hay usuario logueado</p>;

  const updateProfile = async () => {
    try {
      setLoading(true);

      const { error } = await supabase
        .from("clients")
        .update({
          username,
          phone,
          avatar_url: avatarUrl,
        })
        .eq("email", user.email);

      if (error) throw error;

      const newUser = { ...user, username, phone, avatar_url: avatarUrl };

      setUser(newUser);
      localStorage.setItem("user", JSON.stringify(newUser));

      alert("Perfil actualizado");

      router.push("/pet");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-white p-5">

      <div className="bg-[#D4B37A] w-full py-4 flex justify-center items-center gap-2">
        <h1 className="text-white font-bold text-3xl">Animaland</h1>
      </div>

      <div className="mt-6">
        <AvatarView
          size={150}
          url={avatarUrl}
          onUpload={(url) => setAvatarUrl(url)}
        />
      </div>

      <div className="mt-6 w-full max-w-md flex flex-col gap-3">

        <input
          className="w-full p-3 rounded-lg border border-[#DAC193]"
          value={user.email}
          disabled
        />

        <input
          className="w-full p-3 rounded-lg border border-[#DAC193]"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
        />

        <input
          className="w-full p-3 rounded-lg border border-[#DAC193]"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone"
        />

      </div>

      <button
        onClick={updateProfile}
        disabled={loading}
        className="w-full max-w-md mt-4 bg-[#E5DCCC] p-4 rounded-lg font-bold"
      >
        {loading ? "Guardando..." : "Actualizar Perfil"}
      </button>

    </div>
  );
}