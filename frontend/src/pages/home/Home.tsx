import { useState } from "react";
import { AnimatePresence } from "motion/react";
import { Outlet } from "react-router-dom";

import MapView from "../../components/Map";
import Navbar from "../../components/NavBar";
import Register from "../../components/register/Register";
import Login from "../../components/login/Login";

type ModalType = "login" | "register" | null;

function Home() {
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  const closeModal = () => setActiveModal(null);

  return (
  <main className="relative h-screen w-screen overflow-hidden">
    {/* Navbar */}
    <Navbar
      onOpenLogin={() => setActiveModal("login")}
      onOpenRegister={() => setActiveModal("register")}
    />

    {/* Map */}
    <MapView />

    {/* Child routes */}
    <Outlet />

    {/* Auth modals */}
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

export default Home;