import { LogIn, User, UserPlus } from "lucide-react";
import { useGlobalContext } from "../context/GlobalContext";
import { useNavigate  } from "react-router-dom";

interface NavbarProps {
  onOpenLogin: () => void;
  onOpenRegister: () => void;
}

export default function Navbar({ onOpenLogin, onOpenRegister }: NavbarProps) {
  const { user } = useGlobalContext();
  const navigate = useNavigate();

  return (
    <header className="fixed top-4 left-1/2 z-30 flex -translate-x-1/2 items-center justify-between w-[92%] max-w-5xl rounded-2xl border border-white/40 bg-white/80 px-4 py-3 shadow-lg backdrop-blur-md">
      {/* Brand Logo */}
      <div className="flex items-center gap-2 font-bold text-lg text-gray-900 tracking-tight">
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-white font-black text-sm">
          D
        </span>
        DISCOVER
      </div>

      {/* Navigation Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {user ? (
          /* =========================================
             LOGGED IN STATE: Shows User info
             ========================================= */
          <div className="flex items-center gap-2 sm:gap-3">
            <button onClick={() => navigate("/profile")}>
            <div className="flex items-center gap-2 rounded-xl bg-blue-50/80 px-3 py-1.5 text-xs sm:text-sm font-semibold text-blue-700 border border-blue-100">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white text-xs">
                {user.name ? user.name.charAt(0).toUpperCase() : <User size={12} />}
              </div>
              <span className="max-w-[120px] truncate sm:max-w-[160px]">
                {user.name || "Logged In"}
              </span>
            </div>
            </button>
          </div>
        ) : (
          /* =========================================
             LOGGED OUT STATE: Shows Login & Register
             ========================================= */
          <>
            <button
              type="button"
              onClick={onOpenLogin}
              className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold text-gray-700 transition hover:bg-gray-100 hover:text-gray-900"
            >
              <LogIn size={16} />
              Login
            </button>

            <button
              type="button"
              onClick={onOpenRegister}
              className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs sm:text-sm font-semibold text-white shadow-md shadow-blue-600/25 transition hover:bg-blue-700"
            >
              <UserPlus size={16} />
              Register
            </button>
          </>
        )}
      </div>
    </header>
  );
}