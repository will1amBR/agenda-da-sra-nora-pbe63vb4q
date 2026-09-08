import { Service, Booking, PaymentTransaction } from '@/types'

// Catálogo de serviços com os valores e rotina reais da Sra Nora em Paracuru (Ceará)
export const SEED_SERVICES: Service[] = [
  {
    id: 'cuidado-idosos-mensal',
    name: 'Cuidado de Idosos (Plano Mensal - Quartas-feiras)',
    category: 'recorrente',
    description:
      'Atendimento semanal dedicado: toda quarta-feira do mês com acompanhamento amoroso, auxílio na medicação, alimentação balanceada, higiene e companhia afetuosa.',
    durationMinutes: 480, // 8 horas diárias
    priceType: 'monthly_fixed',
    basePrice: 500,
    badge: 'Rotina Semanal Fixa',
    highlights: [
      'Atendimento toda quarta-feira (4 a 5 quartas por mês)',
      'Pagamento mensal fixo todo dia 03',
      'Acompanhamento de rotina, remédios e bem-estar',
      'Paracuru e bairros próximos',
    ],
    icon: 'heart',
  },
  {
    id: 'cuidado-idosos-diaria',
    name: 'Cuidado de Idosos (Diária Avulsa ou Turno)',
    category: 'idosos',
    description:
      'Acompanhamento carinhoso e atencioso por turno ou diária para idosos que precisam de auxílio em dias específicos, consultas ou fins de semana.',
    durationMinutes: 360,
    priceType: 'fixed',
    basePrice: 160,
    badge: 'Acolhimento & Segurança',
    highlights: [
      'Turno de 6h a 8h de dedicação exclusiva',
      'Auxílio com alimentação e passeios suaves',
      'Experiência e paciência comprovadas com famílias locais',
      'Relatório de cuidados para a família ao final do dia',
    ],
    icon: 'heart',
  },
  {
    id: 'limpeza-casa-simples',
    name: 'Limpeza de Casa Simples',
    category: 'limpeza',
    description:
      'Limpeza caprichada para casas de pequeno a médio porte ou manutenção recorrente. O valor varia entre R$ 100 e R$ 150 conforme a frequência e o nível de sujidade.',
    durationMinutes: 240,
    priceType: 'range',
    basePrice: 120, // valor padrão de entrada
    priceRange: {
      min: 100,
      max: 150,
      note: 'R$ 100 a R$ 150 variando conforme a quantidade de vezes e a sujidade',
    },
    badge: 'Mais pedido no dia a dia',
    highlights: [
      'Varrição, aspiração e passagem de pano perfumado',
      'Banheiros higienizados e cozinha básica',
      'Tirar pó dos móveis e arrumação de camas',
      'Ideal para casas de até 2 quartos e 1 banheiro',
    ],
    icon: 'sparkles',
  },
  {
    id: 'limpeza-casa-elaborada',
    name: 'Limpeza de Casa Elaborada / Faxina Pesada',
    category: 'limpeza',
    description:
      'Faxina completa e minuciosa para casas maiores, sobrados, residências de praia, pós-visitas ou casas fechadas. De R$ 200 a R$ 250, podendo chegar a R$ 300 para áreas externas grandes.',
    durationMinutes: 480,
    priceType: 'range',
    basePrice: 250,
    priceRange: {
      min: 200,
      max: 300,
      note: 'R$ 200–250, podendo chegar a R$ 300 para residências amplas ou muito tempo fechadas',
    },
    badge: 'Capricho Máximo',
    highlights: [
      'Limpeza pesada de azulejos, vidros, portas e rodapés',
      'Higienização profunda de banheiros e cozinha com gordura',
      'Área externa, varanda litorânea e quintal inclusos',
      'Casas de praia, veraneio ou pós-reforma leve',
    ],
    icon: 'home',
  },
  {
    id: 'limpeza-manutencao-semanal',
    name: 'Limpeza Residencial Recorrente (Semanal)',
    category: 'recorrente',
    description:
      'Para quem quer a casa sempre cheirosa e arrumada toda semana em Paracuru. Pacote quinzenal ou semanal com condições especiais e agenda travada.',
    durationMinutes: 300,
    priceType: 'fixed',
    basePrice: 140,
    badge: 'Rotina Semanal',
    highlights: [
      'Dia da semana exclusivo para você',
      'Manutenção contínua de armários e geladeira',
      'Confiança total e chave com a Sra Nora',
      'Desconto para agendamentos mensais recorrentes',
    ],
    icon: 'calendar',
  },
]

// Compromisso Real e Permanente da Sra Nora: Cliente de Quarta-feira
// Esta cliente é REAL e NÃO é um exemplo fictício de demonstração.
// A agenda de quarta-feira está permanentemente travada para ela.
export const REAL_WEDNESDAY_CLIENT: Booking = {
  id: 'fixo-quarta-real',
  code: 'FIXO-QUARTAS-NORA',
  serviceId: 'cuidado-idosos-mensal',
  client: {
    name: 'Cliente Fixa de Quarta-feira (Paracuru)',
    phone: '(85) 99874-5520',
    email: 'atendimento.fixo@agendanora.com.br',
    address: 'Centro, Paracuru - CE',
    neighborhood: 'Centro, Paracuru',
  },
  date: '2025-05-14', // Referência de quarta-feira recorrente
  time: '08:00',
  notes:
    'Compromisso fixo e recorrente: atendimento toda quarta-feira do mês. Plano de R$ 500/mês com pagamento todo dia 03 via PIX. Agenda travada permanentemente.',
  frequency: 'weekly',
  createdAt: '2024-01-01T08:00:00Z',
  updatedAt: new Date().toISOString(),
  status: 'confirmado',
  originalPrice: 500,
  agreedPrice: 500,
  paymentMethod: 'pix',
  isRecurringFixed: true,
}

// Exemplos de demonstração neutros (apenas limpeza/avulso, sem misturar a cliente de quarta que é real)
export const SEED_BOOKINGS: Booking[] = [
  {
    id: 'b-002',
    code: 'NORA-2025-018',
    serviceId: 'limpeza-casa-elaborada',
    client: {
      name: 'Dr. Roberto Meireles',
      phone: '(85) 99123-8877',
      email: 'roberto.ce@email.com',
      address: 'Av. Beira-Mar, casa 88',
      neighborhood: 'Praia da Pedra Rachada, Paracuru',
    },
    date: '2025-05-16', // Sexta-feira
    time: '07:30',
    notes: 'Casa de veraneio fechada há 2 meses. Quintal grande e varanda com maresia.',
    frequency: 'once',
    createdAt: '2025-05-10T14:20:00Z',
    updatedAt: '2025-05-10T14:20:00Z',
    status: 'aguardando_aprovacao',
    originalPrice: 250,
    agreedPrice: 250,
  },
  {
    id: 'b-003',
    code: 'NORA-2025-019',
    serviceId: 'limpeza-casa-elaborada',
    client: {
      name: 'Fernanda Albuquerque',
      phone: '(85) 99444-2211',
      email: 'fernanda.albu@gmail.com',
      address: 'Rua dos Coqueiros, 205',
      neighborhood: 'Ronco do Mar, Paracuru',
    },
    date: '2025-05-19', // Segunda-feira
    time: '08:00',
    notes: 'Casa duplex com 4 quartos e churrasqueira.',
    frequency: 'once',
    createdAt: '2025-05-11T11:00:00Z',
    updatedAt: '2025-05-11T15:30:00Z',
    status: 'negociacao_pendente',
    originalPrice: 250,
    proposedPrice: 290,
    priceReason: 'Casa duplex com 4 suítes e área gourmet externa com gordura da churrasqueira.',
    agreedPrice: 290,
  },
  {
    id: 'b-004',
    code: 'NORA-2025-020',
    serviceId: 'limpeza-casa-simples',
    client: {
      name: 'Carlos Eduardo Farias',
      phone: '(85) 98822-7766',
      email: 'carlos.farias@outlook.com',
      address: 'Rua Antônio Cordeiro, 50',
      neighborhood: 'Boca do Poço, Paracuru',
    },
    date: '2025-05-20', // Terça-feira
    time: '13:30',
    notes: 'Apartamento pequeno térreo, apenas manutenção e pó.',
    frequency: 'once',
    createdAt: '2025-05-11T18:00:00Z',
    updatedAt: '2025-05-12T08:00:00Z',
    status: 'aguardando_pagamento',
    originalPrice: 120,
    agreedPrice: 120,
  },
  {
    id: 'b-005',
    code: 'NORA-2025-022',
    serviceId: 'limpeza-manutencao-semanal',
    client: {
      name: 'Mariana Duarte',
      phone: '(85) 99711-3344',
      email: 'mariana.duarte@email.com',
      address: 'Rua das Flores, 72',
      neighborhood: 'Centro, Paracuru',
    },
    date: '2025-05-22', // Quinta-feira
    time: '08:00',
    notes: 'Manutenção semanal regular de casa com 2 quartos.',
    frequency: 'weekly',
    createdAt: '2025-05-12T10:00:00Z',
    updatedAt: '2025-05-12T14:30:00Z',
    status: 'confirmado',
    originalPrice: 140,
    agreedPrice: 140,
    paymentMethod: 'pix',
    paidAt: '2025-05-12T14:30:00Z',
  },
]

export const SEED_PAYMENTS: PaymentTransaction[] = [
  {
    id: 'pay-002',
    bookingId: 'b-005',
    bookingCode: 'NORA-2025-022',
    clientName: 'Mariana Duarte',
    amount: 140,
    method: 'pix',
    status: 'approved',
    createdAt: '2025-05-12T14:30:00Z',
    testMode: true,
  },
]

const STORAGE_KEYS = {
  SERVICES: 'nora_services_v1',
  BOOKINGS: 'nora_bookings_v1',
  PAYMENTS: 'nora_payments_v1',
}

// Inicializa o localStorage caso não existam dados
export function initStorage() {
  if (typeof window === 'undefined') return

  if (!localStorage.getItem(STORAGE_KEYS.SERVICES)) {
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(SEED_SERVICES))
  }
  if (!localStorage.getItem(STORAGE_KEYS.BOOKINGS)) {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(SEED_BOOKINGS))
  }
  if (!localStorage.getItem(STORAGE_KEYS.PAYMENTS)) {
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(SEED_PAYMENTS))
  }
}

// Serviços
export function getServices(): Service[] {
  initStorage()
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SERVICES)
    return raw ? JSON.parse(raw) : SEED_SERVICES
  } catch {
    return SEED_SERVICES
  }
}

export function getServiceById(id: string): Service | undefined {
  const services = getServices()
  return services.find((s) => s.id === id)
}

export function saveServices(services: Service[]) {
  localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services))
}

// Agendamentos
export function getBookings(): Booking[] {
  initStorage()
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BOOKINGS)
    let list: Booking[] = raw ? JSON.parse(raw) : SEED_BOOKINGS
    // Migra: remove ocorrências antigas da senhora como demo b-001 (caso ainda no storage)
    list = list.filter((b) => b.id !== 'b-001')
    // Assegura que o compromisso fixo real esteja sempre presente e preservado
    const hasFixed = list.some((b) => b.id === REAL_WEDNESDAY_CLIENT.id || b.isRecurringFixed)
    if (!hasFixed) {
      list = [REAL_WEDNESDAY_CLIENT, ...list]
    }
    return list
  } catch {
    return [REAL_WEDNESDAY_CLIENT, ...SEED_BOOKINGS]
  }
}

/** Retorna especificamente o compromisso fixo real da quarta-feira */
export function getRecurringFixedBooking(): Booking {
  const bookings = getBookings()
  return (
    bookings.find((b) => b.isRecurringFixed || b.id === REAL_WEDNESDAY_CLIENT.id) ||
    REAL_WEDNESDAY_CLIENT
  )
}

export function getBookingById(id: string): Booking | undefined {
  const bookings = getBookings()
  return bookings.find((b) => b.id === id)
}

export function getBookingByCode(code: string): Booking | undefined {
  const clean = code.trim().toUpperCase()
  const bookings = getBookings()
  return bookings.find(
    (b) =>
      b.code.toUpperCase() === clean ||
      b.code.replace(/[^a-zA-Z0-9]/g, '') === clean.replace(/[^a-zA-Z0-9]/g, ''),
  )
}

export function getBookingsByPhone(phone: string): Booking[] {
  const clean = phone.replace(/\D/g, '')
  if (clean.length < 4) return []
  const bookings = getBookings()
  return bookings.filter((b) => b.client.phone.replace(/\D/g, '').includes(clean))
}

export function saveBookings(bookings: Booking[]) {
  localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings))
  window.dispatchEvent(new Event('nora_storage_change'))
}

export function createBooking(data: {
  serviceId: string
  client: Booking['client']
  date: string
  time: string
  notes?: string
  frequency?: Booking['frequency']
  fixedPrice: number
}): Booking {
  const bookings = getBookings()
  const year = new Date().getFullYear()
  const nextNum = String(bookings.length + 1).padStart(3, '0')
  const code = `NORA-${year}-${nextNum}`

  const newBooking: Booking = {
    id: 'b-' + Math.random().toString(36).substring(2, 9),
    code,
    serviceId: data.serviceId,
    client: data.client,
    date: data.date,
    time: data.time,
    notes: data.notes,
    frequency: data.frequency || 'once',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'aguardando_aprovacao',
    originalPrice: data.fixedPrice,
    agreedPrice: data.fixedPrice,
  }

  const updated = [newBooking, ...bookings]
  saveBookings(updated)
  return newBooking
}

export function updateBooking(id: string, partial: Partial<Booking>): Booking | undefined {
  const bookings = getBookings()
  const idx = bookings.findIndex((b) => b.id === id)
  if (idx === -1) return undefined

  const updated: Booking = {
    ...bookings[idx],
    ...partial,
    updatedAt: new Date().toISOString(),
  }

  bookings[idx] = updated
  saveBookings(bookings)
  return updated
}

// Ações da Sra Nora na solicitação
export function approveBookingFixedPrice(id: string): Booking | undefined {
  const booking = getBookingById(id)
  if (!booking) return undefined

  return updateBooking(id, {
    status: 'aguardando_pagamento',
    agreedPrice: booking.originalPrice,
    proposedPrice: undefined,
    priceReason: undefined,
  })
}

export function proposeNewPrice(
  id: string,
  proposedPrice: number,
  reason: string,
): Booking | undefined {
  return updateBooking(id, {
    status: 'negociacao_pendente',
    proposedPrice,
    priceReason: reason,
  })
}

export function rejectBooking(id: string, reason?: string): Booking | undefined {
  return updateBooking(id, {
    status: 'recusado',
    rejectionReason: reason || 'Horário indisponível ou fora da área de atendimento.',
  })
}

// Ações do cliente na negociação
export function clientAcceptNegotiatedPrice(id: string): Booking | undefined {
  const booking = getBookingById(id)
  if (!booking || !booking.proposedPrice) return undefined

  return updateBooking(id, {
    status: 'aguardando_pagamento',
    agreedPrice: booking.proposedPrice,
  })
}

export function clientDeclineNegotiatedPrice(id: string): Booking | undefined {
  return updateBooking(id, {
    status: 'cancelado',
  })
}

// Transações de Pagamento
export function getPayments(): PaymentTransaction[] {
  initStorage()
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PAYMENTS)
    return raw ? JSON.parse(raw) : SEED_PAYMENTS
  } catch {
    return SEED_PAYMENTS
  }
}

export function savePayments(payments: PaymentTransaction[]) {
  localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(payments))
  window.dispatchEvent(new Event('nora_storage_change'))
}

export function recordPayment(
  payment: Omit<PaymentTransaction, 'id' | 'createdAt' | 'testMode'>,
): PaymentTransaction {
  const payments = getPayments()
  const newTx: PaymentTransaction = {
    ...payment,
    id: 'pay-' + Math.random().toString(36).substring(2, 9),
    createdAt: new Date().toISOString(),
    testMode: true,
  }

  savePayments([newTx, ...payments])

  // Atualiza status do agendamento para CONFIRMADO se pagamento aprovado
  if (payment.status === 'approved') {
    updateBooking(payment.bookingId, {
      status: 'confirmado',
      paymentId: newTx.id,
      paymentMethod: payment.method,
      paidAt: newTx.createdAt,
    })
  }

  return newTx
}

// Gestão de Lembretes do WhatsApp
export function markReminderSent(
  bookingId: string,
  type: 'compromisso' | 'pagamento',
): Booking | undefined {
  const bookings = getBookings()
  const idx = bookings.findIndex((b) => b.id === bookingId)
  if (idx === -1) return undefined

  const current = bookings[idx]
  const sentList = current.remindersSent || []
  const updatedSent = [
    ...sentList.filter((r) => r.type !== type),
    {
      type,
      sentAt: new Date().toISOString(),
      channel: 'whatsapp' as const,
    },
  ]

  const updated: Booking = {
    ...current,
    remindersSent: updatedSent,
    updatedAt: new Date().toISOString(),
  }

  bookings[idx] = updated
  saveBookings(bookings)
  return updated
}

export function resetDemoData() {
  localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(SEED_SERVICES))
  localStorage.setItem(
    STORAGE_KEYS.BOOKINGS,
    JSON.stringify([REAL_WEDNESDAY_CLIENT, ...SEED_BOOKINGS]),
  )
  localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(SEED_PAYMENTS))
  window.dispatchEvent(new Event('nora_storage_change'))
}
