"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { registerUser } from "../../application/registerUser";
import { validateSignUpData } from "../../application/validateSingUpData";
import { checkUserExists } from "../../application/checkUserExists";

export default function SignUp() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    try {
      setLoading(true);

      validateSignUpData({
        username,
        phone,
        email,
        password,
        confirmPassword,
      });

      await checkUserExists(email, username, phone);

      await registerUser({
        username,
        phone,
        email,
        password,
        avatar_url: avatarUrl,
      });

      alert("Cuenta creada correctamente");
      router.replace("/catalog");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center p-4">

      <div className="bg-yellow-400 w-full py-4 flex justify-center items-center mb-5">
        <h1 className="text-white font-bold text-4xl mr-2">Animaland</h1>
        <span className="material-icons text-white text-3xl">pets</span>
      </div>

      <div className="mb-5">
        <Image
          src="/images/DogAndCat.jpeg"
          alt="Dog and Cat"
          width={300}
          height={200}
          className="rounded-xl mx-auto"
        />
      </div>

      <p className="text-gray-600 text-center mb-5">
        Crea una nueva cuenta ahora
      </p>

      <div className="w-full max-w-md space-y-4">
        <input
          type="text"
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full border border-yellow-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />

        <input
          type="text"
          placeholder="Número de Teléfono"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full border border-yellow-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-yellow-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-yellow-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />

        <input
          type="password"
          placeholder="Confirmar Contraseña"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full border border-yellow-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
      </div>

      <div className="flex flex-col items-center mt-5 w-full max-w-md">
        <button
          onClick={handleRegister}
          disabled={loading}
          className={`w-full py-3 rounded-xl font-bold text-white ${
            loading ? "bg-yellow-300 cursor-not-allowed" : "bg-yellow-500 hover:bg-yellow-600"
          }`}
        >
          {loading ? "Creando cuenta..." : "Crear cuenta"}
        </button>

        <div className="flex items-center justify-center mt-4 space-x-2">
          <span>¿Ya tienes una cuenta?</span>
          <button
            onClick={() => router.push("/user/login")}
            className="font-bold underline text-yellow-500"
          >
            Iniciar Sesión
          </button>
        </div>
      </div>
    </div>
  );
}