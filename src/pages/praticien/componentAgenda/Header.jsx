import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { ChevronLeft, Settings, MapPinHouse, List, ChevronRight } from 'lucide-react';

export const Header = ({ currentView, setCurrentView }) => (
  <header className="bg-white border-b p-2 text-xs flex items-center justify-between">
    <div className="flex space-x-2">
      <Link to="/praticien/dashboard">
        <Button variant="link" className="flex items-center border text-xs rounded">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Sortir
        </Button>
      </Link>
      <Link to="/plage-horaire">
        <Button variant="link" className="flex items-center border text-xs rounded">
          <Settings className="w-4 h-4 mr-1" />
          Paramétrage
        </Button>
      </Link>
      <Link to="/plage-horaire">
        <Button variant="link" className="flex items-center border text-xs rounded">
          <MapPinHouse className="w-4 h-4 mr-1" />
          Cabinet
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </Link>
      <p className="text-orange-700 text-sm">🚧 ( En cours de concéption ... )</p>
    </div>
    <div className="flex space-x-2">
      <Button
        variant={currentView === 'day' ? 'default' : 'outline'}
        onClick={() => setCurrentView('day')}
        size="sm"
        className="shadow-none"
      >
        Jour
      </Button>
      <Button
        variant={currentView === 'week' ? 'default' : 'outline'}
        onClick={() => setCurrentView('week')}
        size="sm"
        className="shadow-none text-xs py-2"
      >
        Semaine
      </Button>
      <Button
        variant={currentView === 'month' ? 'default' : 'outline'}
        onClick={() => setCurrentView('month')}
        size="sm"
        className="shadow-none text-xs py-2"
      >
        Mois
      </Button>
      <Button
        variant={currentView === 'all' ? 'default' : 'outline'}
        size="sm"
        className="shadow-none text-xs py-2"
        onClick={() => setCurrentView('all')}
      >
        <List className="w-4 h-4 mr-1"/>
        Tous les rendez-vous
      </Button>
    </div>
  </header>
);