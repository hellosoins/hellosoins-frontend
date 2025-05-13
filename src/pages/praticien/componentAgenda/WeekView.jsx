import React, { useState, useRef, useEffect } from 'react';
import { format, addDays, setMinutes, setHours, startOfDay } from 'date-fns';
import { fr } from 'date-fns/locale';

export const WeekView = ({ 
  currentWeekStart, 
  isWorkingTime,
  setHoverTime,
  setHoverPosition,
  scrollRef
}) => {
  const days = Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i));
  const slots = Array.from({ length: 24 * 12 }, (_, idx) => ({
    hour: Math.floor((idx * 5) / 60),
    minute: (idx * 5) % 60
  }));

  // Scroll to 8:00 by default on mount
  useEffect(() => {
    if (scrollRef.current) {
      // Find the slot for 08:00
      const index08 = slots.findIndex(s => s.hour === 8 && s.minute === 0);
      // Height per slot: matches h-3 (0.75rem) in Tailwind (0.75 * 16px = 12px)
      const slotHeight = 12;
      scrollRef.current.scrollTop = index08 * slotHeight;
    }
  }, [scrollRef, slots]);

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
            const isLabel = slot.minute % 15 === 0;
            
            return (
              <React.Fragment key={idx}>
                <div className={`text-[8px] text-gray-500 px-2 border-r ${isLabel ? 'border-b' : ''} sticky left-0 bg-white w-[60px]`}>
                  {isLabel ? labelTime : ''}
                </div>
                {days.map(day => {
                  const dateTime = setMinutes(setHours(day, slot.hour), slot.minute);
                  return (
                    <div
                      key={`${day.toString()}-${idx}`}
                      className={`border-r h-3 min-h-[0.75rem] ${
                        isWorkingTime(dateTime) 
                          ? 'bg-white hover:bg-gray-200 cursor-pointer' 
                          : 'bg-white pointer-events'
                      }`}
                      onMouseEnter={(e) => {
                        setHoverTime(dateTime);
                        setHoverPosition({ x: e.clientX, y: e.clientY });
                      }}
                      onMouseLeave={() => setHoverTime(null)}
                      onClick={() => alert(format(dateTime, 'dd/MM/yyyy HH:mm', { locale: fr }))}
                    />
                  );
                })}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};