import React, { useState, useEffect } from "react";
import HeroDesktop from "./responsive/hero/HeroDesktop";
import HeroTablet from "./responsive/hero/HeroTablet";
import HeroMobile from "./responsive/hero/HeroMobile";

const HeroSection = () => {
  const [device, setDevice] = useState("desktop");

  const handleResize = () => {
    const width = window.innerWidth;
    if (width >= 1100) setDevice("desktop");
    else if (width >= 768) setDevice("tablet");
    else setDevice("mobile");
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {device === "desktop" && <HeroDesktop />}
      {device === "tablet" && <HeroTablet />}
      {device === "mobile" && <HeroMobile />}
    </>
  );
};

export default HeroSection;
