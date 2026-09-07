import { useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, Eye, EyeOff, Loader2, Lock, Mail, LogIn, X } from "lucide-react";

import type { UserLoginData } from "../../types/user.type";
import { useGlobalContext } from "../../context/GlobalContext";

interface LoginProps {
  onClose: () => void;
  onSwitchToRegister: () => void;
}

function Login({ onClose, onSwitchToRegister }: LoginProps) {
  const [loginData, setLoginData] = useState<UserLoginData>({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { login, loading } = useGlobalContext();

  const handleLoginInputs = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errorMessage) setErrorMessage(null);
  };

  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await login(loginData);
      onClose(); // Closes modal and returns to map on success
    } catch (error: any) {
      console.error("Login failed:", error);
      setErrorMessage(
        error?.response?.data?.message || "Invalid email or password. Please try again."
      );
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="relative w-full max-w-lg my-auto overflow-hidden rounded-3xl border border-white/30 bg-white/95 shadow-2xl backdrop-blur-xl"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition"
        >
          <X size={18} />
        </button>

        <div className="h-1.5 w-full bg-blue-600" />

        <div className="p-5 sm:p-8 max-h-[90vh] overflow-y-auto">
          <motion.form
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onSubmit={handleLoginSubmit}
            className="space-y-4 sm:space-y-5"
          >
            <div className="mb-4 sm:mb-6">
              <div className="mb-3 flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <LogIn size={22} />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900">
                Welcome back
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-gray-500">
                Sign in to your account and explore companies around you.
              </p>
            </div>

            {errorMessage && (
              <div className="rounded-xl border border-red-100 bg-red-50 p-3 text-xs sm:text-sm text-red-600">
                {errorMessage}
              </div>
            )}

            <div>
              <label htmlFor="email" className="mb-1.5 block text-xs sm:text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  value={loginData.email}
                  onChange={handleLoginInputs}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 hover:border-gray-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                />
              </div>
            </div>

            <PasswordInput
              label="Password"
              name="password"
              id="password"
              value={loginData.password}
              onChange={handleLoginInputs}
            />

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="group mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-colors duration-200 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Logging in...
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight size={18} className="transition-transform duration-200 group-hover:translate-x-1" />
                </>
              )}
            </motion.button>

            <p className="pt-2 text-center text-xs sm:text-sm text-gray-500">
              Don't have an account?{" "}
              <span
                onClick={onSwitchToRegister}
                className="cursor-pointer font-semibold text-blue-600 hover:text-blue-700"
              >
                Create an account
              </span>
            </p>
          </motion.form>
        </div>
      </motion.div>
    </div>
  );
}

interface PasswordInputProps {
  label: string;
  name: string;
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function PasswordInput({ label, name, id, value, onChange }: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-xs sm:text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="relative">
        <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type={showPassword ? "text" : "password"}
          name={name}
          id={id}
          required
          value={value}
          onChange={onChange}
          placeholder="••••••••"
          className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-10 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 hover:border-gray-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-700"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
}

export default Login;