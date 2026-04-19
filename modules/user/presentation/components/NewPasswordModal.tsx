"use client";

import { useState, useEffect } from "react"; 
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface Props {
  visible: boolean;
  loading: boolean;
  onClose: () => void;
  onSubmit: (newPass: string, confirmPass: string) => void;
}

export default function NewPasswordModal({ visible, loading, onClose, onSubmit }: Props) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  useEffect(() => {
    if (!visible) {
      setNewPassword("");
      setConfirmPassword("");
      setShowNewPassword(false);
      setShowConfirmPassword(false);
    }
  }, [visible]);

  const handleSubmit = () => {
    onSubmit(newPassword, confirmPassword);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl p-6 w-11/12 max-w-md flex flex-col items-center shadow-lg">
        
        <h2 className="text-center text-gray-900 font-semibold mb-5 text-base">
          Ingresa tu nueva contraseña
        </h2>

       {/* Nueva contraseñaa */}
        <div className="w-full relative mb-4">
          <input
            type={showNewPassword ? "text" : "password"}
            placeholder="Nueva contraseña"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full border border-[#B7C979] rounded-xl px-4 py-3 pr-10 
            text-gray-900 placeholder:text-gray-500
            focus:outline-none focus:ring-2 focus:ring-[#B7C979]"
          />

          <button
            type="button"
            onClick={() => setShowNewPassword(!showNewPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showNewPassword ? <FaEye /> : <FaEyeSlash />}
          </button>
        </div>

        {/* Confirmar contraseña */}
        <div className="w-full relative mb-4">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirmar nueva contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border border-[#B7C979] rounded-xl px-4 py-3 pr-10 
            text-gray-900 placeholder:text-gray-500
            focus:outline-none focus:ring-2 focus:ring-[#B7C979]"
          />

          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
          </button>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full rounded-xl py-3 mb-3 text-white font-bold transition-colors ${
            loading
              ? "bg-[#B7C979]/60 cursor-not-allowed"
              : "bg-[#B7C979] hover:bg-[#9FB866]"
          }`}
        >
          {loading ? "Cargando..." : "Actualizar contraseña"}
        </button>

        <button
          onClick={onClose}
          className="text-gray-700 underline font-semibold hover:text-gray-900"
        >
          Cancelar
        </button>

      </div>
    </div>
  );
}