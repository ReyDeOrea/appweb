import { useState, useEffect } from "react";

interface Props {
  visible: boolean;
  loading: boolean;
  onClose: () => void;
  onSubmit: (newPass: string, confirmPass: string) => void;
}

export default function NewPasswordModal({ visible, loading, onClose, onSubmit }: Props) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (!visible) {
      setNewPassword("");
      setConfirmPassword("");
    }
  }, [visible]);

  const handleSubmit = () => {
    onSubmit(newPassword, confirmPassword);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl p-6 w-11/12 max-w-md flex flex-col items-center">
        <h2 className="text-center text-gray-600 mb-5 text-sm">
          Ingresa tu nueva contraseña
        </h2>

        <input
          type="password"
          placeholder="Nueva contraseña"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full border border-yellow-300 rounded-xl px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />

        <input
          type="password"
          placeholder="Confirmar nueva contraseña"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full border border-yellow-300 rounded-xl px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full rounded-xl py-3 mb-3 text-white font-bold ${
            loading ? "bg-yellow-300 cursor-not-allowed" : "bg-yellow-500 hover:bg-yellow-600"
          }`}
        >
          {loading ? "Cargando..." : "Actualizar contraseña"}
        </button>

        <button
          onClick={onClose}
          className="text-center text-gray-500 underline font-bold"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}