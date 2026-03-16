"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { validateSignUpData } from "../../application/validateSingUpData";
import { registerUser } from "../../application/registerUser";
import { checkUserExists } from "../../application/checkUserExists";

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
        confirmPassword
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
        avatar_url: avatarUrl
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

    <div className="min-h-screen bg-[#FDF8F0] flex flex-col items-center pb-10">


      <div className="w-full h-[90px] pt-8 bg-[#B7C979] flex items-center justify-center relative">

        <button
          onClick={() => router.back()}
          className="absolute left-4 top-10 text-white"
        >
          &#8592; Volver
        </button>

        <div className="flex items-center text-white font-bold text-3xl gap-1">
          Animaland
        </div>

      </div>

      <Image
        src="/images/DogAndCat.jpeg"
        alt="dog and cat"
        width={600}
        height={200}
        className="w-[90%] h-[200px] object-cover rounded-lg my-4"
      />

      <p className="text-center text-gray-600 mb-2">
        Crea una nueva cuenta ahora
      </p>

      <div className="w-full max-w-md px-5">


        <div className="flex items-center border border-[#DAC193] rounded-xl px-3 py-3 bg-white my-2">

          <input
            className="ml-2 flex-1 outline-none"
            placeholder="Usuario"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
          />

        </div>

        <div className="flex items-center border border-[#DAC193] rounded-xl px-3 py-3 bg-white my-2">

          <input
            className="ml-2 flex-1 outline-none"
            placeholder="Número de teléfono"
            value={numt}
            onChange={(e) => setNumT(e.target.value)}
          />

        </div>

        <div className="flex items-center border border-[#DAC193] rounded-xl px-3 py-3 bg-white my-2">

          <input
            className="ml-2 flex-1 outline-none"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

        </div>

        <div className="flex items-center border border-[#DAC193] rounded-xl px-3 py-3 bg-white my-2">

          <input
            type="password"
            className="ml-2 flex-1 outline-none"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

        </div>

        <div className="flex items-center border border-[#DAC193] rounded-xl px-3 py-3 bg-white my-2">

          <input
            type="password"
            className="ml-2 flex-1 outline-none"
            placeholder="Confirmar contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

        </div>

      </div>

      <div className="flex items-center justify-center mt-4">

        <Image
          src="/images/DOG.png"
          alt="dog"
          width={60}
          height={60}
          className="mr-3"
        />

        <button
          onClick={handleRegister}
          disabled={loading}
          className="bg-[#dee8b4] px-12 py-3 rounded-2xl text-white font-bold text-lg hover:opacity-90"
        >
          {loading ? "Creando..." : "Crear cuenta"}
        </button>

      </div>

      <div className="flex mt-4">
        <p>¿Ya tienes una cuenta?</p>

        <button
          onClick={() => router.push("/user/login")}
          className="font-bold underline ml-1"
        >
          Iniciar sesión
        </button>

      </div>

    </div>

  );

}