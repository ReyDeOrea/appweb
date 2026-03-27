import { useRouter } from "next/navigation";
import { FaDoorOpen, FaKey, FaPaw, FaRegHeart } from "react-icons/fa";
import { FaListCheck } from "react-icons/fa6";
import { IoHome, IoKeypadOutline, IoPersonOutline } from "react-icons/io5";

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
  <div className="fixed top-0 left-0 h-screen z-50 flex ">
    <div className="bg-[#B7C979] w-[200px] h-full p-6 shadow-lg border-r border-[#8BA05F]">
      
      <div className="mb-8">
        <h2 className="text-center text-white text-xl font-bold mb-2">Menú</h2>
        <div className="w-12 h-1 bg-white mx-auto rounded-full opacity-50"></div>
      </div>

      <div className="flex flex-col space-y-2">

        <button
          onClick={() => router.push("/pet")}
          className="flex items-center space-x-3 px-4 py-3 text-white hover:bg-[#8BA05F] rounded-lg transition-all duration-300 group"
        >
          <span className="text-xl group-hover:scale-110 transition-transform">
            <IoHome />

          </span>
          <span className="text-sm font-medium">Inicio</span>
        </button>

        {!user && (
          <>
            <button
              onClick={() => router.push("/user/login")}
              className="flex items-center space-x-3 px-4 py-3 text-white hover:bg-[#8BA05F] rounded-lg transition-all duration-300 group"
            >
              <span className="text-xl group-hover:scale-110 transition-transform">
               <IoKeypadOutline />

              </span>
              <span className="text-sm font-medium">Iniciar sesión</span>
            </button>

            <button
              onClick={() => router.push("/user/signup")}
              className="flex items-center space-x-3 px-4 py-3 text-white hover:bg-[#8BA05F] rounded-lg transition-all duration-300 group"
            >
              <span className="text-xl group-hover:scale-110 transition-transform">
                <IoPersonOutline />

              </span>
              <span className="text-sm font-medium">Registrarse</span>
            </button>
          </>
        )}

        {user && (
          <>
            <div className="my-2 border-t border-white/30 pt-2">
              <p className="text-white/70 text-xs px-4 mb-2">Mi cuenta</p>
            </div>

            <button
              onClick={() => { router.push("/pet/mypets"); onUpdate?.(); }}
              className="flex items-center space-x-3 px-4 py-3 text-white hover:bg-[#8BA05F] rounded-lg transition-all duration-300 group"
            >
              <span className="text-xl group-hover:scale-110 transition-transform">
                <FaPaw />
</span>
              <span className="text-sm font-medium">Mis mascotas</span>
            </button>

            <button
              onClick={() => { router.push("/pet/favorites"); }}
              className="flex items-center space-x-3 px-4 py-3 text-white hover:bg-[#8BA05F] rounded-lg transition-all duration-300 group"
            >
              <span className="text-xl group-hover:scale-110 transition-transform">
                <FaRegHeart />
              </span>
              <span className="text-sm font-medium">Favoritos</span>
            </button>

            <button
              onClick={() => router.push("/adoption/requests")}
              className="flex flex-col items-start px-4 py-3 text-white hover:bg-[#8BA05F] rounded-lg transition-all duration-300 group"
            >
              <div className="flex items-center space-x-3">
                <span className="text-xl group-hover:scale-110 transition-transform">
                  <FaListCheck/>

                </span>
                <span className="text-sm font-medium">Solicitudes</span>
              </div>
              <span className="text-xs font-light ml-9 text-white/80">de adopción</span>
            </button>

            <button
              onClick={() => router.push("/user/account")}
              className="flex items-center space-x-3 px-4 py-3 text-white hover:bg-[#8BA05F] rounded-lg transition-all duration-300 group"
            >
              <span className="text-xl group-hover:scale-110 transition-transform">
                <IoPersonOutline />
              </span>
              <span className="text-sm font-medium">Perfil</span>
            </button>

            <div className="mt-4 pt-4 border-t border-white/30">
              <button
                onClick={logout}
                className="flex items-center space-x-3 px-4 py-3 text-white/90 hover:text-white bg-red-500/20 hover:bg-red-500/40 rounded-lg transition-all duration-300 w-full group"
              >
                <span className="text-xl group-hover:scale-110 transition-transform">
                  <FaDoorOpen />
                </span>
                <span className="text-sm font-medium">Cerrar sesión</span>
              </button>
            </div>
          </>
        )}

       

      </div>
    </div>
  </div>

  );
}