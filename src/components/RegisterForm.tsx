import React, { useState } from "react";

interface RegisterFormProps {
  onSubmit: (email: string, password: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit, loading, error }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(email, password);
  };

  return (
    <form
      className="space-y-6 w-full max-w-md mx-auto bg-[#21262d] py-8 px-6 shadow-lg rounded-lg"
      onSubmit={handleSubmit}
    >
      <div>
        <label htmlFor="register-email" className="block text-sm font-medium text-gray-300">
          Your email
        </label>
        <div className="mt-1">
          <input
            id="register-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="name@company.com"
            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-700 bg-[#161b22] placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      </div>
      <div>
        <label htmlFor="register-password" className="block text-sm font-medium text-gray-300">
          Password
        </label>
        <div className="mt-1">
          <input
            id="register-password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-700 bg-[#161b22] placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      </div>
      {error && <div className="text-red-400 text-sm text-center">{error}</div>}
      <div>
        <button
          type="submit"
          disabled={loading}
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {loading ? "Registering..." : "Sign up"}
        </button>
      </div>
    </form>
  );
};

export default RegisterForm;
