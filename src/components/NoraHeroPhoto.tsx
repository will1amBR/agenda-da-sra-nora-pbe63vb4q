import React, { useState } from 'react'
import { MapPin } from 'lucide-react'
import { NORA_HERO_IMAGE } from '@/lib/noraConfig'

/**
 * =========================================================================
 * COMPONENTE: NoraHeroPhoto
 * =========================================================================
 * Ponto ÚNICO de controle da foto da Sra Nora exibida na Home.
 *
 * COMO TROCAR A FOTO:
 * 1. O caminho da imagem está centralizado em `src/lib/noraConfig.ts` na
 *    constante `NORA_HERO_IMAGE.currentPhoto`.
 * 2. Quando receber a nova foto da Sra Nora:
 *      a) Coloque o arquivo de imagem em `public/` (ex: `public/nora-oficial.jpg`)
 *      b) Ou em `src/assets/nora.jpg`
 *      c) Em `src/lib/noraConfig.ts`, troque o valor de `currentPhoto` para '/nora-oficial.jpg'
 * 3. Se a imagem falhar ao carregar no navegador do usuário, este componente
 *    reverte automaticamente para o `fallbackPhoto` configurado, sem quebrar o layout.
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
      className={`relative rounded-2xl overflow-hidden aspect-[4/3] bg-gradient-to-br from-[#EADFD5] to-[#D5C2B4] flex items-center justify-center ${className}`}
    >
      <img
        src={imgSrc}
        alt={NORA_HERO_IMAGE.altText}
        onError={handleError}
        className="w-full h-full object-cover"
        loading="eager"
      />
      <div className="absolute bottom-3 left-3 right-3 bg-slate-900/85 backdrop-blur-sm text-white px-3 py-2 rounded-xl text-xs flex items-center justify-between pointer-events-none">
        <span className="font-medium">{NORA_HERO_IMAGE.badgeLabel}</span>
        <span className="flex items-center gap-1 text-amber-300">
          <MapPin className="w-3 h-3" /> {NORA_HERO_IMAGE.locationBadge}
        </span>
      </div>
    </div>
  )
}
