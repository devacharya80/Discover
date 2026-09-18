import { useState } from "react";
import { AnimatePresence } from "motion/react";
import { Outlet } from "react-router-dom";
import MapView from "../../components/Map";
import Navbar from "../../components/NavBar";
import Register from "../../components/register/Register";
import Login from "../../components/login/Login";
import JobDiscoveryPanel from "../../components/JobDiscoveryPanel";
type ModalType="login"|"register"|null;
export default function Home(){const[activeModal,setActiveModal]=useState<ModalType>(null);return <main className="relative h-screen w-screen overflow-hidden"><Navbar onOpenLogin={()=>setActiveModal("login")} onOpenRegister={()=>setActiveModal("register")}/><MapView/><JobDiscoveryPanel/><Outlet/><AnimatePresence>{activeModal==="register"&&<Register onClose={()=>setActiveModal(null)} onSwitchToLogin={()=>setActiveModal("login")}/>} {activeModal==="login"&&<Login onClose={()=>setActiveModal(null)} onSwitchToRegister={()=>setActiveModal("register")}/>}</AnimatePresence></main>}
