import React, { createContext, useState, useCallback } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";

interface AuthContextType {
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  loading: false,
  error: null,
  login: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(
    async (email: string, password: string) => {
      setLoading(true);
      setError(null);
      try {
        await signInWithEmailAndPassword(auth, email, password);
      } catch (err) {
        setError("Credenciales incorrectas");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return (
    <AuthContext.Provider value={{ loading, error, login }}>
      {children}
    </AuthContext.Provider>
  );
};