import React, { useState } from "react";

interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, loading, error }) => {
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
        <label htmlFor="email" className="block text-sm font-medium text-gray-300">
          Your email
        </label>
        <div className="mt-1">
          <input
            id="email"
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
        <label htmlFor="password" className="block text-sm font-medium text-gray-300">
          Password
        </label>
        <div className="mt-1">
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-700 bg-[#161b22] placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember_me"
            name="remember_me"
            type="checkbox"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-700 rounded bg-[#161b22]"
          />
          <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-300">
            Remember me
          </label>
        </div>
        <div className="text-sm">
          <button
            type="button"
            className="font-medium text-blue-400 hover:underline"
            tabIndex={-1}
          >
            Forgot password?
          </button>
        </div>
      </div>
      {error && <div className="text-red-400 text-sm text-center">{error}</div>}
      <div>
        <button
          type="submit"
          disabled={loading}
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
