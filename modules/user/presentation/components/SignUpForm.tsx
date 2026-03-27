"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { validateSignUpData } from "../../application/validateSingUpData";
import { registerUser } from "../../application/registerUser";
import { checkUserExists } from "../../application/checkUserExists";
import { FaUser, FaPhone, FaEnvelope, FaLock, FaPaw } from "react-icons/fa";

export default function SignUp() {
  const router = useRouter();

  const [usuario, setUsuario] = useState("");
  const [numt, setNumT] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    try {
      setLoading(true);

      validateSignUpData({
        username: usuario,
        phone: numt,
        email,
        password,
        confirmPassword,
      });

      await checkUserExists(
        email.trim().toLowerCase(),
        usuario.trim(),
        numt.trim()
      );

      await registerUser({
        email,
        username: usuario,
        password,
        phone: numt,
        avatar_url: avatarUrl,
      });

      alert("Cuenta creada");
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
          Crea una nueva cuenta
        </p>

        <div className="space-y-3">

          <div className="flex items-center border border-gray-300 rounded-lg px-3 py-3 bg-white">
            <FaUser style={{ color: "#D4B37A", fontSize: "20px" }} />
            <input
              className="ml-3 flex-1 outline-none text-gray-900"
              placeholder="Usuario"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
            />
          </div>

          <div className="flex items-center border border-gray-300 rounded-lg px-3 py-3 bg-white">
            <FaPhone style={{ color: "#D4B37A", fontSize: "20px" }} />
            <input
              className="ml-3 flex-1 outline-none text-gray-900"
              placeholder="Número de teléfono"
              value={numt}
              onChange={(e) => setNumT(e.target.value)}
            />
          </div>

          <div className="flex items-center border border-gray-300 rounded-lg px-3 py-3 bg-white">
            <FaEnvelope style={{ color: "#D4B37A", fontSize: "20px" }} />
            <input
              className="ml-3 flex-1 outline-none text-gray-900"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="flex items-center border border-gray-300 rounded-lg px-3 py-3 bg-white">
            <FaLock style={{ color: "#D4B37A", fontSize: "20px" }} />
            <input
              type="password"
              className="ml-3 flex-1 outline-none text-gray-900"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="flex items-center border border-gray-300 rounded-lg px-3 py-3 bg-white">
            <FaLock style={{ color: "#D4B37A", fontSize: "20px" }} />
            <input
              type="password"
              className="ml-3 flex-1 outline-none text-gray-900"
              placeholder="Confirmar contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

        </div>

        <div className="mt-6 flex items-center justify-center gap-3">

          <Image
            src="/images/DOG.png"
            alt="dog"
            width={50}
            height={50}
          />

          <button
            onClick={handleRegister}
            disabled={loading}
            className="bg-[#B7C979] px-8 py-3 rounded-xl text-white font-bold text-lg hover:bg-[#a5b86a] transition"
          >
            {loading ? "Creando..." : "Crear cuenta"}
          </button>

        </div>

        <div className="flex justify-center mt-5 text-gray-900">
          <p>¿Ya tienes una cuenta?</p>
          <button
            onClick={() => router.push("/user/login")}
            className="font-bold underline ml-2 text-black"
          >
            Iniciar sesión
          </button>
        </div>

      </div>
    </div>
  );
}