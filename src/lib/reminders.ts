import { Booking, ReminderItem } from '@/types'
import { getBookings, getServices } from './data'
import { NORA_PIX_CONFIG, NORA_PROFILE } from './noraConfig'

/**
 * Limpa número de WhatsApp para formato internacional wa.me (DDI 55 se brasileiro)
 */
export function formatPhoneForWhatsApp(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (!digits) return ''
  // Se tem 10 ou 11 dígitos (DDD + número), prefixa com 55 (Brasil)
  if (digits.length === 10 || digits.length === 11) {
    return `55${digits}`
  }
  // Se já tem 55 e 12-13 dígitos, mantém
  if (digits.startsWith('55') && digits.length >= 12) {
    return digits
  }
  return digits
}

/**
 * Cria a URL do WhatsApp Web / deep link wa.me
 */
export function buildWhatsAppLink(phone: string, text: string): string {
  const cleanPhone = formatPhoneForWhatsApp(phone)
  const encodedText = encodeURIComponent(text)
  return `https://wa.me/${cleanPhone}?text=${encodedText}`
}

/**
 * Gera mensagem cordial e profissional de lembrete de compromisso (visita/atendimento)
 */
export function generateAppointmentReminderMessage(params: {
  clientName: string
  serviceName: string
  date: string // YYYY-MM-DD
  time: string
  address?: string
}): string {
  const { clientName, serviceName, date, time, address } = params

  let dateFormatted = date
  try {
    const [yyyy, mm, dd] = date.split('-').map(Number)
    const d = new Date(yyyy, mm - 1, dd, 12, 0, 0)
    dateFormatted = d.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    })
  } catch {
    dateFormatted = date
  }

  const firstName = clientName.split(' ')[0] || clientName

  const lines = [
    `Olá, ${firstName}! Tudo bem? Aqui é a ${NORA_PROFILE.name} passando para confirmar o nosso atendimento. 🌸`,
    '',
    `📌 *Serviço:* ${serviceName}`,
    `🗓 *Data:* ${dateFormatted}`,
    `⏰ *Horário:* às ${time}`,
    address ? `📍 *Local:* ${address}` : '',
    '',
    'Já estou organizando tudo para deixar tudo no maior capricho e cuidado. Caso precise de qualquer ajuste, é só me avisar por aqui.',
    '',
    'Até logo e tenha um abençoado dia! ✨',
    `_— ${NORA_PROFILE.name} · Paracuru/CE_`,
  ].filter(Boolean)

  return lines.join('\n')
}

/**
 * Gera mensagem cordial de lembrete de pagamento / vencimento (especialmente dia 03 do plano mensal ou reservas confirmadas)
 */
export function generatePaymentReminderMessage(params: {
  clientName: string
  serviceName: string
  amount: number
  dueDate: string // YYYY-MM-DD ou dia do mês
  bookingCode?: string
  isMonthlyPlan?: boolean
}): string {
  const { clientName, serviceName, amount, dueDate, bookingCode, isMonthlyPlan } = params
  const firstName = clientName.split(' ')[0] || clientName

  const formattedAmount = amount.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })

  let dueDescription = dueDate
  if (isMonthlyPlan) {
    dueDescription = 'todo dia 03 do mês'
  } else {
    try {
      const [yyyy, mm, dd] = dueDate.split('-').map(Number)
      const d = new Date(yyyy, mm - 1, dd, 12, 0, 0)
      dueDescription = d.toLocaleDateString('pt-BR', {
        day: 'numeric',
        month: 'long',
      })
    } catch {
      dueDescription = dueDate
    }
  }

  const lines = [
    `Olá, ${firstName}! Espero que você esteja tendo um ótimo dia. Aqui é a ${NORA_PROFILE.name}. 🌺`,
    '',
    isMonthlyPlan
      ? `Passando com carinho para lembrar sobre o vencimento do *Plano Mensal de Cuidados (Quartas-feiras)*:`
      : `Passando para enviar o lembrete de pagamento referente ao atendimento agendado:`,
    '',
    `📌 *Serviço:* ${serviceName}`,
    bookingCode ? `🏷 *Código:* #${bookingCode}` : '',
    `💰 *Valor:* ${formattedAmount}`,
    `🗓 *Vencimento:* ${dueDescription}`,
    '',
    `*Dados para pagamento via PIX:*`,
    `🔑 *Chave PIX (Telefone):* \`${NORA_PIX_CONFIG.rawKey}\` (${NORA_PIX_CONFIG.formattedKey})`,
    `👤 *Favorecido:* ${NORA_PIX_CONFIG.receiver}`,
    `🏙 *Cidade:* ${NORA_PIX_CONFIG.city}`,
    '',
    'Assim que fizer a transferência, por favor me envie o comprovante por aqui para darmos baixa com carinho.',
    '',
    'Agradeço imensamente pela confiança em meu trabalho!',
    `_— ${NORA_PROFILE.name} · Cuidado & Limpeza em Paracuru/CE_`,
  ].filter(Boolean)

  return lines.join('\n')
}

/**
 * Motor central de lembretes: varre agendamentos e gera a lista de lembretes
 * de compromisso e de pagamento com URLs prontas para WhatsApp
 */
export function computeRemindersList(): ReminderItem[] {
  const bookings = getBookings()
  const services = getServices()
  const serviceMap = new Map(services.map((s) => [s.id, s]))

  const todayStr = new Date().toISOString().slice(0, 10)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const items: ReminderItem[] = []

  for (const b of bookings) {
    const service = serviceMap.get(b.serviceId)
    const serviceName = service?.name || 'Atendimento Sra Nora'
    const isWednesdayPlan = b.serviceId === 'cuidado-idosos-mensal' || b.isRecurringFixed === true

    // 1. LEMBRETE DE COMPROMISSO
    // Elegível se confirmado ou aprovado/aguardando_aprovacao
    if (b.status === 'confirmado' || b.status === 'aguardando_pagamento') {
      const alreadySent = Boolean(b.remindersSent?.some((r) => r.type === 'compromisso'))
      const lastSentAt = b.remindersSent?.find((r) => r.type === 'compromisso')?.sentAt

      // Determina urgência
      let urgency: ReminderItem['urgency'] = 'proximos'
      try {
        const [y, m, d] = b.date.split('-').map(Number)
        const bDate = new Date(y, m - 1, d, 0, 0, 0)
        const diffDays = Math.round((bDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

        if (diffDays === 0) urgency = 'hoje'
        else if (diffDays === 1) urgency = 'amanha'
        else if (diffDays < 0)
          urgency = 'hoje' // dia do atendimento em andamento
        else urgency = 'proximos'
      } catch {
        urgency = 'proximos'
      }

      const msg = generateAppointmentReminderMessage({
        clientName: b.client.name,
        serviceName,
        date: b.date,
        time: b.time,
        address: b.client.address,
      })

      items.push({
        id: `rem-comp-${b.id}`,
        bookingId: b.id,
        bookingCode: b.code,
        clientName: b.client.name,
        clientPhone: b.client.phone,
        serviceName,
        type: 'compromisso',
        targetDate: b.date,
        time: b.time,
        address: b.client.address,
        amount: b.agreedPrice,
        alreadySent,
        lastSentAt,
        suggestedMessage: msg,
        whatsappUrl: buildWhatsAppLink(b.client.phone, msg),
        urgency,
      })
    }

    // 2. LEMBRETE DE PAGAMENTO / VENCIMENTO
    // A) Para o plano mensal (dia 03 todo mês, R$ 500)
    // B) Para reservas em 'aguardando_pagamento'
    if (isWednesdayPlan || b.status === 'aguardando_pagamento') {
      const alreadySent = Boolean(b.remindersSent?.some((r) => r.type === 'pagamento'))
      const lastSentAt = b.remindersSent?.find((r) => r.type === 'pagamento')?.sentAt

      let targetDueDate = b.date
      let urgency: ReminderItem['urgency'] = 'vencendo'

      if (isWednesdayPlan) {
        // Vencimento dia 03 do mês atual
        const now = new Date()
        const currentMonth = now.getMonth() + 1
        const currentYear = now.getFullYear()
        targetDueDate = `${currentYear}-${String(currentMonth).padStart(2, '0')}-03`

        const dayOfMonth = now.getDate()
        if (dayOfMonth === 3) urgency = 'hoje'
        else if (dayOfMonth === 2) urgency = 'amanha'
        else if (dayOfMonth > 3 && dayOfMonth <= 7) urgency = 'atrasado'
        else urgency = 'vencendo'
      } else {
        urgency = 'vencendo'
      }

      const msg = generatePaymentReminderMessage({
        clientName: b.client.name,
        serviceName,
        amount: b.agreedPrice,
        dueDate: isWednesdayPlan ? 'todo dia 03' : targetDueDate,
        bookingCode: b.code,
        isMonthlyPlan: isWednesdayPlan,
      })

      items.push({
        id: `rem-pag-${b.id}`,
        bookingId: b.id,
        bookingCode: b.code,
        clientName: b.client.name,
        clientPhone: b.client.phone,
        serviceName,
        type: 'pagamento',
        targetDate: targetDueDate,
        address: b.client.address,
        amount: b.agreedPrice,
        alreadySent,
        lastSentAt,
        suggestedMessage: msg,
        whatsappUrl: buildWhatsAppLink(b.client.phone, msg),
        urgency,
      })
    }
  }

  // Ordena: não enviados primeiro, por urgência (hoje, amanha, atrasado, vencendo, proximos)
  const urgencyWeight: Record<ReminderItem['urgency'], number> = {
    hoje: 1,
    amanha: 2,
    atrasado: 3,
    vencendo: 4,
    proximos: 5,
  }

  items.sort((a, b) => {
    if (a.alreadySent !== b.alreadySent) {
      return a.alreadySent ? 1 : -1
    }
    const weightA = urgencyWeight[a.urgency] || 9
    const weightB = urgencyWeight[b.urgency] || 9
    if (weightA !== weightB) return weightA - weightB
    return a.targetDate.localeCompare(b.targetDate)
  })

  return items
}
