import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay,
  addDays
} from 'date-fns';
import { fr } from 'date-fns/locale';

export const MonthView = ({ currentMonth, today, setCurrentDay, setCurrentView }) => {
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
      const isPast = cloneDay < today;

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
        <div className="text-sm font-semibold">
          {format(currentMonth, 'MMMM yyyy', { locale: fr })}
        </div>
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