import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  Sparkles,
  Heart,
  Home,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { getServices, createBooking } from '@/lib/data'
import { Service, Booking } from '@/types'
import { useToast } from '@/hooks/use-toast'

export default function AgendarPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { toast } = useToast()

  const services = getServices()
  const preselectedServiceId = searchParams.get('service')

  // Estado do formulário
  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    preselectedServiceId || services[0]?.id || '',
  )
  const [date, setDate] = useState<string>('')
  const [time, setTime] = useState<string>('08:00')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [neighborhood, setNeighborhood] = useState('Centro, Paracuru')
  const [notes, setNotes] = useState('')
  const [frequency, setFrequency] = useState<'once' | 'weekly' | 'biweekly' | 'monthly'>('once')

  // Estado de confirmação / sucesso da solicitação
  const [createdBooking, setCreatedBooking] = useState<Booking | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Atualiza se mudou o param
  useEffect(() => {
    if (preselectedServiceId) {
      setSelectedServiceId(preselectedServiceId)
    }
  }, [preselectedServiceId])

  // Data mínima: amanhã
  const minDate = new Date(Date.now() + 86400000).toISOString().split('T')[0]

  const selectedService = services.find((s) => s.id === selectedServiceId) || services[0]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!date) {
      toast({
        variant: 'destructive',
        title: 'Selecione uma data',
        description: 'Por favor, escolha o dia desejado para o atendimento.',
      })
      return
    }

    if (!name || !phone || !address) {
      toast({
        variant: 'destructive',
        title: 'Dados incompletos',
        description: 'Nome, telefone e endereço em Paracuru são obrigatórios.',
      })
      return
    }

    setIsSubmitting(true)

    // Preço fixo de entrada
    const fixedPrice = selectedService.basePrice

    const newBooking = createBooking({
      serviceId: selectedService.id,
      client: {
        name,
        phone,
        email: email || `${name.toLowerCase().replace(/\s+/g, '')}@exemplo.com`,
        address,
        neighborhood,
      },
      date,
      time,
      notes: notes.trim() ? notes : undefined,
      frequency,
      fixedPrice,
    })

    setIsSubmitting(false)
    setCreatedBooking(newBooking)

    toast({
      title: 'Solicitação enviada com sucesso!',
      description: `Código: #${newBooking.code}. Horário bloqueado aguardando aprovação da Nora.`,
    })
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      {createdBooking ? (
        /* TELA DE SUCESSO APÓS O ENVIO */
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#EADFD5] shadow-xl text-center space-y-6 animate-in fade-in zoom-in-95">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs uppercase font-bold tracking-wider text-[#8C3A1D] bg-[#F9EDE8] px-3 py-1 rounded-full">
              Solicitação Registrada
            </span>
            <h2 className="font-serif text-3xl font-bold text-[#2D1F1A]">
              Seu Pedido Entrou na Agenda da Nora!
            </h2>
            <p className="text-sm text-[#6B5345] max-w-lg mx-auto">
              O horário sugerido está{' '}
              <strong className="text-amber-700">temporariamente bloqueado</strong> como{' '}
              <span className="font-semibold underline">Aguardando aprovação</span>.
            </p>
          </div>

          {/* Card com Detalhes da Solicitação */}
          <div className="bg-[#FAF7F2] border border-[#EADFD5] rounded-2xl p-6 max-w-md mx-auto text-left space-y-3 text-xs text-[#372A24]">
            <div className="flex justify-between items-center pb-2 border-b border-[#EADFD5]">
              <span className="text-[#7B6153]">Código de Acompanhamento:</span>
              <span className="font-mono font-bold text-sm text-[#B8502E]">
                #{createdBooking.code}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#7B6153]">Serviço:</span>
              <span className="font-semibold text-right">{selectedService.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#7B6153]">Data &amp; Horário:</span>
              <span className="font-semibold">
                {new Date(createdBooking.date + 'T12:00:00').toLocaleDateString('pt-BR', {
                  weekday: 'short',
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                })}{' '}
                às {createdBooking.time}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#7B6153]">Endereço em Paracuru:</span>
              <span className="font-semibold text-right">
                {createdBooking.client.address} ({createdBooking.client.neighborhood})
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t border-[#EADFD5]">
              <span className="text-[#7B6153]">Valor Fixo Inicial:</span>
              <span className="font-serif font-bold text-base text-[#B8502E]">
                R${' '}
                {createdBooking.originalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#7B6153]">Status Atual:</span>
              <span className="inline-flex items-center gap-1 font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                <Clock className="w-3 h-3" /> Aguardando aprovação
              </span>
            </div>
          </div>

          {/* O que acontece agora? */}
          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-950 text-left max-w-md mx-auto space-y-1">
            <span className="font-bold flex items-center gap-1">
              <AlertCircle className="w-4 h-4 text-amber-600" /> Próximo passo da Sra Nora:
            </span>
            <p>
              A Sra Nora irá conferir a rota e a solicitação. Ela pode aprovar pelo valor fixo ou
              propor um valor ajustado caso seja uma casa maior. Quando aprovado, você receberá o
              link para pagar com Cartão ou PIX (MercadoPago modo teste).
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <Button
              asChild
              className="bg-[#B8502E] hover:bg-[#A04223] text-white rounded-full px-7"
            >
              <Link to={`/minhas-reservas?code=${createdBooking.code}`}>
                <span>Acompanhar Minha Reserva Agora</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="rounded-full border-[#D6C7BA] text-[#594437] hover:bg-white"
            >
              <Link to="/painel">Ver no Painel da Nora (Simular como Nora)</Link>
            </Button>
          </div>
        </div>
      ) : (
        /* FORMULÁRIO DE AGENDAMENTO */
        <div className="space-y-8 text-left">
          {/* Header da Página */}
          <div className="space-y-2">
            <Link
              to="/"
              className="inline-flex items-center gap-1 text-xs text-[#8C3A1D] hover:underline mb-2 font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Voltar para início
            </Link>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#2D1F1A]">
              Solicitar Agendamento
            </h1>
            <p className="text-sm text-[#6B5345]">
              Preencha os dados do atendimento em <strong>Paracuru (CE)</strong>. O horário ficará
              temporariamente reservado para você.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">
            {/* ETAPA 1: ESCOLHER SERVIÇO */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#EADFD5] shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-[#EADFD5] pb-3">
                <span className="w-6 h-6 rounded-full bg-[#B8502E] text-white text-xs font-bold flex items-center justify-center">
                  1
                </span>
                <h2 className="font-serif text-lg font-bold text-[#2D1F1A]">
                  Escolha o Serviço Desejado
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {services.map((srv) => {
                  const isSelected = selectedServiceId === srv.id
                  return (
                    <div
                      key={srv.id}
                      onClick={() => setSelectedServiceId(srv.id)}
                      className={`cursor-pointer p-4 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'border-[#B8502E] bg-[#FAF5F2] ring-2 ring-[#B8502E]/20 shadow-xs'
                          : 'border-[#EADFD5] hover:border-[#C4AEA0] bg-white'
                      }`}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-xs font-semibold uppercase text-[#8C3A1D]">
                          {srv.category === 'idosos'
                            ? 'Cuidado'
                            : srv.category === 'limpeza'
                              ? 'Limpeza'
                              : 'Semanal'}
                        </span>
                        <span className="font-serif font-bold text-sm text-[#2D1F1A]">
                          R$ {srv.basePrice}
                          {srv.priceType === 'monthly_fixed' ? '/mês' : ''}
                        </span>
                      </div>
                      <h3 className="font-serif font-bold text-sm text-[#2D1F1A] mt-1">
                        {srv.name}
                      </h3>
                      <p className="text-xs text-[#7B6153] mt-1 line-clamp-2">{srv.description}</p>
                    </div>
                  )
                })}
              </div>

              {/* Destaque do serviço selecionado */}
              {selectedService && (
                <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#EADFD5] text-xs text-[#5C4537] space-y-1">
                  <div className="flex justify-between font-semibold text-[#2D1F1A]">
                    <span>Serviço Selecionado: {selectedService.name}</span>
                    <span className="text-[#B8502E] font-serif text-sm">
                      Valor Fixo Inicial: R$ {selectedService.basePrice},00
                    </span>
                  </div>
                  {selectedService.priceRange?.note && (
                    <p className="text-[11px] text-[#8C7A70] italic">
                      Nota de variação: {selectedService.priceRange.note}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* ETAPA 2: DATA, HORÁRIO & FREQUÊNCIA */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#EADFD5] shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-[#EADFD5] pb-3">
                <span className="w-6 h-6 rounded-full bg-[#B8502E] text-white text-xs font-bold flex items-center justify-center">
                  2
                </span>
                <h2 className="font-serif text-lg font-bold text-[#2D1F1A]">
                  Data e Horário em Paracuru
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="date" className="text-xs font-semibold text-stone-700">
                    Data desejada *
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    min={minDate}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    className="text-sm"
                  />
                  {selectedService.id === 'cuidado-idosos-mensal' && (
                    <p className="text-[11px] text-amber-800 bg-amber-50 p-1.5 rounded">
                      💡 Dica: Para o plano de idosos semanal, selecione uma{' '}
                      <strong>quarta-feira</strong>!
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="time" className="text-xs font-semibold text-stone-700">
                    Horário de início sugerido *
                  </Label>
                  <select
                    id="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full border border-[#EADFD5] rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#B8502E]"
                  >
                    <option value="07:00">07:00 (Manhã cedo - fresquinho)</option>
                    <option value="07:30">07:30</option>
                    <option value="08:00">08:00 (Horário padrão)</option>
                    <option value="08:30">08:30</option>
                    <option value="13:00">13:00 (Turno da tarde)</option>
                    <option value="13:30">13:30</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <Label className="text-xs font-semibold text-stone-700 block mb-2">
                  Frequência do atendimento:
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
                      className={`text-xs p-2.5 rounded-lg border font-medium text-center transition-all ${
                        frequency === item.val
                          ? 'bg-[#B8502E] text-white border-[#B8502E]'
                          : 'bg-[#FAF7F2] text-stone-700 border-[#EADFD5] hover:bg-white'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* ETAPA 3: DADOS DO CLIENTE & ENDEREÇO EM PARACURU */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#EADFD5] shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-[#EADFD5] pb-3">
                <span className="w-6 h-6 rounded-full bg-[#B8502E] text-white text-xs font-bold flex items-center justify-center">
                  3
                </span>
                <h2 className="font-serif text-lg font-bold text-[#2D1F1A]">
                  Seus Dados &amp; Local em Paracuru
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-xs font-semibold text-stone-700">
                    Seu nome completo (ou responsável) *
                  </Label>
                  <Input
                    id="name"
                    placeholder="Ex: Ana Maria Silva"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="phone" className="text-xs font-semibold text-stone-700">
                    WhatsApp / Telefone para contato *
                  </Label>
                  <Input
                    id="phone"
                    placeholder="Ex: (85) 99123-4567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs font-semibold text-stone-700">
                    E-mail (opcional)
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Ex: ana@exemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="neighborhood" className="text-xs font-semibold text-stone-700">
                    Bairro / Região em Paracuru *
                  </Label>
                  <select
                    id="neighborhood"
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                    className="w-full border border-[#EADFD5] rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#B8502E]"
                  >
                    <option value="Centro, Paracuru">Centro</option>
                    <option value="Ronco do Mar, Paracuru">Ronco do Mar</option>
                    <option value="Boca do Poço, Paracuru">Boca do Poço</option>
                    <option value="Praia da Pedra Rachada, Paracuru">Praia da Pedra Rachada</option>
                    <option value="Munguba, Paracuru">Munguba</option>
                    <option value="Outro bairro em Paracuru">Outro bairro de Paracuru</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="address" className="text-xs font-semibold text-stone-700">
                  Rua, número e ponto de referência *
                </Label>
                <Input
                  id="address"
                  placeholder="Ex: Rua São Pedro, 142 - Próximo à praça da Matriz"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="notes" className="text-xs font-semibold text-stone-700">
                  Observações sobre a casa ou sobre o idoso (cômodos, animais, medicação, etc.)
                </Label>
                <Textarea
                  id="notes"
                  rows={3}
                  placeholder="Ex: Casa com 3 quartos e quintal grande; ou: Meu pai necessita de auxílio para caminhar e remédios no almoço."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>

            {/* RESUMO & TERMOS */}
            <div className="bg-[#FAF7F2] rounded-2xl p-6 border border-[#EADFD5] space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <span className="text-xs text-[#7B6153]">Valor fixo de solicitação</span>
                  <div className="text-2xl font-serif font-bold text-[#B8502E]">
                    R${' '}
                    {selectedService.basePrice.toLocaleString('pt-BR', {
                      minimumFractionDigits: 2,
                    })}
                  </div>
                </div>

                <div className="text-xs text-[#7B6153] max-w-sm">
                  ⚠️ Ao enviar, a Sra Nora analisará a data e o imóvel. Se necessário, ela poderá
                  sugerir um ajuste de valor que você poderá aceitar ou recusar antes de pagar.
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                size="lg"
                className="w-full bg-[#B8502E] hover:bg-[#A04223] text-white py-6 rounded-xl font-medium text-base shadow-lg shadow-[#B8502E]/25 transition-transform hover:scale-[1.01]"
              >
                {isSubmitting ? (
                  <span>Enviando solicitação...</span>
                ) : (
                  <span>Enviar Solicitação para Aprovação da Nora</span>
                )}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
