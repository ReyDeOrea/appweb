"use client";

import { useState } from "react";
import { validateLoginData } from "../../application/valideteLoginData";
import { loginUser } from "../../application/loginUser";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FaUser, FaLock, FaPaw } from "react-icons/fa";

export default function LoginForm() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      validateLoginData(username, password);
      await loginUser(username, password);
      router.replace("/pet");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">

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

      <div className="flex justify-center mt-6">
        <Image
          src="/images/DogAndCat.jpeg"
          alt="dog and cat"
          width={600}
          height={300}
          className="w-[90%] max-w-md h-[220px] object-cover rounded-2xl shadow-md"
        />
      </div>

      <div className="max-w-md mx-auto px-5 py-6">

        <p className="text-center text-gray-900 font-semibold mb-5">
          Accede a tu cuenta
        </p>

        <div className="space-y-3">
          <div className="flex items-center border border-gray-300 rounded-lg px-3 py-3 bg-white">
            <FaUser style={{ color: "#D4B37A", fontSize: "20px" }} />
            <input
              type="text"
              placeholder="Usuario"
              className="ml-3 flex-1 outline-none text-gray-900"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="flex items-center border border-gray-300 rounded-lg px-3 py-3 bg-white">
            <FaLock style={{ color: "#D4B37A", fontSize: "20px" }} />
            <input
              type="password"
              placeholder="Contraseña"
              className="ml-3 flex-1 outline-none text-gray-900"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

        </div>

        <div className="mt-6">
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-[#B7C979] py-3 rounded-xl text-white font-bold text-lg hover:bg-[#a5b86a] transition disabled:opacity-50"
          >
            {loading ? "Cargando..." : "Entrar"}
          </button>
        </div>

        <div className="flex flex-col items-center mt-5 gap-2 text-gray-900">

          <button
            onClick={() => router.push("/user/password")}
            className="text-blue-500 font-medium hover:underline"
          >
            ¿Olvidaste tu contraseña?
          </button>

          <div className="flex gap-1">
            <span>¿No tienes cuenta?</span>
            <button
              onClick={() => router.push("/user/signup")}
              className="font-bold underline text-black"
            >
              Regístrate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}