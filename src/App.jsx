import './App.css';
import { Route, Routes, useLocation } from 'react-router-dom';
import { SidebarProvider, SidebarInset } from '@/components/ui/Sidebar';

import AppSidebar from './components/common/app-sidebar';
import AppHeader from './components/common/app-header';
import HistoriqueRdvCard from './components/rdv/HistoriqueRdvCard';
import LoginPage from '@/pages/login/login-page';
import AccountCreationContainer from './components/common/AccountCreationContainer';
import AccueilPraticien from './pages/praticien/AccueilPraticien';
import Pratiques from './pages/praticien/Pratiques';
import Agenda from './pages/disponibilite/agenda/agenda';
import ProfilPatient from './pages/patients/ProfilPatient';
import DashboardPatient from './pages/patients/DashboardPatient';
import PraticienProfil from './pages/praticien/PraticienProfil';
import Disponibilités from './pages/disponibilite/disponibilite';
import Crenaux from './pages/crenaux/crenaux';
import PatientsPraticien from './pages/praticien/PatientsPraticien';
import CompleteProfile from './pages/praticien/ProfileComponents/CompleteProfile';
import EditFormation from './pages/praticien/ProfileComponents/EditFormation';
import TroubleConfig from './pages/praticien/ProfileComponents/TroubleConfig';
import PremierPas from './pages/praticien/PremierPas';
import Agendav2 from './pages/praticien/Agenda';

function App() {
  const location = useLocation();
  const isAgendaRoute = location.pathname === '/agenda';
  const isAuthRoute = ['/', '/login', '/signin'].includes(location.pathname);

  // Si /agenda, on n'utilise ni SidebarProvider ni SidebarInset
  if (isAgendaRoute) {
    return (
      <>
        <div className="content-full-width">
          <Routes>
            <Route path="/agenda" element={<Agendav2 />} />
          </Routes>
        </div>
      </>
    );
  }

  return (
    <SidebarProvider>
      {/* Sidebar affichée sauf sur login/signin */}
      {!isAuthRoute && <AppSidebar />}

      <SidebarInset>
        {/* Header affiché sauf sur login/signin */}
        {!isAuthRoute && <AppHeader />}
        <div className={isAuthRoute ? 'content-full-width' : 'content-with-inset'}>
          <Routes>
            {/* Pages de connexion */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signin" element={<AccountCreationContainer />} />
            <Route path="/" element={<LoginPage />} />

            {/* PRATICIEN */}
            <Route path="/praticien/dashboard" element={<AccueilPraticien />} />
            <Route path="/praticien/premierPas" element={<PremierPas />} />
            <Route path="/pratiques" element={<Pratiques />} />
            <Route path="/profil" element={<PraticienProfil />} />
            <Route path="/plage-horaire" element={<Disponibilités />} />
            <Route path="/type-rendez-vous" element={<Crenaux />} />
            <Route path="/praticien/patients" element={<PatientsPraticien />} />
            <Route path="/completeProfile" element={<CompleteProfile />} />
            <Route path="/editFormation" element={<EditFormation />} />
            <Route path="/troubleConfig" element={<TroubleConfig />} />

            {/* PATIENTS */}
            <Route path="/about" element={<ProfilPatient />} />
            <Route path="/historique/rdv" element={<DashboardPatient />} />
            <Route path="/historique/rdv/:id" element={<HistoriqueRdvCard />} />
          </Routes>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default App;
