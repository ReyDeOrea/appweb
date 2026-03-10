"use client";

import { useState } from "react";
import Image from "next/image";
import NewPasswordModal from "./NewPasswordModal";
import { ResetPasswordUseCase } from "../../application/resetPassword";
import { VerifyUserUseCase } from "../../application/verifyUserCase";
import { UserProfile } from "../../domain/user";
import { SupabaseUserRepository } from "../../infraestructure/userDataSource";

export default function Password() {
  const userRepo = new SupabaseUserRepository();
  const verifyUserUseCase = new VerifyUserUseCase(userRepo);
  const resetPasswordUseCase = new ResetPasswordUseCase(userRepo);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const handleVerify = async () => {
    try {
      setLoading(true);
      const user = await verifyUserUseCase.execute(username, email);
      setProfile(user);
      setModalVisible(true);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (newPass: string, confirmPass: string) => {
    if (!profile) return;

    try {
      await resetPasswordUseCase.execute({
        user: profile,
        newPassword: newPass,
        confirmPassword: confirmPass,
      });
      alert("Contraseña actualizada correctamente");
      setModalVisible(false);
      setUsername("");
      setEmail("");
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
          src="/images/Cat.jpeg"
          alt="Cat"
          width={200}
          height={200}
          className="rounded-full mx-auto"
        />
      </div>

      <p className="text-gray-600 text-sm mb-5 text-center">
        Ingresa tu usuario y correo
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
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-yellow-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />

        <button
          onClick={handleVerify}
          disabled={loading}
          className={`w-full py-3 rounded-xl font-bold text-white ${
            loading ? "bg-yellow-300 cursor-not-allowed" : "bg-yellow-500 hover:bg-yellow-600"
          }`}
        >
          {loading ? "Cargando..." : "Verificar"}
        </button>

        <button
          onClick={() => window.history.back()}
          className="w-full text-center text-gray-500 underline font-bold mt-2"
        >
          Volver
        </button>
      </div>

      <NewPasswordModal
        visible={modalVisible}
        loading={loading}
        onClose={() => setModalVisible(false)}
        onSubmit={handlePasswordChange}
      />
    </div>
  );
}