import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { ChevronLeft, ChevronRight, ChevronDown, Settings, MapPinHouse, List } from 'lucide-react';
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isSameDay,
  startOfDay,
  addDays,
  subDays,
  setHours,
  setMinutes
} from 'date-fns';
import { fr } from 'date-fns/locale';

// Configuration initiale
const scheduleData = {
  regularSchedules: [
    {
      id: "REG-001",
      dayOfWeek: "monday",
      timeSlots: [
        { start: "08:00", end: "12:00" },
        { start: "13:00", end: "17:00" }
      ],
      active: true,
      createdAt: "2024-03-01T09:00:00Z",
      updatedAt: "2024-03-01T09:00:00Z"
    },
    {
      id: "REG-002",
      dayOfWeek: "tuesday",
      timeSlots: [
        { start: "09:00", end: "12:30" },
        { start: "14:00", end: "18:00" }
      ],
      active: true,
      createdAt: "2024-03-01T09:00:00Z",
      updatedAt: "2024-03-01T09:00:00Z"
    }
  ],

  scheduleOverrides: [
    {
      id: "OVR-001",
      date: "2025-05-05",
      type: "modified",
      timeSlots: [ { start: "10:00", end: "12:00" },
        { start: "14:30", end: "16:00" }],
      status: "active",
      createdAt: "2025-05-15T10:00:00Z",
      updatedAt: "2025-05-15T10:00:00Z"
    },
    {
      id: "OVR-002",
      date: "2024-03-20",
      type: "modified",
      timeSlots: [
        { start: "10:00", end: "12:00" },
        { start: "14:30", end: "16:00" }
      ],
      status: "active",
      createdAt: "2024-03-01T10:00:00Z",
      updatedAt: "2024-03-01T10:00:00Z"
    }
  ]
};

const Agendav2 = () => {
  const today = startOfDay(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [currentWeekStart, setCurrentWeekStart] = useState(() =>
    startOfWeek(today, { locale: fr, weekStartsOn: 1 })
  );
  const [currentDay, setCurrentDay] = useState(today);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [currentView, setCurrentView] = useState('week');
  const scrollRef = useRef(null);

  useEffect(() => {
    const el8 = document.getElementById('slot-8');
    if (el8 && scrollRef.current) {
      el8.scrollIntoView({ behavior: 'auto', block: 'start' });
    }
  }, [currentWeekStart, currentDay]);

  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevDay = () => setCurrentDay(subDays(currentDay, 1));
  const nextDay = () => setCurrentDay(addDays(currentDay, 1));

  const [hoverTime, setHoverTime] = useState(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const [schedules, setSchedules] = useState(scheduleData);




  // Corriger la fonction isWorkingTime
  const isWorkingTime = (date) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    const dayName = format(date, 'EEEE', { locale: fr }).toLowerCase();
    
    // Convertir le nom du jour en anglais
    const frenchToEnglishDays = {
      'lundi': 'monday',
      'mardi': 'tuesday',
      'mercredi': 'wednesday',
      'jeudi': 'thursday',
      'vendredi': 'friday',
      'samedi': 'saturday',
      'dimanche': 'sunday'
    };
    const englishDayName = frenchToEnglishDays[dayName];

    // Vérifier les exceptions
    const override = schedules.scheduleOverrides.find(
      o => o.date === dateKey && o.status === 'active'
    );

    if (override) {
      if (override.type === 'closed') return false;
      if (override.type === 'modified') {
        return checkTimeSlots(override.timeSlots, date);
      }
    }

    // Vérifier les horaires réguliers
    const regularSchedule = schedules.regularSchedules.find(
      s => s.dayOfWeek === englishDayName && s.active
    );

    return regularSchedule 
      ? checkTimeSlots(regularSchedule.timeSlots, date)
      : false;
  };

// Helper function
const checkTimeSlots = (timeSlots, date) => {
  if (!timeSlots || timeSlots.length === 0) return false;

  const currentTime = date.getHours() * 60 + date.getMinutes();
  
  return timeSlots.some(slot => {
    const [startH, startM] = slot.start.split(':').map(Number);
    const [endH, endM] = slot.end.split(':').map(Number);
    
    const startMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;
    
    return currentTime >= startMinutes && currentTime < endMinutes;
  });
};

  const renderDayView = () => {
    const day = currentDay;
    const slots = Array.from({ length: 24 * 12 }, (_, idx) => {
      const hour = Math.floor((idx * 5) / 60);
      const minute = (idx * 5) % 60;
      return { hour, minute };
    });

    return (
      <div className="flex flex-col h-full">
        <div
          className="grid sticky top-0 bg-white z-10"
          style={{ gridTemplateColumns: '60px minmax(0, 1fr)' }}
        >
          <div className="border-r" />
          <div className="text-center text-xs font-medium border-b p-1 flex items-center justify-center gap-2">
            <Button variant="ghost" size="icon" onClick={prevDay} className="p-1">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            {format(day, 'EEEE d MMMM yyyy', { locale: fr })}
            <Button variant="ghost" size="icon" onClick={nextDay} className="p-1">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto">
          <div className="grid" style={{ gridTemplateColumns: '60px minmax(0, 1fr)' }}>
            {slots.map((slot, idx) => {
              const dateLabel = setMinutes(setHours(startOfDay(new Date()), slot.hour), slot.minute);
              const labelTime = format(dateLabel, 'HH:mm');
              return (
                <React.Fragment key={idx}>
                  <div className="text-[8px] text-gray-500 border-b border-r p-1 sticky left-0 bg-white w-[60px]">
                    {labelTime}
                  </div>
                  <div
          id={slot.hour === 8 && slot.minute === 0 ? 'slot-8' : undefined}
          key={`${day.toString()}-${idx}`}
         className={`border-r h-6 min-h-[1.5rem] ${
      isWorkingTime(setMinutes(setHours(day, slot.hour), slot.minute)) 
        ? 'bg-white hover:bg-gray-200 cursor-pointer' 
        : 'bg-white pointer-events'
    }`}
          onMouseEnter={(e) => {
            const dateTime = setMinutes(setHours(day, slot.hour), slot.minute);
            setHoverTime(dateTime);
            setHoverPosition({ x: e.clientX, y: e.clientY });
          }}
          onMouseLeave={() => setHoverTime(null)}
          onClick={() => {
            const dateTime = setMinutes(setHours(day, slot.hour), slot.minute);
            alert(format(dateTime, 'dd/MM/yyyy HH:mm', { locale: fr }));
          }}
        />
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
    const days = Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i));
    const slots = Array.from({ length: 24 * 12 }, (_, idx) => {
      const hour = Math.floor((idx * 5) / 60);
      const minute = (idx * 5) % 60;
      return { hour, minute };
    });

    return (
      <div className="flex flex-col h-full">
        <div
          className="grid sticky top-0 bg-white z-10"
          style={{ gridTemplateColumns: '60px repeat(7, minmax(0, 1fr))' }}
        >
          <div className="border-r" />
          {days.map(day => (
            <div
              key={day.toString()}
              className="text-center text-xs font-bold border-b p-1"
            >
              {format(day, 'EEEE', { locale: fr })}
              <br />
              {format(day, 'd', { locale: fr })}
            </div>
          ))}
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto">
          <div className="grid" style={{ gridTemplateColumns: '60px repeat(7, minmax(0, 1fr))' }}>
            {slots.map((slot, idx) => {
              const dateLabel = setMinutes(setHours(startOfDay(new Date()), slot.hour), slot.minute);
              const labelTime = format(dateLabel, 'HH:mm');
              return (
                <React.Fragment key={idx}>
                  <div className="text-[8px] text-gray-500 border-b border-r p-1 sticky left-0 bg-white w-[60px]">
                    {labelTime}
                  </div>
                  {days.map(day => (
                            <div
                                     id={slot.hour === 8 && slot.minute === 0 ? 'slot-8' : undefined}
          key={`${day.toString()}-${idx}`}
          className={`border-r h-6 min-h-[1.5rem] ${
      isWorkingTime(setMinutes(setHours(day, slot.hour), slot.minute)) 
        ? 'bg-white hover:bg-gray-200 cursor-pointer' 
        : 'bg-white pointer-events'
    }`}      onMouseEnter={(e) => {
                              const dateTime = setMinutes(setHours(day, slot.hour), slot.minute);
                              setHoverTime(dateTime);
                              setHoverPosition({ x: e.clientX, y: e.clientY });
                            }}
                            onMouseLeave={() => setHoverTime(null)}
                            onClick={() => {
                              const dateTime = setMinutes(setHours(day, slot.hour), slot.minute);
                              alert(format(dateTime, 'dd/MM/yyyy HH:mm', { locale: fr }));
                            }}
                          />
                  ))}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderMonthView = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { locale: fr, weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { locale: fr, weekStartsOn: 1 });

    const rows = [];
    let day = startDate;

    while (day <= endDate) {
      const weekDays = [];
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const isCurrentMonth = isSameMonth(day, monthStart);
        const isToday = isSameDay(day, today);
        const isPast = startOfDay(day) < today;

        weekDays.push(
          <div
            key={cloneDay.toString()}
            className={`flex flex-col border p-1 text-xs
              ${!isCurrentMonth ? 'bg-gray-50 text-gray-400' : ''}
              ${isToday ? 'bg-blue-100' : ''}
              ${isPast ? 'opacity-50' : 'hover:bg-gray-100 cursor-pointer'}`}
            onClick={() => {
              if (isCurrentMonth && !isPast) {
                setCurrentDay(cloneDay);
                setCurrentView('day');
              }
            }}
          >
            <span className="font-medium">{format(cloneDay, 'd')}</span>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div key={day.toString()} className="grid grid-cols-7 gap-px">
          {weekDays}
        </div>
      );
    }

    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between px-4 py-2 border-b">
          <Button variant="ghost" size="icon" onClick={prevMonth}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <div className="text-sm font-semibold">
            {format(currentMonth, 'MMMM yyyy', { locale: fr })}
          </div>
          <Button variant="ghost" size="icon" onClick={nextMonth}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-1">
          <div className="grid grid-cols-7 gap-px mb-1">
            {Array.from({ length: 7 }, (_, i) => {
              const day = addDays(startDate, i);
              return (
                <div key={i} className="text-xs font-medium text-center bg-gray-100 p-1">
                  {format(day, 'EEEEEE', { locale: fr })}
                </div>
              );
            })}
          </div>
          {rows}
        </div>
      </div>
    );
  };

  const renderHeader = () => (
    <div className="flex items-center justify-between px-2 py-1">
      <Button variant="ghost" size="icon" onClick={prevMonth} className="p-1">
        <ChevronLeft className="w-4 h-4" />
      </Button>
      <div className="text-xs font-semibold">
        {format(currentMonth, 'MMMM yyyy', { locale: fr })}
      </div>
      <Button variant="ghost" size="icon" onClick={nextMonth} className="p-1">
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );

  const renderDays = () => {
    const days = [];
    let day = startOfWeek(currentMonth, { locale: fr, weekStartsOn: 1 });
    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={i} className="flex-1 text-center text-xs font-medium">
          {format(day, 'EEEEEE', { locale: fr })}
        </div>
      );
      day = addDays(day, 1);
    }
    return <div className="flex border-b px-2">{days}</div>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    let day = startOfWeek(monthStart, { locale: fr, weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { locale: fr, weekStartsOn: 1 });

    const rows = [];
    while (day <= endDate) {
      const days = [];
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const isPast = startOfDay(day) < today;
        const disabled = isPast || !isSameMonth(day, monthStart);
        days.push(
          <div
            key={day}
            className={`flex-1 h-8 flex items-center justify-center text-[10px] p-1
              ${disabled ? 'text-gray-300' : ''}
              ${isSameDay(day, today) ? 'bg-blue-100 rounded-full font-semibold text-xs' : ''}`}
            onClick={() => {
              if (!disabled) {
                setCurrentMonth(cloneDay);
                setCurrentWeekStart(
                  startOfWeek(cloneDay, { locale: fr, weekStartsOn: 1 })
                );
                setCurrentDay(cloneDay);
              }
            }}
            style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
          >
            {format(day, 'd')}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="flex" key={day}>
          {days}
        </div>
      );
    }
    return <div className="px-2 mt-1">{rows}</div>;
  };

  return (
    <div className="flex flex-col h-screen">
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
              <ChevronDown className="w-4 h-4 ml-1" />
            </Button>
          </Link>
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
            <List/>
            Tous les rendez-vous
          </Button>
        </div>
      </header>

      <div className="flex flex-1">
        <aside className="w-60 bg-gray-50 border-r text-xs py-2 flex flex-col">
          <div className="px-4 mb-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-full justify-between"
            >
              Prochaine Disponibilité <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
            {dropdownOpen && (
              <ul className="mt-1 bg-white border rounded shadow-lg">
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Option 1</li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Option 2</li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Option 3</li>
              </ul>
            )}
          </div>
          {renderHeader()}
          {renderDays()}
          {renderCells()}
        </aside>

        <main className="flex-1 h-[90vh] flex flex-col">
          {currentView === 'day' && renderDayView()}
          {currentView === 'week' && renderWeekView()}
          {currentView === 'month' && renderMonthView()}
        </main>
      </div>
{hoverTime && (
  <div
    className="fixed bg-white border rounded shadow-lg p-1 text-[8px] pointer-events-none z-50"
    style={{
      left: hoverPosition.x + 10,
      top: hoverPosition.y + 10,
    }}
  >
    {format(hoverTime, 'HH:mm', { locale: fr })}
  </div>
)}
    </div>
  );
};

export default Agendav2;