import { useRouter } from "next/navigation";

interface ModalMenuProps {
  visible: boolean;
  onClose: () => void;
  user: any;
  setUser: (u: any) => void;
  onUpdate?: () => void;
}

export function ModalMenu({ visible, onClose, user, setUser, onUpdate }: ModalMenuProps) {
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    onUpdate?.();
    onClose();
    router.replace("/catalog");
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-end z-50">
      <div className="bg-white w-full max-w-xs p-6 rounded-t-2xl shadow-lg">
        <h2 className="text-center text-lg font-bold mb-6">Menú</h2>

        <div className="flex flex-col space-y-4">

          <button
            onClick={() => { onClose(); router.push("/pet"); }}
            className="flex items-center space-x-3 text-gray-600 hover:text-yellow-700"
          >

            <span className="text-sm font-medium">Inicio</span>
          </button>

          {!user && (
            <>
              <button
                onClick={() => { onClose(); router.push("/user/login"); }}
                className="flex items-center space-x-3 text-gray-600 hover:text-blue-500"
              >

                <span className="text-sm font-medium">Login</span>
              </button>

              <button
                onClick={() => { onClose(); router.push("/user/signup"); }}
                className="flex items-center space-x-3 text-gray-600 hover:text-green-500"
              >

                <span className="text-sm font-medium">Registro</span>
              </button>
            </>
          )}

          {user && (
            <>
              <button
                onClick={() => { onClose(); router.push("/pet/mypets"); onUpdate?.(); }}
                className="flex items-center space-x-3 text-gray-600 hover:text-pink-500"
              >

                <span className="text-sm font-medium">Mis mascotas</span>
              </button>

              <button
                onClick={() => { onClose(); router.push("/pet/favorites"); }}
                className="flex items-center space-x-3 text-gray-600 hover:text-red-500"
              >

                <span className="text-sm font-medium">Favoritos</span>
              </button>

              <button
                onClick={() => { onClose(); router.push("/adoption/requests"); }}
                className="flex flex-col items-start space-y-0 text-gray-600 hover:text-purple-500"
              >
                <div className="flex items-center space-x-3">

                  <span className="text-sm font-medium">Solicitudes</span>
                </div>
                <span className="text-sm font-medium">de adopción</span>
              </button>

              <button
                onClick={() => { onClose(); router.push("/user/account"); }}
                className="flex items-center space-x-3 text-gray-600 hover:text-indigo-500"
              >

                <span className="text-sm font-medium">Perfil</span>
              </button>

              <button
                onClick={logout}
                className="flex items-center space-x-3 text-red-500 hover:text-red-700 mt-2"
              >

                <span className="text-sm font-medium">Salir</span>
              </button>
            </>
          )}
        </div>

        <button
          onClick={onClose}
          className="block w-full text-center text-gray-500 mt-6 font-medium"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}