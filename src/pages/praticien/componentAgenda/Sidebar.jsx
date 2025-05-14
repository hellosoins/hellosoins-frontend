import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay,
  addDays,
  subDays,
  addMonths,
  subMonths
} from 'date-fns';
import { fr } from 'date-fns/locale';

export const Sidebar = ({ 
  dropdownOpen, 
  setDropdownOpen,
  currentMonth,
  setCurrentMonth,
  today,
  setCurrentDay,
  setCurrentWeekStart
}) => {
  const renderHeader = () => (
    <div className="flex items-center justify-between px-2 py-1">
      <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-1">
        <ChevronLeft className="w-4 h-4" />
      </Button>
      <div className="text-xs font-semibold">
        {format(currentMonth, 'MMMM yyyy', { locale: fr })}
      </div>
      <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-1">
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );

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
        const isPast = cloneDay < today;
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
                setCurrentWeekStart(startOfWeek(cloneDay, { locale: fr, weekStartsOn: 1 }));
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
      rows.push(<div className="flex" key={day}>{days}</div>);
    }
    return <div className="px-2 mt-1">{rows}</div>;
  };

  return (
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
      <div className="flex border-b px-2">
        {Array.from({ length: 7 }, (_, i) => {
          const day = addDays(startOfWeek(currentMonth, { locale: fr, weekStartsOn: 1 }), i);
          return (
            <div key={i} className="flex-1 text-center text-xs font-medium">
              {format(day, 'EEEEEE', { locale: fr })}
            </div>
          );
        })}
      </div>
      {renderCells()}
    </aside>
  );
};