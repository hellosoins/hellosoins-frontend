import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export const HoverTooltip = ({ hoverTime, hoverPosition }) => (
  hoverTime && (
    <div
      className="fixed bg-white border rounded shadow-lg p-1 text-[8px] pointer-events-none z-50"
      style={{
        left: hoverPosition.x + 10,
        top: hoverPosition.y + 10,
      }}
    >
      {format(hoverTime, 'HH:mm', { locale: fr })}
    </div>
  )
);