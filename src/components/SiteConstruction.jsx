import React from 'react';

const SiteConstruction = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#BDC1CA] text-[#405969] p-6">
      <div className="text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">hellosoins.com</h1>
        <p className="text-xl md:text-2xl mb-8">Notre site est actuellement en construction.</p>
        <div className="w-16 h-16 border-4 border-[#405969] border-dashed rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-sm">Merci pour votre patience.</p>
      </div>
    </div>
  );
};

export default SiteConstruction;
