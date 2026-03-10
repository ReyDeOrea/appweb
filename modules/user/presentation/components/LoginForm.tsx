import { useState } from "react";
import { useRouter } from "next/router";
import { validateLoginData } from "../../application/valideteLoginData";
import { loginUser } from "../../application/loginUser";


export default function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      validateLoginData(username, password);
      await loginUser(username, password);
      router.replace("/catalog");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-white p-4">
  
      <div className="bg-[#D4B37A] w-full py-4 flex justify-center items-center">
        <h1 className="text-4xl font-bold text-white mr-2">Animaland</h1>
       
      </div>

      <div className="my-6 flex justify-center">
       
      </div>

      <p className="text-center text-gray-500 mb-4">
        Accede a tu cuenta para continuar
      </p>

      <div className="w-full max-w-md space-y-4">
        <div className="flex items-center border border-[#DAC193] rounded-xl px-3 py-2">
        
          <input
            type="text"
            placeholder="Usuario"
            className="ml-2 flex-1 text-lg focus:outline-none"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="flex items-center border border-[#DAC193] rounded-xl px-3 py-2">
          
          <input
            type="password"
            placeholder="Contraseña"
            className="ml-2 flex-1 text-lg focus:outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>

      <button
        onClick={handleLogin}
        disabled={loading}
        className="bg-[#E5DCCC] text-white font-bold rounded-2xl py-3 px-12 mt-6 disabled:opacity-50"
      >
        {loading ? "Cargando..." : "Entrar"}
      </button>

      <div className="flex items-center justify-center mt-4 space-x-2">
      
        <button
          onClick={() => router.push("/user/password")}
          className="text-blue-400 font-bold"
        >
          ¿Olvidaste tu contraseña?
        </button>
      </div>

      <div className="flex justify-center mt-4 space-x-1">
        <span>¿No tienes cuenta?</span>
        <button
          onClick={() => router.push("/user/signup")}
          className="text-blue-500 font-bold underline"
        >
          Regístrate
        </button>
      </div>
    </div>
  );
}