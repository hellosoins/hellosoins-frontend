import React, { useState, useRef, useEffect } from 'react';
import { format, addDays, setMinutes, setHours, startOfDay } from 'date-fns';
import { fr } from 'date-fns/locale';

export const DayView = ({ 
  currentDay, 
  isWorkingTime, 
  setHoverTime, 
  setHoverPosition, 
  scrollRef 
}) => {
  const slots = Array.from({ length: 24 * 12 }, (_, idx) => ({
    hour: Math.floor((idx * 5) / 60),
    minute: (idx * 5) % 60
  }));

  // Scroll to 8:00 by default on mount
  useEffect(() => {
    if (scrollRef.current) {
      const index08 = slots.findIndex(s => s.hour === 8 && s.minute === 0);
      // Height per slot: h-3 (0.75rem) equals 12px
      const slotHeight = 12;
      scrollRef.current.scrollTop = index08 * slotHeight;
    }
  }, [scrollRef, slots]);

  return (
    <div className="flex flex-col h-full">
      <div className="grid sticky top-0 bg-white z-10" style={{ gridTemplateColumns: '60px minmax(0, 1fr)' }}>
        <div className="border-r" />
        <div className="text-center text-xs font-bold border-b px-1 py-3  flex items-center justify-center gap-2">
          {format(currentDay, 'EEEE d MMMM yyyy', { locale: fr })}
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div className="grid" style={{ gridTemplateColumns: '60px minmax(0, 1fr)' }}>
          {slots.map((slot, idx) => {
            const dateLabel = setMinutes(setHours(startOfDay(new Date()), slot.hour), slot.minute);
            const labelTime = format(dateLabel, 'HH:mm');
            const isLabel = slot.minute % 15 === 0;
            const dateTime = setMinutes(setHours(currentDay, slot.hour), slot.minute);

            return (
              <React.Fragment key={idx}>
                <div className={`text-[8px] text-gray-500 ${isLabel ? 'border-b' : ''} border-r px-1 sticky left-0 bg-white w-[60px]`}>
                  {isLabel ? labelTime : ''}
                </div>
                <div
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
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};
