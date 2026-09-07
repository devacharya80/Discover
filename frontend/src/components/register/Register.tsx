import { motion } from "motion/react";
import { useState } from "react";
import { ArrowRight, Eye, EyeOff, Lock, Mail, User, X } from "lucide-react";

import type { UserRegisterData, UserLocationType } from "../../types/user.type";
import { useGlobalContext } from "../../context/GlobalContext";
import UserLocationRegister from "./UserLocationRegister";

interface RegisterProps {
  onClose: () => void;
  onSwitchToLogin: () => void;
}

function Register({ onClose, onSwitchToLogin }: RegisterProps) {
  const [registerData, setRegisterData] = useState<UserRegisterData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    location: undefined,
  });

  const [step, setStep] = useState<"account" | "location">("account");
  const [error, setError] = useState<string | null>(null);
  const { register, loading } = useGlobalContext();

  const handleRegisterInputs = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegisterData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (error) setError(null);
  };

  const handleAccountSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (registerData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (registerData.password !== registerData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError(null);
    setStep("location");
  };

  const handleLocationChange = (location: UserLocationType) => {
    setRegisterData((prevData) => ({
      ...prevData,
      location,
    }));
  };

  const handleRegister = async () => {
    try {
      await register(registerData);
      onClose();
    } catch (err) {
      console.error("Registration failed:", err);
    }
  };

  const handleSkip = async () => {
    try {
      await register({
        ...registerData,
        location: undefined,
      });
      onClose();
    } catch (err) {
      console.error("Registration failed:", err);
    }
  };

  const isPasswordMismatch =
    Boolean(registerData.confirmPassword) &&
    registerData.password !== registerData.confirmPassword;

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
          {step === "account" && (
            <motion.form
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              onSubmit={handleAccountSubmit}
              className="space-y-4 sm:space-y-5"
            >
              <div className="mb-4 sm:mb-6">
                <div className="mb-3 flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                  <User size={22} />
                </div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900">
                  Create your account
                </h1>
                <p className="mt-1 text-xs sm:text-sm text-gray-500">
                  Join DISCOVER and explore companies around you.
                </p>
              </div>

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs sm:text-sm font-medium text-red-600">
                  {error}
                </div>
              )}

              <div>
                <label
                  htmlFor="name"
                  className="mb-1.5 block text-xs sm:text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <div className="relative">
                  <User
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    value={registerData.name}
                    onChange={handleRegisterInputs}
                    placeholder="Your full name"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 hover:border-gray-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-xs sm:text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="email"
                    name="email"
                    id="email"
                    required
                    value={registerData.email}
                    onChange={handleRegisterInputs}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 hover:border-gray-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>
              </div>

              <PasswordInput
                label="Password"
                name="password"
                id="password"
                value={registerData.password}
                onChange={handleRegisterInputs}
              />

              <PasswordInput
                label="Confirm Password"
                name="confirmPassword"
                id="confirmPassword"
                value={registerData.confirmPassword}
                onChange={handleRegisterInputs}
                hasError={isPasswordMismatch}
              />

              {isPasswordMismatch && (
                <p className="text-xs text-red-500 font-medium">
                  Passwords do not match.
                </p>
              )}

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isPasswordMismatch}
                className="group mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-colors duration-200 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
                <ArrowRight
                  size={18}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </motion.button>

              <p className="pt-2 text-center text-xs sm:text-sm text-gray-500">
                Already have an account?{" "}
                <span
                  onClick={onSwitchToLogin}
                  className="cursor-pointer font-semibold text-blue-600 hover:text-blue-700"
                >
                  Login
                </span>
              </p>
            </motion.form>
          )}

          {step === "location" && (
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              <UserLocationRegister
                locationData={
                  registerData.location ?? {
                    address: "",
                    city: "",
                    state: "",
                    country: "India",
                    pincode: "",
                    latitude: undefined,
                    longitude: undefined,
                  }
                }
                onLocationChange={handleLocationChange}
                onRegister={handleRegister}
                onSkip={handleSkip}
                onBack={() => setStep("account")}
                loading={loading}
              />
            </motion.div>
          )}
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
  hasError?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function PasswordInput({
  label,
  name,
  id,
  value,
  hasError = false,
  onChange,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-xs sm:text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      <div className="relative">
        <Lock
          size={18}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type={showPassword ? "text" : "password"}
          name={name}
          id={id}
          required
          value={value}
          onChange={onChange}
          placeholder="••••••••"
          className={`w-full rounded-xl border bg-gray-50 py-3 pl-10 pr-10 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 ${
            hasError
              ? "border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
              : "border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
          }`}
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

export default Register;