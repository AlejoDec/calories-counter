import { useState, useContext } from "react";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";
import { auth } from "../firebaseConfig";
import { AuthContext } from "../context/AuthContext"; // Adjust the path as needed
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const AuthPage = () => {
  const [view, setView] = useState<"login" | "register">("login");
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);
  const JWT = randomUUID();
  const navigate = useNavigate();

  // Get loading and error from AuthContext
  const { loading, error } = useContext(AuthContext);

  const handleLogin = async (email: string, password: string) => {
    try {
      signInWithEmailAndPassword(auth, email, password)
        .then(() => {
            localStorage.setItem("jwt", JWT);
            navigate("/app")
        })
        .catch((err) => {
            setLoginError("Credenciales incorrectas");
            console.error("Login failed:", err);
        });
    } catch {
      // El error ya es manejado por el contexto
        // No es necesario hacer nada aquí, el error se mostrará en el LoginForm
        console.error("Login failed");
    }
  };

  const handleRegister = async (email: string, password: string) => {
    setRegisterLoading(true);
    setRegisterError(null);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // El AuthContext detectará el cambio y redirigirá
    } catch (err: any) {
      setRegisterError("Credenciales incorrectas");
    } finally {
      setRegisterLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#161b22] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <h1 className="text-center text-white font-bold mb-8 text-6xl">Bienvendio al contador de calorias por medio de IA</h1>
    <p className="text-center text-white mb-6">Tienes que iniciar sesion o crear cuenta para poder usar la aplicacion, el unico motivo de esto es llevar conteo de uso :)</p>
      {view === "login" ? (
        <LoginForm
          onSubmit={handleLogin}
          loading={loading}
          error={error}
        />
      ) : (
        <RegisterForm
          onSubmit={handleRegister}
          loading={registerLoading}
          error={registerError}
        />
      )}
      <div className="mt-6 text-center">
        <button
          onClick={() => setView(view === "login" ? "register" : "login")}
          className="text-blue-500 hover:text-blue-700 focus:outline-none"
        >
          {view === "login"
            ? "Don't have an account? Sign up"
            : "Already have an account? Log in"}
        </button>
        {
            loginError && (
                <div className="text-red-400 text-sm mt-2">
                    {loginError}
                </div>
            )
        }
      </div>
    </div>
  );
};

function randomUUID() {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    // Fallback for environments without crypto.randomUUID
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0,
            v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

export default AuthPage;

