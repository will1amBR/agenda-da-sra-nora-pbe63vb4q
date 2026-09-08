/**
 * Configurações Centrais da Sra Nora
 *
 * Centralize aqui dados de identificação, recebimento via PIX e referências
 * de imagens para facilitar futuras atualizações sem espalhar strings pelo código.
 */

export const NORA_PROFILE = {
  name: 'Sra Nora',
  fullName: 'Sra Nora · Cuidadora de Idosos e Diarista',
  city: 'Paracuru',
  state: 'CE',
  fullLocation: 'Paracuru (Ceará)',
  whatsappDisplay: '(85) 99874-5520',
  whatsappRaw: '85998745520',
  pixBeneficiary: 'Nora Cuidado & Limpeza Ltda',
  pixBeneficiaryCity: 'Paracuru - CE',
}

/**
 * =========================================================================
 * 1. CONFIGURAÇÃO DA CHAVE PIX DA SRA NORA
 * =========================================================================
 * Chave oficial: Telefone celular (11) 98210-6774
 * - rawKey: valor limpo apenas com dígitos (usado na cópia e no payload EMV)
 * - formattedKey: valor formatado para exibição visual ao cliente
 * - keyType: tipo da chave (telefone)
 */
export const NORA_PIX_CONFIG = {
  keyType: 'telefone' as const,
  /** Chave PIX em formato numérico puro para copiar ou integrar (11982106774) */
  rawKey: '11982106774',
  /** Chave formatada para leitura humana no formato de telefone celular */
  formattedKey: '(11) 98210-6774',
  /** Nome do favorecido/beneficiário cadastrado no banco */
  receiver: 'Sra Nora (Nora Cuidado & Limpeza)',
  /** Cidade do titular da conta para o payload PIX */
  city: 'Paracuru - CE',
}

/**
 * =========================================================================
 * 2. FOTO DA SRA NORA (HOME / DESTAQUE HERO)
 * =========================================================================
 * COMO TROCAR A FOTO DA SRA NORA:
 * Quando receber o arquivo da nova foto:
 *  1. Coloque a imagem na pasta `public/` (ex: `public/nora-perfil.jpg`)
 *     ou em `src/assets/`.
 *  2. Altere o valor de `currentPhoto` abaixo para apontar para a nova foto
 *     (ex.: `/nora-perfil.jpg` ou URL externa se estiver hospedada).
 *  3. Caso queira voltar à imagem anterior, `fallbackPhoto` é mantida salva.
 */
// Importação direta do asset da nova foto da Sra Nora (retrato profissional)
import noraRealPhoto from '@/assets/1788844625581-26f3c.jpg'

export const NORA_HERO_IMAGE = {
  /**
   * 👉 Foto oficial e real da Sra Nora (cabelo preto longo e blazer preto).
   * Importada do asset local salvo em src/assets/.
   */
  currentPhoto: noraRealPhoto,

  /** Foto padrão / fallback de segurança */
  fallbackPhoto: 'https://img.usecurling.com/ppl/large?gender=female&seed=48',

  /** Texto alternativo descritivo da imagem para acessibilidade */
  altText: 'Sra Nora - Cuidadora de Idosos e Diarista em Paracuru (CE)',

  /** Legenda do card */
  badgeLabel: 'Sra Nora · Paracuru / CE',
  locationBadge: 'Paracuru - CE',
}
