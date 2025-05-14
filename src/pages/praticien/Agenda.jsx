import React, { useState, useRef, useEffect } from 'react';
import { Header } from './componentAgenda/Header';
import { Sidebar } from './componentAgenda/Sidebar';
import { MonthView } from './componentAgenda/MonthView';
import { WeekView } from './componentAgenda/WeekView';
import { DayView } from './componentAgenda/DayView';
import { HoverTooltip } from './componentAgenda/HoverTooltip';
import { scheduleData } from './componentAgenda/scheduleConfig';
import { 
  startOfDay, 
  addMonths, 
  subMonths, 
  startOfWeek, 
  addDays, 
  subDays, 
  setHours, 
  setMinutes,
  format
} from 'date-fns';
import fr from 'date-fns/locale/fr';

const Agendav2 = () => {
  const today = startOfDay(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(today, { locale: fr, weekStartsOn: 1 }));
  const [currentDay, setCurrentDay] = useState(today);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [currentView, setCurrentView] = useState('week');
  const [hoverTime, setHoverTime] = useState(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const [schedules] = useState(scheduleData);
  const scrollRef = useRef(null);

  useEffect(() => {
    const el8 = document.getElementById('slot-8');
    if (el8 && scrollRef.current) {
      el8.scrollIntoView({ behavior: 'auto', block: 'start' });
    }
  }, [currentWeekStart, currentDay]);

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

  const isWorkingTime = (date) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    const dayName = format(date, 'EEEE', { locale: fr }).toLowerCase();
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

    const override = schedules.scheduleOverrides.find(
      o => o.date === dateKey && o.status === 'active'
    );

    if (override) {
      if (override.type === 'closed') return false;
      if (override.type === 'modified') return checkTimeSlots(override.timeSlots, date);
    }

    const regularSchedule = schedules.regularSchedules.find(
      s => s.dayOfWeek === englishDayName && s.active
    );

    return regularSchedule ? checkTimeSlots(regularSchedule.timeSlots, date) : false;
  };

  return (
    <div className="flex flex-col h-screen">
      <Header currentView={currentView} setCurrentView={setCurrentView} />
      <div className="flex flex-1">
        <Sidebar 
          dropdownOpen={dropdownOpen}
          setDropdownOpen={setDropdownOpen}
          currentMonth={currentMonth}
          setCurrentMonth={setCurrentMonth}
          today={today}
          setCurrentDay={setCurrentDay}
          setCurrentWeekStart={setCurrentWeekStart}
        />
        <main className="flex-1 h-[90vh] flex flex-col">
          {currentView === 'day' && (
            <DayView
              currentDay={currentDay}
              isWorkingTime={isWorkingTime}
              setHoverTime={setHoverTime}
              setHoverPosition={setHoverPosition}
              scrollRef={scrollRef}
            />
          )}
          {currentView === 'week' && (
            <WeekView
              currentWeekStart={currentWeekStart}
              isWorkingTime={isWorkingTime}
              setHoverTime={setHoverTime}
              setHoverPosition={setHoverPosition}
              scrollRef={scrollRef}
            />
          )}
          {currentView === 'month' && (
            <MonthView
              currentMonth={currentMonth}
              today={today}
              setCurrentDay={setCurrentDay}
              setCurrentView={setCurrentView}
            />
          )}
        </main>
      </div>
      <HoverTooltip hoverTime={hoverTime} hoverPosition={hoverPosition} />
    </div>
  );
};

export default Agendav2;