// App.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import "./style-soins.css";
import logo from "./image/hellosoins.png";
import background from "./image/hero-accueil.png";
import { Services, Contact } from "./section/section";
import { UserCheck, LogIn, BetweenHorizonalEnd, Menu, X, User } from "lucide-react";
import { Locate, UserCircle, ArrowDownLeftFromCircle } from "lucide-react";


/* ================================
   Composants Header, SearchForm, Hero, SearchResultsLayout, Footer
================================ */
const Header = () => {
  const [headerBg, setHeaderBg] = useState("bg-transparent");
  const [menuOpen, setMenuOpen] = useState(false);

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
      <div className="container flex items-center justify-between h-20 mx-auto ">
        <div className="flex items-center space-x-4">
          <img src={logo} alt="Logo" className="h-10" />
        </div>
        <nav className="flex-1 items-start justify-start text-md hidden ml-6 md:flex space-x-5">
          <Link className="transition-colors duration-300 ease-in-out hover:text-helloSoin  text-blue-gray-700  bg-transparent border-none shadow-none">
            Accueil
          </Link>
          <Link className="transition-colors duration-300 ease-in-out hover:text-helloSoin  text-blue-gray-700  bg-transparent border-none shadow-none">
            Spécialités
          </Link>
          <Link className="transition-colors duration-300 ease-in-out hover:text-helloSoin  text-blue-gray-700  bg-transparent border-none shadow-none">
            Troubles
          </Link>
          <Link className="transition-colors duration-300 ease-in-out hover:text-helloSoin  text-blue-gray-700  bg-transparent border-none shadow-none">
            Solutions
          </Link>
          <Link className="transition-colors duration-300 ease-in-out hover:text-helloSoin  text-blue-gray-700  bg-transparent border-none shadow-none">
            Nous découvrir
          </Link>
          <Link className="transition-colors duration-300 ease-in-out hover:text-helloSoin  text-blue-gray-700  bg-transparent border-none shadow-none">
            Blog
          </Link>
        </nav>
        <div className="hidden space-x-4 md:flex">
          <Button className=" rounded-2xl transition-colors duration-300 ease-in-out hover:bg-helloSoin  text-white border-none shadow-none bg-[#2b7a72] text-sm">
            <User /> Espace Pro
          </Button>
          <Link to="/login">
            <Button className="rounded-2xl transition-colors duration-300 ease-in-out hover:text-helloSoin  bg-white border-2 shadow-none text-[#2b7a72] border-[#1e5e56] text-sm">
              <UserCheck /> Espace particulier
            </Button>
          </Link>
        </div>
        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-white focus:outline-none"
          >
            {menuOpen ? <X size={30} /> : <Menu size={30} />}
          </button>
        </div>
      </div>
      {menuOpen && (
        <div className="md:hidden bg-[#2b7a72] absolute top-20 left-0 w-full flex flex-col items-center py-4 space-y-4">
          <Link className="transition-colors duration-300 ease-in-out hover:bg-helloSoin  text-white bg-transparent border-none shadow-none">
            Accueil
          </Link>
          <Link className="transition-colors duration-300 ease-in-out hover:bg-helloSoin  text-white bg-transparent border-none shadow-none">
            Services
          </Link>
          <Link className="transition-colors duration-300 ease-in-out hover:bg-helloSoin  text-white bg-transparent border-none shadow-none">
            Contact
          </Link>
          <Link className="transition-colors duration-300 ease-in-out hover:bg-helloSoin  text-white border-none shadow-none bg-[#1e5e56] text-sm">
            <LogIn /> Se connecter
          </Link>
          <Link className="transition-colors duration-300 ease-in-out hover:bg-helloSoin  text-white border-none shadow-none bg-[#1e5e56] text-sm">
            <BetweenHorizonalEnd /> S'inscrire
          </Link>
          <Link to="/login">
            <Button className="transition-colors duration-300 ease-in-out hover:bg-helloSoin  bg-white border-none shadow-none text-[#1e5e56] border-2-[#1e5e56] text-sm">
              <UserCheck /> Êtes-vous praticien ?
            </Button>
          </Link>
        </div>
      )}
    </header>
  );
};


const Hero = ({ onSearch }) => {
  return (
    <section id="accueil" className="relative h-screen bg-custom-bg">
      <div className="absolute inset-0 bg-custom-bg"></div>

      {/* Image de fond masquée sur mobile/tablette */}
      <div className="absolute hidden md:block right-0 bottom-0">
        <img
          src={background}
          alt="Pratique fond"
          className="h-[90vh] object-right"
        />
      </div>

      {/* Contenu principal Hero */}
      <div className="container relative flex flex-col items-start justify-start h-screen pt-[30vh] mx-auto md:items-start">
        <h1 className="w-full mb-4 text-5xl font-bold text-center text-gray-900 md:w-2/4 md:text-start">
          Trouvez l’accompagnement qui vous{" "}
          <span className="text-[#5DA781]">correspond.</span>
        </h1>
        <p className="w-full text-md text-center text-gray-500 md:w-2/4 md:text-start">
          Vous ne savez pas quelle pratique de médecine douce choisir ? <br/>
          <span className="text-gray-800 font-bold">HelloSoins</span> vous aide à
          trouver celle qui vous correspond, en fonction de ce que vous ressentez
        </p>
      </div>

      {/* Bande verte — parent relatif pour la carte */}
      <div className="relative w-full h-[20vh] bg-[#5DA781] overflow-visible">
        {/* Carte flottante au-dessus de la bande verte
        <div
          className="absolute h-[50vh] bottom-[-35vh] border left-16 transform -translate-y-1/2
                     bg-white p-6 rounded-xl  w-[40vw] z-10"
        >
          <h3 className="text-xl font-semibold mb-2">Votre carte info</h3>
          <p className="text-sm text-gray-600">
            Quelques informations importantes sur les services.
          </p>
          <button className="mt-4 w-full bg-[#2b7a72] text-white py-2 rounded-lg">
            En savoir plus
          </button>
        </div> */}
      </div>
    </section>
  );
};



/* ================================
   Composant principal Accueil
================================ */
const Accueil = () => {
  const [searchResults, setSearchResults] = useState([]);

  const onReset = () => {
    setSearchResults([]); // Réinitialise l'état
  };

  const handleSearch = (specialty, location) => {
    const results = fakeDoctors.filter(
      (doctor) =>
        doctor.specialty.toLowerCase().includes(specialty.toLowerCase()) &&
        doctor.address.toLowerCase().includes(location.toLowerCase())
    );
    setSearchResults(results);
  };

  return (
    <div className="App">
      <Header />
      <main>
          <Hero/>
        {/* <MedicalGrid />
        <ContactSection /> */}
      </main>
      {/* <Footer /> */}
    </div>
  );
};

export default Accueil;
