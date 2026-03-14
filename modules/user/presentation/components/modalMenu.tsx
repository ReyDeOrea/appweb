import { useRouter } from "next/navigation";

interface ModalMenuProps {
  user: any;
  setUser: (u: any) => void;
  onUpdate?: () => void;
}

export function ModalMenu({  user, setUser, onUpdate }: ModalMenuProps) {
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    onUpdate?.();
    router.replace("/pet");
  };


  return (
<div className="fixed top-0 left-0 h-screen z-50 flex">
<div className="bg-white w-[150px] h-full p-6 shadow-lg border-r border-gray-200">

        <h2 className="text-center text-lg font-bold mb-6">Menú</h2>

        <div className="flex flex-col space-y-4">

          <button
            onClick={() =>  router.push("/pet") }
            className="flex items-center space-x-3 text-gray-600 hover:text-yellow-700"
          >

            <span className="text-sm font-medium">Inicio</span>
          </button>

          {!user && (
            <>
              <button
                onClick={() =>  router.push("/user/login")}
                className="flex items-center space-x-3 text-gray-600 hover:text-blue-500"
              >

                <span className="text-sm font-medium">Login</span>
              </button>

              <button
                onClick={() => router.push("/user/signup")}
                className="flex items-center space-x-3 text-gray-600 hover:text-green-500"
              >

                <span className="text-sm font-medium">Registro</span>
              </button>
            </>
          )}

          {user && (
            <>
              <button
                onClick={() => { router.push("/pet/mypets"); onUpdate?.(); }}
                className="flex items-center space-x-3 text-gray-600 hover:text-pink-500"
              >

                <span className="text-sm font-medium">Mis mascotas</span>
              </button>

              <button
                onClick={() => { router.push("/pet/favorites"); }}
                className="flex items-center space-x-3 text-gray-600 hover:text-red-500"
              >

                <span className="text-sm font-medium">Favoritos</span>
              </button>

              <button
                onClick={() => router.push("/adoption/requests")}
                className="flex flex-col items-start space-y-0 text-gray-600 hover:text-purple-500"
              >
                <div className="flex items-center space-x-3">

                  <span className="text-sm font-medium">Solicitudes</span>
                </div>
                <span className="text-sm font-medium">de adopción</span>
              </button>

              <button
                onClick={() => router.push("/user/account")}
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
      </div>
    </div>
  );
}