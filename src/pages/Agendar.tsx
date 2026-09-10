import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import {
  Calendar as CalendarIcon,
  Clock,
  Sparkles,
  Heart,
  Home,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  ArrowLeft,
  Info,
  MapPin,
  FileText,
  User,
  ShieldCheck,
  CalendarCheck,
  Sun,
  Sunset,
  AlertCircle,
  HelpCircle,
  Repeat,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { getServices, createBooking, calculateServicePrice } from '@/lib/data'
import { Service, Booking } from '@/types'
import { useToast } from '@/hooks/use-toast'

// Passos do fluxo no estilo Parafuzo
const STEPS = [
  { id: 1, key: 'servico', label: 'O que precisa fazer', short: 'Serviço' },
  { id: 2, key: 'data', label: 'Quando realizar', short: 'Dia e Horário' },
  { id: 3, key: 'local', label: 'Onde e quem', short: 'Endereço e Contato' },
  { id: 4, key: 'resumo', label: 'Revisão final', short: 'Revisão' },
] as const

// Horários pré-configurados (Manhã e Tarde)
const TIME_SLOTS = [
  { id: '07:00', label: '07:00', period: 'manha', tag: 'Fresquinho' },
  { id: '07:30', label: '07:30', period: 'manha', tag: '' },
  { id: '08:00', label: '08:00', period: 'manha', tag: 'Mais pedido' },
  { id: '08:30', label: '08:30', period: 'manha', tag: '' },
  { id: '09:00', label: '09:00', period: 'manha', tag: '' },
  { id: '13:00', label: '13:00', period: 'tarde', tag: 'Turno da tarde' },
  { id: '13:30', label: '13:30', period: 'tarde', tag: '' },
  { id: '14:00', label: '14:00', period: 'tarde', tag: '' },
]

// Opções rápidas para preencher o campo "o que precisa fazer"
const QUICK_NEEDS_LIMPEZA = [
  'Casa fechada há semanas (precisa tirar poeira geral)',
  'Foco em banheiros, cozinha e azulejos',
  'Área externa / varanda de praia com maresia',
  'Troca de roupas de cama e panos perfumados',
]

const QUICK_NEEDS_IDOSOS = [
  'Acompanhamento carinhoso e auxílio na medicação nos horários',
  'Companhia para caminhada leve e banho de sol em Paracuru',
  'Preparo e auxílio nas refeições e hidratação',
  'Conversa afetuosa, leitura e rotina tranquila',
]

export default function AgendarPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { toast } = useToast()

  const services = getServices()
  const preselectedServiceId = searchParams.get('service')

  // Passo atual
  const [currentStep, setCurrentStep] = useState<number>(1)

  // Estado do agendamento
  const defaultServiceId = useMemo(() => {
    if (preselectedServiceId && services.some((s) => s.id === preselectedServiceId)) {
      return preselectedServiceId
    }
    const nonFixed = services.find((s) => s.id !== 'cuidado-idosos-mensal')
    return nonFixed ? nonFixed.id : services[0]?.id || ''
  }, [preselectedServiceId, services])

  const [selectedServiceId, setSelectedServiceId] = useState<string>(defaultServiceId)
  const [date, setDate] = useState<string>('')
  const [time, setTime] = useState<string>('08:00')
  const [frequency, setFrequency] = useState<'once' | 'weekly' | 'biweekly' | 'monthly'>('once')

  // Campo "o que precisa fazer" / detalhes das necessidades
  const [needsDescription, setNeedsDescription] = useState<string>('')

  // Dados do cliente e endereço completo
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [cep, setCep] = useState('')
  const [street, setStreet] = useState('')
  const [number, setNumber] = useState('')
  const [complement, setComplement] = useState('') // Extensão/complemento ex: Apto 18, Casa A, Bloco B
  const [neighborhood, setNeighborhood] = useState('Centro')
  const [city, setCity] = useState('Paracuru')
  const [stateUf, setStateUf] = useState('CE')
  const [referencePoint, setReferencePoint] = useState('')

  // Nível de sujidade/complexidade da limpeza (influencia preço de limpeza simples/elaborada)
  const [dirtinessLevel, setDirtinessLevel] = useState<'normal' | 'media' | 'pesada'>('normal')

  // Estado de confirmação / sucesso
  const [createdBooking, setCreatedBooking] = useState<Booking | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Mês visível no calendário
  const today = useMemo(() => new Date(), [])
  const [calendarMonth, setCalendarMonth] = useState<Date>(() => {
    const d = new Date()
    d.setDate(1)
    return d
  })

  // Sincroniza se o param mudou
  useEffect(() => {
    if (preselectedServiceId && services.some((s) => s.id === preselectedServiceId)) {
      setSelectedServiceId(preselectedServiceId)
    }
  }, [preselectedServiceId])

  // Serviço atualmente escolhido
  const selectedService = useMemo(
    () => services.find((s) => s.id === selectedServiceId) || services[0],
    [services, selectedServiceId],
  )

  // Máscara amigável de CEP (00000-000)
  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 8)
    if (raw.length > 5) {
      setCep(`${raw.slice(0, 5)}-${raw.slice(5)}`)
    } else {
      setCep(raw)
    }
  }

  // Máscara amigável de WhatsApp/Telefone
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 11)
    if (raw.length <= 2) {
      setPhone(raw ? `(${raw}` : '')
    } else if (raw.length <= 6) {
      setPhone(`(${raw.slice(0, 2)}) ${raw.slice(2)}`)
    } else if (raw.length <= 10) {
      setPhone(`(${raw.slice(0, 2)}) ${raw.slice(2, 6)}-${raw.slice(6)}`)
    } else {
      setPhone(`(${raw.slice(0, 2)}) ${raw.slice(2, 7)}-${raw.slice(7)}`)
    }
  }

  // Endereço completo formatado
  const computedFullAddress = useMemo(() => {
    const streetPart = [street.trim(), number.trim() ? `nº ${number.trim()}` : '']
      .filter(Boolean)
      .join(', ')
    const extPart = complement.trim() ? `(${complement.trim()})` : ''
    const neighPart = neighborhood.trim() ? `- ${neighborhood.trim()}` : ''
    const cityPart = city.trim()
      ? `${city.trim()}${stateUf.trim() ? `/${stateUf.trim()}` : ''}`
      : ''
    const cepPart = cep.trim() ? `CEP: ${cep.trim()}` : ''

    return [streetPart, extPart, neighPart, cityPart, cepPart].filter(Boolean).join(' ').trim()
  }, [street, number, complement, neighborhood, city, stateUf, cep])

  // Endereço curto para prévias
  const displayAddressShort = useMemo(() => {
    if (!street.trim()) return ''
    const base = `${street.trim()}${number.trim() ? `, ${number.trim()}` : ''}`
    const ext = complement.trim() ? ` - ${complement.trim()}` : ''
    return `${base}${ext}`
  }, [street, number, complement])

  // Cálculo correto do preço centralizado conforme o serviço selecionado, frequência e nível de sujidade
  const priceCalculation = useMemo(() => {
    if (!selectedService) {
      return { price: 120, label: 'Valor Inicial', isMonthly: false, explanation: '' }
    }
    return calculateServicePrice({
      serviceId: selectedService.id,
      frequency,
      dirtinessLevel,
    })
  }, [selectedService, frequency, dirtinessLevel])

  // Data mínima: amanhã
  const minDate = useMemo(() => {
    const d = new Date()
    d.setDate(d.getDate() + 1)
    d.setHours(0, 0, 0, 0)
    return d
  }, [])

  // O plano mensal de quarta-feira já possui a agenda fixa travada para a cliente real em Paracuru
  const isWednesdayService = selectedService?.id === 'cuidado-idosos-mensal'

  // Preenche a data padrão (2 a 3 dias à frente, exceto quarta se for cuidado ou domingo)
  useEffect(() => {
    if (!date) {
      const target = new Date()
      target.setDate(target.getDate() + 2)
      // Se cair em domingo (0) ou se cair em quarta (3), avança
      while (target.getDay() === 0 || target.getDay() === 3) {
        target.setDate(target.getDate() + 1)
      }
      const yyyy = target.getFullYear()
      const mm = String(target.getMonth() + 1).padStart(2, '0')
      const dd = String(target.getDate()).padStart(2, '0')
      setDate(`${yyyy}-${mm}-${dd}`)
    }
  }, [isWednesdayService])

  // Dias do calendário para o mês corrente
  const calendarDays = useMemo(() => {
    const year = calendarMonth.getFullYear()
    const month = calendarMonth.getMonth()

    const firstDayIndex = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()

    const days: Array<{
      dateStr: string
      dayNum: number
      isCurrentMonth: boolean
      isDisabled: boolean
      isToday: boolean
      isSelected: boolean
      isWednesday: boolean
    }> = []

    // Dias do mês anterior para completar o grid
    const prevMonthDays = new Date(year, month, 0).getDate()
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const dNum = prevMonthDays - i
      days.push({
        dateStr: '',
        dayNum: dNum,
        isCurrentMonth: false,
        isDisabled: true,
        isToday: false,
        isSelected: false,
        isWednesday: false,
      })
    }

    // Dias do mês
    for (let d = 1; d <= daysInMonth; d++) {
      const curr = new Date(year, month, d)
      curr.setHours(0, 0, 0, 0)

      const yyyy = curr.getFullYear()
      const mm = String(curr.getMonth() + 1).padStart(2, '0')
      const dd = String(curr.getDate()).padStart(2, '0')
      const dateStr = `${yyyy}-${mm}-${dd}`

      const isPast = curr.getTime() < minDate.getTime()
      const isSun = curr.getDay() === 0 // Domingo bloqueado
      const isWed = curr.getDay() === 3
      const isSelected = date === dateStr

      // As quartas-feiras estão PERMANENTEMENTE OCUPADAS / TRAVADAS pela cliente fixa real da Nora!
      // Outros clientes não podem agendar nas quartas-feiras.
      const isWednesdayLocked = isWed

      days.push({
        dateStr,
        dayNum: d,
        isCurrentMonth: true,
        isDisabled: isPast || isSun || isWednesdayLocked,
        isToday:
          today.getDate() === d && today.getMonth() === month && today.getFullYear() === year,
        isSelected,
        isWednesday: isWed,
      })
    }

    return days
  }, [calendarMonth, date, minDate, isWednesdayService, today])

  const nextMonth = () => {
    setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1))
  }

  const prevMonth = () => {
    const prev = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1)
    if (prev.getFullYear() < today.getFullYear() && prev.getMonth() < today.getMonth()) return
    setCalendarMonth(prev)
  }

  // Validação por passo
  const canProceedStep1 = Boolean(selectedServiceId)
  const canProceedStep2 = Boolean(date && time)
  // Passo 3 exige nome, whatsapp, CEP válido, rua/avenida, número e bairro
  const rawCepDigits = cep.replace(/\D/g, '')
  const isCepValid = rawCepDigits.length === 8
  const canProceedStep3 = Boolean(
    name.trim() &&
    phone.trim() &&
    isCepValid &&
    street.trim() &&
    number.trim() &&
    neighborhood.trim(),
  )

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!canProceedStep1) {
        toast({
          variant: 'destructive',
          title: 'Selecione um serviço',
          description: 'Escolha qual o atendimento você precisa antes de continuar.',
        })
        return
      }
      setCurrentStep(2)
      window.scrollTo({ top: 120, behavior: 'smooth' })
    } else if (currentStep === 2) {
      if (!canProceedStep2) {
        toast({
          variant: 'destructive',
          title: 'Escolha dia e horário',
          description: 'Selecione o dia e o horário de início desejado.',
        })
        return
      }
      setCurrentStep(3)
      window.scrollTo({ top: 120, behavior: 'smooth' })
    } else if (currentStep === 3) {
      if (!canProceedStep3) {
        toast({
          variant: 'destructive',
          title: 'Endereço incompleto',
          description:
            'Por favor, preencha nome, WhatsApp, CEP (8 dígitos), Rua/Avenida, Número e Bairro.',
        })
        return
      }
      setCurrentStep(4)
      window.scrollTo({ top: 120, behavior: 'smooth' })
    }
  }

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      window.scrollTo({ top: 120, behavior: 'smooth' })
    }
  }

  const handleAddQuickNeed = (snippet: string) => {
    setNeedsDescription((prev) => {
      if (!prev) return snippet
      if (prev.includes(snippet)) return prev
      return `${prev} · ${snippet}`
    })
  }

  // Submissão final
  const handleSubmitBooking = (e?: React.FormEvent) => {
    if (e) e.preventDefault()

    if (!date) {
      toast({
        variant: 'destructive',
        title: 'Data não informada',
        description: 'Por favor, selecione um dia para o atendimento.',
      })
      setCurrentStep(2)
      return
    }

    if (
      !name.trim() ||
      !phone.trim() ||
      rawCepDigits.length !== 8 ||
      !street.trim() ||
      !number.trim() ||
      !neighborhood.trim()
    ) {
      toast({
        variant: 'destructive',
        title: 'Dados incompletos',
        description:
          'Por favor, preencha nome, WhatsApp, CEP completo (8 dígitos), Rua/Avenida, Número e Bairro.',
      })
      setCurrentStep(3)
      return
    }

    setIsSubmitting(true)

    // Detalhes extras de sujidade inseridos nas observações se for limpeza
    const dirtinessNote =
      selectedService.category === 'limpeza' && dirtinessLevel !== 'normal'
        ? `Nível de sujidade informado: ${dirtinessLevel === 'pesada' ? 'Pesada (pós-obra / praia / fechada)' : 'Média (manutenção mais profunda)'}`
        : ''

    // Agrupa observações completas
    const combinedNotes = [
      needsDescription.trim() ? `O que precisa fazer: ${needsDescription.trim()}` : '',
      dirtinessNote,
      referencePoint.trim() ? `Ponto de referência: ${referencePoint.trim()}` : '',
    ]
      .filter(Boolean)
      .join('\n')

    // Endereço completo com rua, número, extensão/complemento, bairro, cidade, CEP e referência
    const fullAddress = referencePoint.trim()
      ? `${computedFullAddress} (Ref: ${referencePoint.trim()})`
      : computedFullAddress

    // Preço calculado corretamente conforme serviço, frequência e complexidade (não R$ 500 genérico)
    const finalCalculatedPrice = priceCalculation.price

    const newBooking = createBooking({
      serviceId: selectedService.id,
      client: {
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim() || `${name.trim().toLowerCase().replace(/\s+/g, '')}@cliente.com`,
        address: fullAddress,
        neighborhood: `${neighborhood.trim()}, ${city.trim()}`,
      },
      date,
      time,
      notes: combinedNotes || undefined,
      frequency,
      fixedPrice: finalCalculatedPrice,
    })

    setIsSubmitting(false)
    setCreatedBooking(newBooking)

    toast({
      title: 'Solicitação criada no estilo Parafuzo!',
      description: `Código #${newBooking.code}. Horário bloqueado para aprovação da Nora.`,
    })
  }

  // Formatação de data legível
  const readableDate = useMemo(() => {
    if (!date) return ''
    try {
      const [yyyy, mm, dd] = date.split('-').map(Number)
      const d = new Date(yyyy, mm - 1, dd, 12, 0, 0)
      return d.toLocaleDateString('pt-BR', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
      })
    } catch {
      return date
    }
  }, [date])

  return (
    <div className="min-h-screen bg-[#F6F8F7] py-6 sm:py-10 pb-28 lg:pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {createdBooking ? (
          /* ========================================================
             TELA DE SUCESSO MODERNA (ESTILO PARAFUZO CONFIRMADO)
             ======================================================== */
          <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm text-center space-y-6 animate-in fade-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center border border-emerald-200">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-2">
              <span className="text-[11px] uppercase font-bold tracking-wider text-teal-800 bg-teal-50 border border-teal-200 px-3 py-1 rounded-full">
                Solicitação enviada com sucesso
              </span>
              <h2 className="text-3xl font-bold text-slate-900">
                Horário reservado com a Sra Nora!
              </h2>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                Seu pedido já foi para a lista de aprovação da Nora. Assim que ela conferir o que
                precisa fazer, ela aprova e o link de pagamento do MercadoPago é liberado.
              </p>
            </div>

            {/* Recibo limpo da reserva */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-left space-y-3.5 text-xs text-slate-800">
              <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                <span className="text-slate-500">Código do Agendamento:</span>
                <span className="font-mono font-bold text-sm text-teal-800">
                  #{createdBooking.code}
                </span>{' '}
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">Serviço:</span>
                <span className="font-semibold text-right">{selectedService.name}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">Data &amp; Horário:</span>
                <span className="font-semibold capitalize">
                  {readableDate} às {createdBooking.time}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">Endereço em Paracuru:</span>
                <span className="font-semibold text-right max-w-[220px] truncate">
                  {createdBooking.client.address} ({createdBooking.client.neighborhood})
                </span>
              </div>

              {createdBooking.notes && (
                <div className="pt-2 border-t border-slate-200 space-y-1">
                  <span className="text-[11px] font-semibold text-teal-800">
                    O que você pediu para fazer:
                  </span>
                  <p className="text-slate-700 italic bg-white p-2.5 rounded-lg border border-slate-200">
                    "{createdBooking.notes}"
                  </p>
                </div>
              )}

              <div className="flex justify-between items-center pt-3 border-t border-slate-200">
                <span className="text-slate-500">
                  {createdBooking.frequency === 'monthly'
                    ? 'Valor do Plano Mensal (venc. dia 03):'
                    : 'Valor da Diária / Atendimento:'}
                </span>
                <span className="font-bold text-lg text-teal-800">
                  R${' '}
                  {createdBooking.originalPrice.toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-500">Status:</span>
                <span className="inline-flex items-center gap-1.5 font-semibold text-amber-800 bg-amber-100/90 px-2.5 py-1 rounded-full text-[11px]">
                  <Clock className="w-3.5 h-3.5" /> Aguardando aprovação da Nora
                </span>
              </div>
            </div>

            {/* Aviso transparente */}
            <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-950 text-left space-y-1.5">
              <span className="font-bold flex items-center gap-1.5">
                <Info className="w-4 h-4 text-amber-600 shrink-0" /> Como funciona a aprovação:
              </span>
              <p className="text-[11px] leading-relaxed text-amber-900">
                A Nora confere a descrição do que precisa ser feito. Caso a residência tenha área
                externa grande ou sujidade mais pesada, ela pode sugerir um ajuste de valor antes de
                você pagar.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Button
                asChild
                className="bg-teal-700 hover:bg-teal-800 text-white rounded-full px-7 py-6 font-medium shadow-sm"
              >
                <Link to={`/minhas-reservas?code=${createdBooking.code}`}>
                  <span>Acompanhar Minha Reserva</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="rounded-full border-slate-300 text-slate-700 hover:bg-slate-50 py-6"
              >
                <Link to="/painel/solicitacoes">Simular Aprovação no Painel da Nora</Link>
              </Button>
            </div>
          </div>
        ) : (
          /* ========================================================
             FLUXO PRINCIPAL ESTILO PARAFUZO (LEVE, MODERNO E INTUITIVO)
             ======================================================== */
          <div className="space-y-6 sm:space-y-8 text-left">
            {/* Header com breadcrumb sutil */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-200 pb-4">
              <div>
                <Link
                  to="/"
                  className="inline-flex items-center gap-1 text-xs text-teal-800 hover:underline mb-1 font-medium"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Voltar ao início
                </Link>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                  Agendar com a Sra Nora
                </h1>
                <p className="text-xs sm:text-sm text-slate-600">
                  Atendimento transparente em <strong>Paracuru (CE)</strong> · Rápido, sem fricção e
                  com aprovação garantida
                </p>
              </div>

              {/* Tag de segurança / tranquilidade */}
              <div className="hidden sm:flex items-center gap-2 text-xs text-slate-600 bg-white px-3.5 py-1.5 rounded-full border border-slate-200 shadow-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Horário garantido e sem cobrança antecipada</span>
              </div>
            </div>

            {/* BARRA DE PROGRESSO MODERNA / STEPPER (ESTILO PARAFUZO) */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs">
              <div className="grid grid-cols-4 gap-2 sm:gap-4 relative">
                {STEPS.map((s) => {
                  const isCompleted = currentStep > s.id
                  const isCurrent = currentStep === s.id
                  const isPending = currentStep < s.id

                  return (
                    <button
                      key={s.id}
                      type="button"
                      disabled={isPending}
                      onClick={() => {
                        if (isCompleted) setCurrentStep(s.id)
                      }}
                      className={`flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-3 text-left transition-all p-1.5 rounded-xl ${
                        isCompleted ? 'cursor-pointer hover:bg-slate-50' : 'cursor-default'
                      }`}
                    >
                      {/* Círculo do passo */}
                      <div
                        className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all shrink-0 ${
                          isCompleted
                            ? 'bg-emerald-600 text-white'
                            : isCurrent
                              ? 'bg-teal-700 text-white ring-4 ring-teal-500/15 shadow-sm'
                              : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {isCompleted ? <Check className="w-4 h-4" /> : s.id}
                      </div>

                      {/* Rótulo */}
                      <div className="text-center sm:text-left min-w-0">
                        <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                          Passo {s.id}
                        </span>
                        <span
                          className={`block text-xs sm:text-sm truncate font-medium ${
                            isCurrent
                              ? 'text-teal-800 font-bold'
                              : isCompleted
                                ? 'text-slate-800'
                                : 'text-slate-500'
                          }`}
                        >
                          <span className="hidden sm:inline">{s.label}</span>
                          <span className="sm:hidden">{s.short}</span>
                        </span>
                      </div>
                    </button>
                  )
                })}
              </div>

              {/* Linha de progresso sutil */}
              <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
                <div
                  className="bg-teal-700 h-full transition-all duration-300 rounded-full"
                  style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
                />
              </div>
            </div>

            {/* CORPO: 2 COLUNAS (CONTEÚDO DO PASSO + RESUMO FLUTUANTE LATERAL) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* ÁREA PRINCIPAL DOS PASSOS */}
              <div className="lg:col-span-8 space-y-6">
                {/* ====================================================
                    PASSO 1: O QUE PRECISA FAZER (SERVIÇOS + DETALHAMENTO)
                    ==================================================== */}
                {currentStep === 1 && (
                  <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-8 animate-in fade-in duration-200">
                    <div className="space-y-1">
                      <span className="text-xs font-bold uppercase tracking-wider text-teal-800">
                        Passo 1 de 4 · Selecione o Serviço
                      </span>{' '}
                      <h2 className="text-2xl font-bold text-slate-900">
                        O que você precisa que seja feito?
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-600">
                        Selecione o tipo de atendimento e conte em poucas palavras as necessidades
                        da sua casa ou familiar.
                      </p>
                    </div>

                    {/* Grade de Cards de Serviço no estilo Parafuzo */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {services.map((srv) => {
                        const isSelected = selectedServiceId === srv.id

                        return (
                          <div
                            key={srv.id}
                            onClick={() => setSelectedServiceId(srv.id)}
                            className={`relative rounded-2xl p-5 border text-left cursor-pointer transition-all ${
                              isSelected
                                ? 'border-teal-600 bg-teal-50/20 shadow-sm ring-2 ring-teal-600/20'
                                : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                            }`}
                          >
                            {/* Checkmark no card */}
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <span
                                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                                  isSelected
                                    ? 'bg-teal-700 text-white'
                                    : 'bg-slate-100 text-slate-600'
                                }`}
                              >
                                {srv.category === 'idosos'
                                  ? 'Cuidado'
                                  : srv.category === 'limpeza'
                                    ? 'Limpeza'
                                    : 'Recorrente'}
                              </span>

                              <div
                                className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                                  isSelected
                                    ? 'bg-teal-700 border-teal-700 text-white'
                                    : 'border-slate-300 bg-white'
                                }`}
                              >
                                {isSelected && <Check className="w-3.5 h-3.5" />}
                              </div>
                            </div>

                            <h3 className="font-bold text-base text-slate-900 leading-snug">
                              {srv.name}
                            </h3>

                            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed line-clamp-2">
                              {srv.description}
                            </p>

                            {/* Preço de referência */}
                            <div className="pt-3 mt-3 border-t border-slate-100 flex items-baseline justify-between">
                              <span className="text-[11px] text-slate-500">Valor inicial:</span>
                              <div className="text-right">
                                <span className="font-bold text-base text-teal-800">
                                  R$ {srv.basePrice}
                                </span>
                                {srv.priceType === 'monthly_fixed' && (
                                  <span className="text-[11px] text-slate-500"> /mês</span>
                                )}
                                {srv.priceType === 'range' && srv.priceRange?.max && (
                                  <span className="text-[10px] text-slate-500">
                                    {' '}
                                    (a R$ {srv.priceRange.max})
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    {/* SELEÇÃO DO NÍVEL DE SUJIDADE / COMPLEXIDADE (apenas para serviços de limpeza) */}
                    {selectedService?.category === 'limpeza' && (
                      <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                              <Sparkles className="w-4 h-4 text-teal-700" />
                              <span>Nível de Sujidade ou Tamanho do Imóvel</span>
                            </Label>
                            <p className="text-[11px] text-slate-600 mt-0.5">
                              {selectedService.id === 'limpeza-casa-simples'
                                ? 'Limpeza simples varia entre R$ 100 e R$ 150 conforme a quantidade e sujidade.'
                                : 'Faxina pesada / elaborada varia entre R$ 200 e R$ 300 conforme o tamanho e esforço.'}
                            </p>
                          </div>
                          <Badge
                            variant="outline"
                            className="text-[10px] bg-white border-teal-200 text-teal-800"
                          >
                            Ajusta o valor
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                          {[
                            {
                              id: 'normal',
                              label: 'Normal / Leve',
                              desc:
                                selectedService.id === 'limpeza-casa-simples'
                                  ? 'Manutenção padrão (R$ 100–120)'
                                  : 'Casa em ordem (R$ 200–220)',
                            },
                            {
                              id: 'media',
                              label: 'Média / Moderada',
                              desc:
                                selectedService.id === 'limpeza-casa-simples'
                                  ? 'Poeira moderada, cozinha (R$ 130)'
                                  : 'Casa de praia / médio porte (R$ 250)',
                            },
                            {
                              id: 'pesada',
                              label: 'Pesada / Fechada',
                              desc:
                                selectedService.id === 'limpeza-casa-simples'
                                  ? 'Mais cômodos / areia (R$ 150)'
                                  : 'Maresia / quintal / pós-obra (R$ 300)',
                            },
                          ].map((opt) => {
                            const isChosen = dirtinessLevel === opt.id
                            return (
                              <button
                                key={opt.id}
                                type="button"
                                onClick={() => setDirtinessLevel(opt.id as any)}
                                className={`p-3 rounded-xl border text-left transition-all ${
                                  isChosen
                                    ? 'bg-teal-700 text-white border-teal-700 shadow-sm ring-2 ring-teal-600/20'
                                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
                                }`}
                              >
                                <span className="font-bold text-xs block">{opt.label}</span>
                                <span
                                  className={`text-[10px] block mt-0.5 ${
                                    isChosen ? 'text-white/80' : 'text-slate-500'
                                  }`}
                                >
                                  {opt.desc}
                                </span>
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    )}

                    {/* NOVO CAMPO: O QUE PRECISA FAZER (TEXTAREA + SUGESTÕES RÁPIDAS) */}
                    <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3.5">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <Label
                            htmlFor="needs"
                            className="font-bold text-sm text-slate-900 flex items-center gap-1.5"
                          >
                            <FileText className="w-4 h-4 text-teal-700" />
                            <span>O que precisa ser feito? (Observações e detalhes)</span>
                          </Label>
                          <p className="text-[11px] text-slate-600 mt-0.5">
                            Descreva cômodos, quintal, maresia, animais, remédios ou sujidade para a
                            Nora avaliar com exatidão.
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className="text-[10px] bg-white border-teal-200 text-teal-800 shrink-0"
                        >
                          Para a Nora avaliar
                        </Badge>
                      </div>

                      <Textarea
                        id="needs"
                        rows={3}
                        value={needsDescription}
                        onChange={(e) => setNeedsDescription(e.target.value)}
                        placeholder="Ex: Casa com 3 quartos, 2 banheiros e varanda de praia com areia. Gostaria de capricho na cozinha e azulejos..."
                        className="bg-white border-slate-200 rounded-xl text-xs sm:text-sm focus-visible:ring-teal-600"
                      />

                      {/* Chips de clique rápido para ajudar o cliente */}
                      <div className="space-y-1.5">
                        <span className="text-[11px] font-semibold text-slate-600 block">
                          Sugestões rápidas (toque para adicionar):
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {(selectedService?.category === 'idosos'
                            ? QUICK_NEEDS_IDOSOS
                            : QUICK_NEEDS_LIMPEZA
                          ).map((snippet) => (
                            <button
                              key={snippet}
                              type="button"
                              onClick={() => handleAddQuickNeed(snippet)}
                              className="text-[11px] px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-700 hover:border-teal-600 hover:text-teal-800 transition-colors text-left"
                            >
                              + {snippet}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Botão de prosseguir */}
                    <div className="pt-2 flex justify-end">
                      <Button
                        type="button"
                        onClick={handleNextStep}
                        className="bg-teal-700 hover:bg-teal-800 text-white rounded-full px-8 py-6 text-sm font-medium shadow-sm transition-transform hover:scale-[1.01]"
                      >
                        <span>Continuar para Data e Horário</span>
                        <ArrowRight className="w-4 h-4 ml-1.5" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* ====================================================
                    PASSO 2: SELEÇÃO DE DIA E HORÁRIO (CALENDÁRIO MODERNO + CHIPS)
                    ==================================================== */}
                {currentStep === 2 && (
                  <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-8 animate-in fade-in duration-200">
                    <div className="space-y-1">
                      <span className="text-xs font-bold uppercase tracking-wider text-teal-800">
                        Passo 2 de 4
                      </span>
                      <h2 className="text-2xl font-bold text-slate-900">
                        Quando você prefere o atendimento?
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-600">
                        Escolha o dia no calendário e toque no melhor horário de início para você em
                        Paracuru.
                      </p>
                    </div>

                    {/* Dica amigável informando sobre as quartas-feiras travadas */}
                    <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 flex items-start gap-3 text-xs text-amber-950">
                      <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                      <div>
                        <strong className="block text-amber-900 font-semibold">
                          Aviso de Agenda: Quartas-feiras Ocupadas Permanentemente
                        </strong>
                        <span className="text-amber-900/90 leading-relaxed">
                          As <strong>quartas-feiras</strong> da Sra Nora já possuem compromisso fixo
                          recorrente e continuado (cuidado dedicado de idosa em Paracuru). Por isso,
                          as quartas aparecem bloqueadas no calendário. Para novos agendamentos,
                          escolha entre <strong>segunda, terça, quinta, sexta ou sábado</strong>.
                        </span>
                      </div>
                    </div>

                    {/* CALENDÁRIO VISUAL LEVE & MODERNO */}
                    <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4">
                      {/* Cabeçalho do mês e setas */}
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-bold text-base text-slate-900 capitalize">
                            {calendarMonth.toLocaleDateString('pt-BR', {
                              month: 'long',
                              year: 'numeric',
                            })}
                          </span>
                          <span className="block text-[11px] text-slate-500">
                            Toque no dia desejado
                          </span>
                        </div>

                        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            onClick={prevMonth}
                            className="h-8 w-8 text-slate-600 hover:text-slate-900"
                            aria-label="Mês anterior"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </Button>
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            onClick={nextMonth}
                            className="h-8 w-8 text-slate-600 hover:text-slate-900"
                            aria-label="Próximo mês"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Cabeçalho dos dias da semana */}
                      <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-slate-500 uppercase tracking-wider pb-1">
                        <span>Dom</span>
                        <span>Seg</span>
                        <span>Ter</span>
                        <span>Qua</span>
                        <span>Qui</span>
                        <span>Sex</span>
                        <span>Sáb</span>
                      </div>

                      {/* Grade dos dias do mês */}
                      <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
                        {calendarDays.map((day, idx) => {
                          if (!day.isCurrentMonth) {
                            return (
                              <div
                                key={idx}
                                className="h-10 sm:h-11 rounded-xl flex items-center justify-center text-xs text-slate-300 opacity-40 select-none"
                              >
                                {day.dayNum}
                              </div>
                            )
                          }

                          return (
                            <button
                              key={idx}
                              type="button"
                              disabled={day.isDisabled}
                              onClick={() => setDate(day.dateStr)}
                              className={`h-10 sm:h-11 rounded-xl flex flex-col items-center justify-center text-xs font-medium transition-all relative ${
                                day.isSelected
                                  ? 'bg-teal-700 text-white font-bold shadow-sm scale-105 z-10'
                                  : day.isToday
                                    ? 'bg-teal-50 text-teal-800 font-bold border border-teal-200'
                                    : 'bg-white hover:bg-slate-50 text-slate-800 border border-slate-200/80 hover:border-teal-600/40'
                              }`}
                            >
                              <span>{day.dayNum}</span>
                              {day.isToday && (
                                <span className="w-1 h-1 rounded-full bg-teal-600 absolute bottom-1" />
                              )}{' '}
                              {day.isWednesday && (
                                <span className="text-[7.5px] leading-none text-slate-400 font-medium">
                                  Ocupada
                                </span>
                              )}
                            </button>
                          )
                        })}
                      </div>

                      {/* Feedback da data escolhida */}
                      {date && (
                        <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs text-slate-700">
                          <span className="flex items-center gap-1.5">
                            <CalendarCheck className="w-4 h-4 text-emerald-600" />
                            <span>
                              Dia selecionado:{' '}
                              <strong className="capitalize">{readableDate}</strong>
                            </span>
                          </span>
                          <button
                            type="button"
                            onClick={() => setDate('')}
                            className="text-teal-800 hover:underline text-[11px] font-medium"
                          >
                            Trocar dia
                          </button>
                        </div>
                      )}
                    </div>

                    {/* SELEÇÃO DE HORÁRIO EM CHIPS (ESTILO PARAFUZO) */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                            <Clock className="w-4 h-4 text-teal-700" />
                            <span>Horário de Início Sugerido</span>
                          </Label>
                          <p className="text-[11px] text-slate-600">
                            Selecione o melhor turno para a Nora iniciar em sua residência
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className="text-[10px] bg-white border-teal-200 text-teal-800"
                        >
                          {time ? `Início às ${time}` : 'Escolha um'}
                        </Badge>
                      </div>

                      {/* Turno da Manhã */}
                      <div className="space-y-1.5">
                        <span className="text-[11px] font-semibold text-slate-600 flex items-center gap-1">
                          <Sun className="w-3.5 h-3.5 text-amber-500" /> Turno da Manhã
                        </span>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {TIME_SLOTS.filter((t) => t.period === 'manha').map((slot) => {
                            const isSlotSelected = time === slot.id
                            return (
                              <button
                                key={slot.id}
                                type="button"
                                onClick={() => setTime(slot.id)}
                                className={`p-3 rounded-xl border text-center transition-all ${
                                  isSlotSelected
                                    ? 'bg-teal-700 text-white border-teal-700 shadow-sm ring-2 ring-teal-600/20'
                                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
                                }`}
                              >
                                <span className="font-bold text-sm block">{slot.label}</span>
                                {slot.tag && (
                                  <span
                                    className={`text-[9px] block mt-0.5 ${
                                      isSlotSelected ? 'text-white/80' : 'text-slate-500'
                                    }`}
                                  >
                                    {slot.tag}
                                  </span>
                                )}
                              </button>
                            )
                          })}
                        </div>
                      </div>

                      {/* Turno da Tarde */}
                      <div className="space-y-1.5 pt-2">
                        <span className="text-[11px] font-semibold text-slate-600 flex items-center gap-1">
                          <Sunset className="w-3.5 h-3.5 text-orange-500" /> Turno da Tarde
                        </span>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {TIME_SLOTS.filter((t) => t.period === 'tarde').map((slot) => {
                            const isSlotSelected = time === slot.id
                            return (
                              <button
                                key={slot.id}
                                type="button"
                                onClick={() => setTime(slot.id)}
                                className={`p-3 rounded-xl border text-center transition-all ${
                                  isSlotSelected
                                    ? 'bg-teal-700 text-white border-teal-700 shadow-sm ring-2 ring-teal-600/20'
                                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
                                }`}
                              >
                                <span className="font-bold text-sm block">{slot.label}</span>
                                {slot.tag && (
                                  <span
                                    className={`text-[9px] block mt-0.5 ${
                                      isSlotSelected ? 'text-white/80' : 'text-slate-500'
                                    }`}
                                  >
                                    {slot.tag}
                                  </span>
                                )}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    </div>

                    {/* FREQUÊNCIA DO ATENDIMENTO (OPCIONAL/CHIPS) */}
                    <div className="pt-2 border-t border-slate-200 space-y-2">
                      <Label className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                        <Repeat className="w-4 h-4 text-teal-700" />
                        <span>Frequência desejada:</span>
                      </Label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {[
                          { val: 'once', label: 'Apenas uma vez' },
                          { val: 'weekly', label: 'Toda semana' },
                          { val: 'biweekly', label: 'A cada 15 dias' },
                          { val: 'monthly', label: 'Mensal (Quartas/Dia 3)' },
                        ].map((item) => (
                          <button
                            key={item.val}
                            type="button"
                            onClick={() => setFrequency(item.val as any)}
                            className={`text-xs p-2.5 rounded-xl border font-medium text-center transition-all ${
                              frequency === item.val
                                ? 'bg-teal-800 text-white border-teal-800 shadow-xs'
                                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-white'
                            }`}
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Botões de navegação */}
                    <div className="pt-4 flex items-center justify-between border-t border-slate-200">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={handlePrevStep}
                        className="text-slate-600 hover:text-slate-900 rounded-full px-5"
                      >
                        <ArrowLeft className="w-4 h-4 mr-1.5" /> Voltar
                      </Button>

                      <Button
                        type="button"
                        onClick={handleNextStep}
                        disabled={!canProceedStep2}
                        className="bg-teal-700 hover:bg-teal-800 text-white rounded-full px-8 py-6 text-sm font-medium shadow-sm transition-transform hover:scale-[1.01]"
                      >
                        <span>Continuar para Local e Contato</span>
                        <ArrowRight className="w-4 h-4 ml-1.5" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* ====================================================
                    PASSO 3: ENDEREÇO EM PARACURU & DADOS DE CONTATO
                    ==================================================== */}
                {currentStep === 3 && (
                  <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-8 animate-in fade-in duration-200">
                    <div className="space-y-1">
                      <span className="text-xs font-bold uppercase tracking-wider text-teal-800">
                        Passo 3 de 4
                      </span>
                      <h2 className="text-2xl font-bold text-slate-900">
                        Onde e com quem será o atendimento?
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-600">
                        Informe seu nome, WhatsApp para contato e localização exata em Paracuru.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Nome */}
                      <div className="space-y-1.5">
                        <Label htmlFor="name" className="text-xs font-semibold text-slate-700">
                          Seu Nome Completo (ou Responsável) *
                        </Label>
                        <Input
                          id="name"
                          placeholder="Ex: Maria Alice Ferreira"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="bg-slate-50 border-slate-200 rounded-xl text-sm"
                          required
                        />
                      </div>

                      {/* WhatsApp */}
                      <div className="space-y-1.5">
                        <Label htmlFor="phone" className="text-xs font-semibold text-slate-700">
                          WhatsApp / Telefone para Contato *
                        </Label>
                        <Input
                          id="phone"
                          placeholder="Ex: (85) 99123-4567"
                          value={phone}
                          onChange={handlePhoneChange}
                          className="bg-slate-50 border-slate-200 rounded-xl text-sm"
                          required
                        />
                      </div>

                      {/* E-mail opcional */}
                      <div className="space-y-1.5 sm:col-span-2">
                        <Label htmlFor="email" className="text-xs font-semibold text-slate-700">
                          E-mail (opcional)
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Ex: maria@exemplo.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="bg-slate-50 border-slate-200 rounded-xl text-sm"
                        />
                      </div>
                    </div>

                    {/* SEÇÃO DE ENDEREÇO DETALHADO COM CAMPOS SEPARADOS E ROTULADOS */}
                    <div className="pt-4 border-t border-slate-200 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                            <MapPin className="w-4 h-4 text-teal-700" />
                            <span>Endereço Completo do Cliente</span>
                          </Label>
                          <p className="text-[11px] text-slate-600 mt-0.5">
                            Informe todos os dados com precisão para a Nora localizar sem
                            dificuldades.
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className="text-[10px] bg-white border-teal-200 text-teal-800"
                        >
                          Obrigatório
                        </Badge>
                      </div>

                      {/* Linha 1: CEP + Cidade + UF */}
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                        <div className="sm:col-span-4 space-y-1.5">
                          <Label htmlFor="cep" className="text-xs font-semibold text-slate-700">
                            CEP * (00000-000)
                          </Label>
                          <Input
                            id="cep"
                            placeholder="62600-000"
                            maxLength={9}
                            value={cep}
                            onChange={handleCepChange}
                            className="bg-slate-50 border-slate-200 rounded-xl text-sm font-mono"
                            required
                          />
                          <p className="text-[10px] text-slate-500">Paracuru: 62600-000</p>
                        </div>

                        <div className="sm:col-span-5 space-y-1.5">
                          <Label htmlFor="city" className="text-xs font-semibold text-slate-700">
                            Cidade *
                          </Label>
                          <Input
                            id="city"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            placeholder="Paracuru"
                            className="bg-slate-50 border-slate-200 rounded-xl text-sm"
                            required
                          />
                        </div>

                        <div className="sm:col-span-3 space-y-1.5">
                          <Label htmlFor="stateUf" className="text-xs font-semibold text-slate-700">
                            UF *
                          </Label>
                          <Input
                            id="stateUf"
                            value={stateUf}
                            maxLength={2}
                            onChange={(e) => setStateUf(e.target.value.toUpperCase())}
                            placeholder="CE"
                            className="bg-slate-50 border-slate-200 rounded-xl text-sm uppercase text-center font-bold"
                            required
                          />
                        </div>
                      </div>

                      {/* Linha 2: Rua / Avenida + Número */}
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                        <div className="sm:col-span-8 space-y-1.5">
                          <Label htmlFor="street" className="text-xs font-semibold text-slate-700">
                            Rua ou Avenida *
                          </Label>
                          <Input
                            id="street"
                            placeholder="Ex: Rua São Pedro, Av. Beira Mar..."
                            value={street}
                            onChange={(e) => setStreet(e.target.value)}
                            className="bg-slate-50 border-slate-200 rounded-xl text-sm"
                            required
                          />
                        </div>

                        <div className="sm:col-span-4 space-y-1.5">
                          <Label htmlFor="number" className="text-xs font-semibold text-slate-700">
                            Número *
                          </Label>
                          <Input
                            id="number"
                            placeholder="Ex: 184 ou S/N"
                            value={number}
                            onChange={(e) => setNumber(e.target.value)}
                            className="bg-slate-50 border-slate-200 rounded-xl text-sm"
                            required
                          />
                        </div>
                      </div>

                      {/* Linha 3: Complemento / Extensão + Bairro */}
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                        <div className="sm:col-span-6 space-y-1.5">
                          <Label
                            htmlFor="complement"
                            className="text-xs font-semibold text-slate-700"
                          >
                            Complemento / Extensão (opcional)
                          </Label>
                          <Input
                            id="complement"
                            placeholder="Apto 18, Casa A, Bloco B"
                            value={complement}
                            onChange={(e) => setComplement(e.target.value)}
                            className="bg-slate-50 border-slate-200 rounded-xl text-sm"
                          />
                        </div>

                        <div className="sm:col-span-6 space-y-1.5">
                          <Label
                            htmlFor="neighborhood"
                            className="text-xs font-semibold text-slate-700"
                          >
                            Bairro *
                          </Label>
                          <Input
                            id="neighborhood"
                            placeholder="Ex: Centro, Ronco do Mar, Boca do Poço..."
                            value={neighborhood}
                            onChange={(e) => setNeighborhood(e.target.value)}
                            className="bg-slate-50 border-slate-200 rounded-xl text-sm"
                            required
                          />
                        </div>
                      </div>

                      {/* Linha 4: Ponto de Referência */}
                      <div className="space-y-1.5">
                        <Label htmlFor="ref" className="text-xs font-semibold text-slate-700">
                          Ponto de Referência em Paracuru (opcional)
                        </Label>
                        <Input
                          id="ref"
                          placeholder="Ex: Próximo à praça da Matriz / em frente à padaria / portão verde"
                          value={referencePoint}
                          onChange={(e) => setReferencePoint(e.target.value)}
                          className="bg-slate-50 border-slate-200 rounded-xl text-sm"
                        />
                      </div>

                      {/* Pré-visualização do endereço montado */}
                      {street && number && (
                        <div className="p-3 bg-teal-50/60 rounded-xl border border-teal-100 text-xs text-teal-900 flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                          <div className="space-y-0.5">
                            <span className="font-semibold block text-[11px] uppercase tracking-wider text-teal-800">
                              Endereço como aparecerá para a Nora:
                            </span>
                            <span className="text-slate-800 font-medium">
                              {computedFullAddress}
                              {referencePoint && ` · Ref: ${referencePoint.trim()}`}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Botões de navegação */}
                    <div className="pt-4 flex items-center justify-between border-t border-slate-200">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={handlePrevStep}
                        className="text-slate-600 hover:text-slate-900 rounded-full px-5"
                      >
                        <ArrowLeft className="w-4 h-4 mr-1.5" /> Voltar
                      </Button>

                      <Button
                        type="button"
                        onClick={handleNextStep}
                        disabled={!canProceedStep3}
                        className="bg-teal-700 hover:bg-teal-800 text-white rounded-full px-8 py-6 text-sm font-medium shadow-sm transition-transform hover:scale-[1.01]"
                      >
                        <span>Revisar Solicitação</span>
                        <ArrowRight className="w-4 h-4 ml-1.5" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* ====================================================
                    PASSO 4: REVISÃO & CONFIRMAÇÃO (RESUMO TOTAL ANTES DE ENVIAR)
                    ==================================================== */}
                {currentStep === 4 && (
                  <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-8 animate-in fade-in duration-200">
                    <div className="space-y-1">
                      <span className="text-xs font-bold uppercase tracking-wider text-teal-800">
                        Passo 4 de 4 · Revisão Final
                      </span>{' '}
                      <h2 className="text-2xl font-bold text-slate-900">
                        Confira os dados do seu agendamento
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-600">
                        Tudo pronto! Veja os detalhes antes de enviar para aprovação da Nora.
                      </p>
                    </div>

                    {/* Resumo detalhado em blocos limpos */}
                    <div className="space-y-4">
                      {/* Bloco Serviço & Preço Recalculado */}
                      <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <span className="text-[10px] uppercase font-bold text-teal-800 tracking-wider block">
                            Serviço Selecionado
                          </span>
                          <h3 className="font-bold text-lg text-slate-900">
                            {selectedService.name}
                          </h3>
                          <p className="text-xs text-slate-600 max-w-md">
                            {priceCalculation.explanation || selectedService.description}
                          </p>
                        </div>
                        <div className="text-right sm:border-l sm:border-slate-200 sm:pl-6 shrink-0">
                          <span className="text-[11px] text-slate-500 block">
                            {priceCalculation.label}
                          </span>
                          <span className="font-bold text-2xl text-teal-800">
                            R${' '}
                            {priceCalculation.price.toLocaleString('pt-BR', {
                              minimumFractionDigits: 2,
                            })}
                          </span>
                          {priceCalculation.isMonthly && (
                            <span className="text-[11px] text-slate-500 block">/mês (dia 03)</span>
                          )}
                        </div>
                      </div>

                      {/* Bloco Data, Horário e Local */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-1.5">
                          <span className="text-[10px] uppercase font-bold text-teal-800 tracking-wider flex items-center gap-1">
                            <CalendarIcon className="w-3.5 h-3.5" /> Data &amp; Horário
                          </span>
                          <p className="font-semibold text-sm text-slate-900 capitalize">
                            {readableDate}
                          </p>
                          <p className="text-xs text-slate-600">
                            Horário de início: <strong>{time}</strong> · Frequência:{' '}
                            <strong>{frequency}</strong>
                          </p>
                        </div>

                        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-1.5">
                          <span className="text-[10px] uppercase font-bold text-teal-800 tracking-wider flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" /> Endereço Completo
                          </span>
                          <p className="font-semibold text-sm text-slate-900">
                            {street}, {number}
                            {complement ? ` (${complement})` : ''}
                          </p>
                          <p className="text-xs text-slate-600">
                            {neighborhood} · {city}/{stateUf}
                            {cep && ` · CEP ${cep}`}
                            {referencePoint && ` · Ref: ${referencePoint}`}
                          </p>
                        </div>
                      </div>

                      {/* Bloco: O que precisa fazer */}
                      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-1.5">
                        <span className="text-[10px] uppercase font-bold text-teal-800 tracking-wider flex items-center gap-1">
                          <FileText className="w-3.5 h-3.5" /> O que precisa fazer / Observações
                        </span>
                        <p className="text-xs text-slate-800 leading-relaxed">
                          {needsDescription ? (
                            <span>"{needsDescription}"</span>
                          ) : (
                            <span className="text-slate-400 italic">
                              Nenhuma observação especial inserida. O atendimento seguirá a rotina
                              padrão de capricho da Nora.
                            </span>
                          )}
                        </p>
                      </div>

                      {/* Bloco: Contato */}
                      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex items-center justify-between text-xs">
                        <div className="space-y-0.5">
                          <span className="text-[10px] uppercase font-bold text-teal-800 tracking-wider block">
                            Cliente / Responsável
                          </span>
                          <p className="font-semibold text-slate-900">{name}</p>
                          <p className="text-slate-600">{phone}</p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setCurrentStep(3)}
                          className="text-xs text-teal-700 hover:underline"
                        >
                          Editar dados
                        </Button>
                      </div>
                    </div>

                    {/* Explicação da Regra de Negócio (Aprovação / Negociação) */}
                    <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-2">
                      <div className="flex items-center gap-2 font-bold text-amber-900">
                        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>Próximo passo após enviar este pedido:</span>
                      </div>
                      <p className="text-[11px] leading-relaxed text-amber-900">
                        O horário ficará temporariamente bloqueado na agenda da Nora como{' '}
                        <strong>"Aguardando aprovação"</strong>. A Sra Nora avaliará o serviço
                        solicitado. Ela poderá aprovar pelo valor calculado de R${' '}
                        {priceCalculation.price} ou sugerir um ajuste caso o imóvel demande atenção
                        extra. Após a aprovação, o pagamento com PIX ou Cartão no MercadoPago (modo
                        teste) será liberado.
                      </p>
                    </div>

                    {/* Botões de navegação e submissão */}
                    <div className="pt-4 flex items-center justify-between border-t border-slate-200">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={handlePrevStep}
                        className="text-slate-600 hover:text-slate-900 rounded-full px-5"
                      >
                        <ArrowLeft className="w-4 h-4 mr-1.5" /> Voltar
                      </Button>

                      <Button
                        type="button"
                        onClick={() => handleSubmitBooking()}
                        disabled={isSubmitting}
                        className="bg-teal-700 hover:bg-teal-800 text-white rounded-full px-8 py-6 text-sm font-medium shadow-md transition-transform hover:scale-[1.01]"
                      >
                        {isSubmitting ? (
                          <span>Enviando solicitação...</span>
                        ) : (
                          <>
                            <span>Confirmar e Enviar Solicitação</span>
                            <ArrowRight className="w-4 h-4 ml-1.5" />
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* COLUNA LATERAL: RESUMO FLUTUANTE (DESKTOP LATERAL + BARRA FIXA INFERIOR NO MOBILE) */}
              <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-24">
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                    <h3 className="font-bold text-base text-slate-900">Resumo do Pedido</h3>
                    <Badge className="bg-slate-100 border-slate-200 text-slate-700 text-[10px]">
                      Paracuru · CE
                    </Badge>
                  </div>

                  {/* Detalhes acumulados */}
                  <div className="space-y-3.5 text-xs text-slate-800">
                    {/* Serviço */}
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
                        Serviço
                      </span>
                      <p className="font-semibold text-sm text-slate-900">{selectedService.name}</p>
                      <span className="inline-block text-[10px] text-teal-800 bg-teal-50 px-2 py-0.5 rounded font-medium border border-teal-100">
                        {selectedService.category === 'idosos'
                          ? 'Cuidado de Idosos'
                          : selectedService.category === 'limpeza'
                            ? 'Limpeza Residencial'
                            : 'Plano Semanal'}
                      </span>
                    </div>

                    {/* Data & Horário */}
                    <div className="space-y-1 pt-2 border-t border-slate-200">
                      <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
                        Quando
                      </span>
                      {date ? (
                        <p className="font-semibold text-xs text-slate-900 capitalize flex items-center gap-1.5">
                          <CalendarCheck className="w-3.5 h-3.5 text-emerald-600" />
                          <span>
                            {readableDate} às {time}
                          </span>
                        </p>
                      ) : (
                        <p className="text-xs text-slate-400 italic">Selecione no passo 2</p>
                      )}
                    </div>

                    {/* O que precisa fazer */}
                    {needsDescription && (
                      <div className="space-y-1 pt-2 border-t border-slate-200">
                        <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
                          O que precisa fazer
                        </span>
                        <p className="text-[11px] text-slate-700 line-clamp-3 italic">
                          "{needsDescription}"
                        </p>
                      </div>
                    )}

                    {/* Endereço */}
                    {(street || neighborhood) && (
                      <div className="space-y-1 pt-2 border-t border-slate-200">
                        <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
                          Endereço
                        </span>
                        <p className="text-xs text-slate-900 font-medium truncate">
                          {street
                            ? `${street}${number ? `, nº ${number}` : ''}`
                            : 'Endereço em preenchimento'}
                          {complement ? ` (${complement})` : ''}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {neighborhood ? `${neighborhood} · Paracuru` : 'Paracuru (CE)'}
                          {cep ? ` · CEP ${cep}` : ''}
                        </p>
                      </div>
                    )}

                    {/* Valor Estimado / Fixo */}
                    <div className="pt-3 border-t border-slate-200 space-y-1">
                      <div className="flex items-baseline justify-between">
                        <span className="text-xs text-slate-500">{priceCalculation.label}:</span>
                        <span className="font-bold text-xl text-teal-800">
                          R${' '}
                          {priceCalculation.price.toLocaleString('pt-BR', {
                            minimumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                      {priceCalculation.isMonthly && (
                        <p className="text-[11px] text-teal-800 font-medium">
                          Plano mensal · Vencimento todo dia 03
                        </p>
                      )}
                      <p className="text-[10px] text-slate-500 leading-snug">
                        Pagamento liberado após aprovação da Nora via MercadoPago (modo teste).
                      </p>
                    </div>
                  </div>

                  {/* Botão de ação rápida */}
                  <div className="pt-2">
                    {currentStep < 4 ? (
                      <Button
                        type="button"
                        onClick={handleNextStep}
                        className="w-full bg-teal-700 hover:bg-teal-800 text-white rounded-full py-5 text-xs font-semibold shadow-xs"
                      >
                        Continuar
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        onClick={() => handleSubmitBooking()}
                        disabled={isSubmitting}
                        className="w-full bg-teal-700 hover:bg-teal-800 text-white rounded-full py-5 text-xs font-semibold shadow-xs"
                      >
                        {isSubmitting ? 'Enviando...' : 'Finalizar Solicitação'}
                      </Button>
                    )}
                  </div>
                </div>

                {/* Card de confiança Nora */}
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs text-slate-700 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Garantia de Atenção &amp; Respeito</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    A Nora é diarista e cuidadora com anos de confiança comprovada pelas famílias de
                    Paracuru. Sua reserva é tratada com total carinho e pontualidade.
                  </p>
                </div>
              </div>
            </div>

            {/* BARRA FIXA INFERIOR MOBILE (NÃO COBRE CONTEÚDO, BOTÃO 48PX COM RESUMO RÁPIDO) */}
            <div className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 sm:px-6 shadow-[0_-4px_16px_rgba(0,0,0,0.08)]">
              <div className="max-w-md mx-auto flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 block truncate">
                    {priceCalculation.label}
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-extrabold text-slate-900 leading-tight">
                      R${' '}
                      {priceCalculation.price.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
                    </span>
                    {priceCalculation.isMonthly && (
                      <span className="text-[10px] text-slate-500 font-medium">/mês</span>
                    )}
                  </div>
                </div>

                {currentStep < 4 ? (
                  <Button
                    type="button"
                    onClick={handleNextStep}
                    className="bg-teal-700 hover:bg-teal-800 text-white rounded-full px-5 py-3 h-12 text-xs sm:text-sm font-bold shadow-md shrink-0 flex items-center gap-1.5"
                  >
                    <span>Continuar</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={() => handleSubmitBooking()}
                    disabled={isSubmitting}
                    className="bg-teal-700 hover:bg-teal-800 text-white rounded-full px-5 py-3 h-12 text-xs sm:text-sm font-bold shadow-md shrink-0 flex items-center gap-1.5"
                  >
                    {isSubmitting ? 'Enviando...' : 'Confirmar e Enviar'}
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
