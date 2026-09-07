import { useState } from "react";
import { AnimatePresence } from "motion/react";

import MapView from "./components/Map";
import Navbar from "./components/NavBar";
import Register from "./components/register/Register";
import Login from "./components/login/Login";

type ModalType = "login" | "register" | null;

function App() {
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  const closeModal = () => setActiveModal(null);

  return (
    <main className="relative h-screen w-screen overflow-hidden">
      {/* Navbar overlay */}
      <Navbar
        onOpenLogin={() => setActiveModal("login")}
        onOpenRegister={() => setActiveModal("register")}
      />

      {/* Base Map View */}
      <MapView />

      {/* Modal overlays */}
      <AnimatePresence>
        {activeModal === "register" && (
          <Register
            onClose={closeModal}
            onSwitchToLogin={() => setActiveModal("login")}
          />
        )}

        {activeModal === "login" && (
          <Login
            onClose={closeModal}
            onSwitchToRegister={() => setActiveModal("register")}
          />
        )}
      </AnimatePresence>
    </main>
  );
}

export default App;