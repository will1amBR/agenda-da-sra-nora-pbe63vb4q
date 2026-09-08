import React, { useState } from 'react'
import { MapPin } from 'lucide-react'
import { NORA_HERO_IMAGE } from '@/lib/noraConfig'

/**
 * =========================================================================
 * COMPONENTE: NoraHeroPhoto
 * =========================================================================
 * Ponto ÚNICO de controle da foto da Sra Nora exibida na Home.
 *
 * Configurada em `src/lib/noraConfig.ts` com fallback automático de segurança.
 */
interface NoraHeroPhotoProps {
  className?: string
}

export default function NoraHeroPhoto({ className = '' }: NoraHeroPhotoProps) {
  const [imgSrc, setImgSrc] = useState<string>(NORA_HERO_IMAGE.currentPhoto)
  const [hasError, setHasError] = useState(false)

  const handleError = () => {
    // Se a foto configurada falhar, usa a foto padrão de fallback
    if (!hasError && imgSrc !== NORA_HERO_IMAGE.fallbackPhoto) {
      setHasError(true)
      setImgSrc(NORA_HERO_IMAGE.fallbackPhoto)
    }
  }

  return (
    <div
      className={`relative rounded-3xl overflow-hidden aspect-[4/5] sm:aspect-[3/4] bg-gradient-to-b from-teal-50 to-slate-200 shadow-xl border border-teal-100/80 group ${className}`}
    >
      <img
        src={imgSrc}
        alt={NORA_HERO_IMAGE.altText}
        onError={handleError}
        className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
        loading="eager"
      />

      {/* Gradiente sutil inferior para garantir leitura perfeita da legenda */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-950/80 via-slate-950/40 to-transparent pointer-events-none" />

      {/* Badge flutuante topo: Confiança & Disponibilidade */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
        <span className="inline-flex items-center gap-1.5 bg-white/95 backdrop-blur-md text-teal-900 px-3 py-1 rounded-full text-[11px] font-bold shadow-md border border-white/60">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Agenda Aberta · Paracuru
        </span>
        <span className="bg-slate-900/80 backdrop-blur-md text-amber-300 px-2.5 py-1 rounded-full text-[10px] font-semibold flex items-center gap-1 shadow-md">
          <MapPin className="w-3 h-3" /> CE
        </span>
      </div>

      {/* Legenda inferior elegante com identificação da Sra Nora */}
      <div className="absolute bottom-3 left-3 right-3 bg-slate-900/90 backdrop-blur-md text-white p-3.5 rounded-2xl text-xs flex flex-col gap-1 border border-white/10 shadow-lg pointer-events-none">
        <div className="flex items-center justify-between">
          <span className="font-bold text-sm text-white tracking-tight">Sra Nora</span>
          <span className="text-[10px] font-semibold text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
            Profissional Verificada
          </span>
        </div>
        <p className="text-[11px] text-slate-300 font-normal leading-snug">
          Cuidadora de Idosos &amp; Diarista Profissional em Paracuru
        </p>
      </div>
    </div>
  )
}
