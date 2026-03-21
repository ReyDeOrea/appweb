"use client";

import { useState } from "react";
import Image from "next/image";
import NewPasswordModal from "./NewPasswordModal";
import { ResetPasswordUseCase } from "../../application/resetPassword";
import { VerifyUserUseCase } from "../../application/verifyUserCase";
import { UserProfile } from "../../domain/user";
import { SupabaseUserRepository } from "../../infraestructure/userDataSource";
import { useRouter } from "next/navigation";

import { FaUser, FaEnvelope, FaPaw } from "react-icons/fa";

export default function Password() {
  const router = useRouter();

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

   <div className="flex justify-center mt-4">
  <Image
    src="/images/Cat.jpeg"
    alt="Cat"
    width={600}
    height={300}
    className="w-[90%] max-w-md h-[220px] object-cover rounded-2xl shadow-md"
  />
</div>

  
      <div className="max-w-md mx-auto px-5 py-6">

        <p className="text-center text-gray-900 font-semibold mb-5">
          Recupera tu contraseña
        </p>

        {/* INPUTS */}
        <div className="space-y-3">

          <div className="flex items-center border border-gray-300 rounded-lg px-3 py-3 bg-white">
            <FaUser  style={{ color: '#D4B37A', fontSize: '20px' }} />
            <input
              type="text"
              placeholder="Usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="ml-3 flex-1 outline-none text-gray-900"
            />
          </div>

          <div className="flex items-center border border-gray-300 rounded-lg px-3 py-3 bg-white">
            <FaEnvelope  style={{ color: '#D4B37A', fontSize: '20px' }} />
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="ml-3 flex-1 outline-none text-gray-900"
            />
          </div>

        </div>

        <div className="mt-6">
          <button
            onClick={handleVerify}
            disabled={loading}
            className="w-full bg-[#B7C979] py-3 rounded-xl text-white font-bold text-lg hover:bg-[#a5b86a] transition disabled:opacity-50"
          >
            {loading ? "Cargando..." : "Verificar"}
          </button>
        </div>

      
        <div className="flex justify-center mt-5 text-gray-900">
          <button
            onClick={() => router.back()}
            className="font-bold underline text-black"
          >
            Volver
          </button>
        </div>

      </div>

      {/* MODAL */}
      <NewPasswordModal
        visible={modalVisible}
        loading={loading}
        onClose={() => setModalVisible(false)}
        onSubmit={handlePasswordChange}
      />
    </div>
  );
}