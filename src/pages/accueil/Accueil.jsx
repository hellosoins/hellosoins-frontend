import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import "./style-soins.css";
import logo from "./image/hellosoins.png";
import { UserCheck, User, Menu, X } from "lucide-react";
import HeroSection from "./HeroSections";
import ResponsesSection from "./ResponsesSection";

/* ================================
   Composants Header, Accueil
================================ */
const Header = () => {
  const [headerBg, setHeaderBg] = useState("bg-transparent");
  const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
      // Setup viewport for mobile
      const viewport = document.querySelector("meta[name=viewport]");
      const contentValue =
        "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no";
      if (viewport) {
        viewport.setAttribute("content", contentValue);
      } else {
        const meta = document.createElement("meta");
        meta.name = "viewport";
        meta.content = contentValue;
        document.head.appendChild(meta);
      }
    }, []);

  useEffect(() => {
    const handleScroll = () => {
      setHeaderBg(window.scrollY > 50 ? "bg-custom-bg" : "bg-transparent");
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      style={{
        transition: "top 5s ease-in-out",
      }}
      id="header"
      className={`${headerBg} fixed w-full top-0 left-0 z-50 transition-all duration-300 text-blue-gray-700 accueil-header-animation`}
    >
      <div className="px-10 flex items-center justify-between h-20 mx-auto ">
        <div className="flex items-center space-x-4">
          <img src={logo} alt="Logo" className="h-10" />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden xl:flex space-x-6 text-md">
          <Link to="/#" className="hover:text-helloSoin transition-colors">Accueil</Link>
          <Link to="/#" className="hover:text-helloSoin transition-colors">Spécialités</Link>
          <Link to="/#" className="hover:text-helloSoin transition-colors">Troubles</Link>
          <Link to="/#" className="hover:text-helloSoin transition-colors">Solutions</Link>
          <Link to="/#" className="hover:text-helloSoin transition-colors">Nous découvrir</Link>
          <Link to="/#" className="hover:text-helloSoin transition-colors">Blog</Link>
        </nav>

        {/* Desktop Buttons */}
        <div className="hidden xl:flex items-center space-x-4">
          <Link to="/login">
            <Button className="rounded-2xl bg-[#2b7a72] text-white text-sm hover:bg-helloSoin transition-colors">
              <User /> Espace Pro
            </Button>
          </Link>
          <Link to="/#">
            <Button className="rounded-2xl bg-white text-[#2b7a72] border-2 border-[#1e5e56] text-sm hover:text-helloSoin transition-colors">
              <UserCheck /> Espace particulier
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="xl:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-[#2b7a72] focus:outline-none"
          >
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <div className="xl:hidden bg-[#2b7a72] text-white flex flex-col items-center py-6 space-y-4">
          <Link to="/" className="w-full text-center py-2 hover:bg-[#1e5e56] transition-colors">Accueil</Link>
          <Link to="/" className="w-full text-center py-2 hover:bg-[#1e5e56] transition-colors">Spécialités</Link>
          <Link to="/#" className="w-full text-center py-2 hover:bg-[#1e5e56] transition-colors">Troubles</Link>
          <Link to="/#" className="w-full text-center py-2 hover:bg-[#1e5e56] transition-colors">Solutions</Link>
          <Link to="/#" className="w-full text-center py-2 hover:bg-[#1e5e56] transition-colors">Nous découvrir</Link>
          <Link to="/#" className="w-full text-center py-2 hover:bg-[#1e5e56] transition-colors">Blog</Link>
          <Link to="/login" className="w-full">
            <Button className="w-full rounded-2xl bg-white text-[#2b7a72] text-sm hover:bg-helloSoin transition-colors">
              <User /> Espace Pro
            </Button>
          </Link>
          <Link to="/#" className="w-full">
            <Button className="w-full rounded-2xl bg-[#1e5e56] text-sm hover:bg-helloSoin transition-colors">
              <UserCheck /> Espace particulier
            </Button>
          </Link>
        </div>
      )}
    </header>
  );
};

const Accueil = () => {
  return (
    <div>
      <Header />
      <main>
        <HeroSection/>
        <ResponsesSection/>
      </main>
    </div>
  );
};

export default Accueil;
