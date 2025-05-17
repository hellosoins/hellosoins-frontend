// src/components/ResponsesSection.jsx
import React from "react";
import { Button } from "@/components/ui/Button";

const cards = [
  {
    title: "Stress & anxiété",
    subtitle: "Réduire la pression, retrouver la sérénité",
    img: "https://img.freepik.com/photos-gratuite/jeune-femme-souffrant-maux-tete_23-2148180645.jpg?ga=GA1.1.2015802602.1747418434&semt=ais_hybrid&w=740"
   
  },
  {
    title: "Maux de ventre",
    subtitle: "Retrouver un confort digestif naturellement",
     img: "https://img.freepik.com/photos-gratuite/jeune-homme-ayant-mal-au-ventre-chemise-carreaux-t-shirt-blanc-ayant-air-epuise_176474-84103.jpg?ga=GA1.1.2015802602.1747418434&semt=ais_hybrid&w=740",
  },
  {
    title: "Allergies & intolérances",
    subtitle: "Apaiser les réactions du corps",
    img: "https://img.freepik.com/photos-gratuite/femme-suffoque-reaction-allergique-fleurs-sauvages-garde-main-gorge-difficultes-respirer-yeux-rouges-qui-demangent-portent-t-shirt-decontracte-isole-blanc_273609-52366.jpg?ga=GA1.1.2015802602.1747418434&semt=ais_hybrid&w=740",
  },
  {
    title: "Fatigue & sommeil",
    subtitle: "Rééquilibrer l'énergie et améliorer le repos",
    img: "https://img.freepik.com/photos-gratuite/femme-affaires-fatiguee-couvrant-ses-yeux-yeux-dessines-papier_23-2148813192.jpg?ga=GA1.1.2015802602.1747418434&semt=ais_hybrid&w=740",
  },
  {
    title: "Maux de tête",
    subtitle: "Soulager les tensions et libérer l'esprit",
    img: "https://img.freepik.com/photos-gratuite/portrait-jeune-femme-afro-americaine-mecontente-intense-serrant-dents-douleur_176420-31344.jpg?ga=GA1.1.2015802602.1747418434&semt=ais_hybrid&w=740",
  },
  {
    title: "Addictions",
    subtitle: "Accompagner le sevrage et renforcer la volonté",
    img: "https://img.freepik.com/photos-premium/impact-abus-substances-sante-bien-etre-dans-societe-explorant-nature-addictions_151013-64599.jpg?ga=GA1.1.2015802602.1747418434&semt=ais_hybrid&w=740",
  },
   {
    title: "Psycho",
    subtitle: "Accompagner le sevrage et renforcer la volonté",
    img: "https://img.freepik.com/photos-gratuite/homme-parler-dame-psychologue-pendant-session_1157-47250.jpg?ga=GA1.1.2015802602.1747418434&semt=ais_hybrid&w=740",
  },
];

export default function ResponsesSection() {
  return (
    <section className="px-6 py-16 max-w-7xl mx-auto">
     

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <h2 className="text-3xl font-bold mb-12">
            Des réponses{" "}
        <span className="text-[#2b7a72]">
            à tous vos besoins 
        </span>
      </h2>
        {cards.map(({ title, subtitle, img }) => (
          <div
            key={title}
            className="flex px-2 justify-between items-center  bg-white border border-gray-200 rounded shadow-sm overflow-hidden hover:shadow-lg transition"
          >
            <div className="px-2 w-1/2">
              <h3 className="text-sm font-semibold mb-2">{title}</h3>
              <p className="text-gray-600 mb-4 text-xs">{subtitle}</p>
              <Button className="px-4 py-2 bg-white text-xs rounded border-2 font-bold shadow-none  border-[#3a8db1] text-[#3a8db1]  hover:text-white transition">
                En savoir plus 
              </Button>
            </div>
             <div
              className="h-48 bg-center bg-cover m-2 w-1/2"
              style={{ backgroundImage: `url(${img})` }}
            />
          </div>
        ))}

        {/* Carte "Découvrir plus" */}
        <div className="flex items-center justify-center">
          <Button className="px-6 font-bold py-4 text-lg rounded border-none bg-transparent shadow-none border-gray-300 text-[#1d3f5a] hover:border-[#2b7a72] hover:text-[#2b7a72] transition">
            Découvrir plus de réponses à vos besoins 
          </Button>
        </div>
      </div>
    </section>
  );
}
