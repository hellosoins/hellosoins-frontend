import React from 'react'
import HS1 from '@/assets/o.svg?react'
import HS2 from '@/assets/HS_2.svg?react'

export const Loader = () => {
  return (
    <div className="relative w-[189px] h-[182px] flex items-center justify-center">
      {/* HS1 - centre statique */}
      <div className="absolute inset-0 flex items-center justify-center scale-[0.25] z-10">
        <HS1 className="w-full h-full" />
      </div>

      {/* HS2 - orbite verrouillée gravitationnellement */}
      <div className="absolute w-full h-full flex items-center justify-center animate-orbit-adjusted">
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="scale-[0.25]">
            <HS2 className="w-full h-full animate-counterorbit-adjusted" />
          </div>
        </div>
      </div>
    </div>
  )
}