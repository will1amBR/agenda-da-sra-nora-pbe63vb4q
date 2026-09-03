import React, { useState } from 'react'
import {
  CreditCard,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Copy,
  Clock,
  Sparkles,
  RefreshCw,
  ExternalLink,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  MERCADOPAGO_TEST_CARDS,
  generateTestPixData,
  simulateMercadoPagoCardPayment,
  simulateMercadoPagoPixConfirmation,
  PaymentResult,
} from '@/lib/mercadopago'
import { recordPayment } from '@/lib/data'
import { Booking } from '@/types'
import { useToast } from '@/hooks/use-toast'

interface MercadoPagoCheckoutModalProps {
  booking: Booking
  onSuccess: (result: PaymentResult) => void
  onClose?: () => void
}

export default function MercadoPagoCheckoutModal({
  booking,
  onSuccess,
  onClose,
}: MercadoPagoCheckoutModalProps) {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState<'credit_card' | 'pix'>('pix')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [copiedKey, setCopiedKey] = useState(false)
  const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(null)

  // Card form state
  const [selectedPresetCard, setSelectedPresetCard] = useState<number>(0)
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242')
  const [cardHolder, setCardHolder] = useState(booking.client.name.toUpperCase())
  const [expiry, setExpiry] = useState('12/28')
  const [cvv, setCvv] = useState('123')
  const [installments, setInstallments] = useState(1)

  // PIX state
  const pixData = generateTestPixData(booking.code, booking.agreedPrice)
  const [pixTimeLeft, setPixTimeLeft] = useState(900) // 15 min

  const handleSelectPresetCard = (index: number) => {
    setSelectedPresetCard(index)
    const card = MERCADOPAGO_TEST_CARDS[index]
    setCardNumber(card.number)
    setExpiry(card.expiry)
    setCvv(card.cvv)
  }

  const handleCopyPix = () => {
    navigator.clipboard.writeText(pixData.pixCopyPaste)
    setCopied(true)
    toast({
      title: 'Código Pix Copia e Cola copiado!',
      description: 'Cole no aplicativo do seu banco para simular o pagamento.',
    })
    setTimeout(() => setCopied(false), 3000)
  }

  const handleCopyPixKey = () => {
    navigator.clipboard.writeText(pixData.pixKey)
    setCopiedKey(true)
    toast({
      title: 'Chave PIX copiada!',
      description: `Chave telefone ${pixData.pixKey} da Sra Nora copiada.`,
    })
    setTimeout(() => setCopiedKey(false), 3000)
  }

  const handleProcessCard = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const preset = MERCADOPAGO_TEST_CARDS[selectedPresetCard]

    try {
      const result = await simulateMercadoPagoCardPayment({
        bookingId: booking.id,
        bookingCode: booking.code,
        clientName: booking.client.name,
        amount: booking.agreedPrice,
        cardNumber,
        cardHolderName: cardHolder,
        cardExpiry: expiry,
        cardCvv: cvv,
        installments,
        simulatedOutcome: preset.simulatedResult,
      })

      // Registra a transação no storage
      recordPayment({
        bookingId: booking.id,
        bookingCode: booking.code,
        clientName: booking.client.name,
        amount: booking.agreedPrice,
        method: 'credit_card',
        status: result.status,
        cardLastFour: cardNumber.slice(-4),
        cardHolder,
        installments,
      })

      setPaymentResult(result)

      if (result.success) {
        toast({
          title: 'Pagamento Aprovado com Sucesso!',
          description: 'Seu agendamento foi confirmado na agenda da Sra Nora.',
        })
        onSuccess(result)
      } else {
        toast({
          variant: 'destructive',
          title: 'Pagamento Não Autorizado',
          description: result.statusDetail,
        })
      }
    } catch {
      toast({
        variant: 'destructive',
        title: 'Erro de processamento',
        description: 'Tente novamente.',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSimulatePixPayment = async () => {
    setLoading(true)
    try {
      const result = await simulateMercadoPagoPixConfirmation(booking.id, booking.agreedPrice)

      recordPayment({
        bookingId: booking.id,
        bookingCode: booking.code,
        clientName: booking.client.name,
        amount: booking.agreedPrice,
        method: 'pix',
        status: 'approved',
        pixCopyPaste: pixData.pixCopyPaste,
      })

      setPaymentResult(result)
      toast({
        title: 'PIX Recebido e Confirmado!',
        description: 'Horário confirmado na agenda da Sra Nora.',
      })
      onSuccess(result)
    } catch {
      toast({
        variant: 'destructive',
        title: 'Erro ao simular PIX',
        description: 'Tente novamente.',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-[#E8DFD5] overflow-hidden max-w-2xl mx-auto">
      {/* Top Header com Marca MercadoPago e Badge Teste */}
      <div className="bg-gradient-to-r from-[#009EE3] to-[#007CB9] text-white p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="bg-white text-[#009EE3] font-bold text-xs px-2 py-1 rounded tracking-tight">
              Mercado Pago
            </div>
            <span className="text-sm font-medium text-sky-100">Checkout Transparente</span>
          </div>

          <div className="inline-flex items-center gap-1.5 bg-amber-400 text-stone-900 font-bold px-2.5 py-1 rounded-full text-xs shadow-sm">
            <span className="w-2 h-2 rounded-full bg-amber-900 animate-pulse" />
            <span>MODO TESTE</span>
          </div>
        </div>

        {/* Resumo do Pedido */}
        <div className="mt-4 pt-3 border-t border-sky-400/40 flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-xs text-sky-100">Reserva: #{booking.code}</p>
            <p className="text-base font-semibold">{booking.client.name}</p>
          </div>
          <div className="text-right">
            <span className="text-xs text-sky-100 block">Total a pagar</span>
            <span className="text-2xl font-bold">
              R$ {booking.agreedPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      {/* Tarja de Aviso Claro de Ambiente de Teste */}
      <div className="bg-amber-50 border-b border-amber-200 px-5 py-2.5 flex items-center gap-2 text-xs text-amber-900">
        <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
        <span>
          <strong>Ambiente de teste oficial:</strong> Nenhum valor real é cobrado do seu cartão ou
          conta bancária. Você pode testar livremente aprovação ou recusa.
        </span>
      </div>

      {/* Conteúdo do Checkout */}
      <div className="p-6">
        {paymentResult && paymentResult.success ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <h3 className="font-serif text-2xl font-bold text-[#2D1F1A]">
                Pagamento Aprovado com Sucesso!
              </h3>
              <p className="text-sm text-[#7B6153] mt-1 max-w-md mx-auto">
                Seu agendamento <strong>#{booking.code}</strong> foi registrado como{' '}
                <span className="text-emerald-700 font-semibold">Confirmado</span> na agenda da Sra
                Nora em Paracuru.
              </p>
            </div>

            <div className="bg-[#FAF7F2] border border-[#E8DFD5] rounded-xl p-4 max-w-sm mx-auto text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-stone-500">ID da Transação:</span>
                <span className="font-mono font-medium">{paymentResult.transactionId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Forma:</span>
                <span className="font-medium uppercase">{paymentResult.method}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Valor Pago:</span>
                <span className="font-bold text-stone-900">
                  R$ {paymentResult.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Status Gateway:</span>
                <span className="text-emerald-700 font-bold">Aprovado (Simulado MP)</span>
              </div>
            </div>

            {onClose && (
              <Button
                onClick={onClose}
                className="bg-[#B8502E] hover:bg-[#A04223] text-white rounded-full px-8 mt-2"
              >
                Concluir e Ver Minha Reserva
              </Button>
            )}
          </div>
        ) : (
          <Tabs
            defaultValue="pix"
            value={activeTab}
            onValueChange={(val) => setActiveTab(val as 'credit_card' | 'pix')}
          >
            <TabsList className="grid grid-cols-2 mb-6 bg-[#FAF7F2] p-1 border border-[#EADFD5]">
              <TabsTrigger
                value="pix"
                className="data-[state=active]:bg-[#009EE3] data-[state=active]:text-white font-medium flex items-center gap-2"
              >
                <QrCode className="w-4 h-4" />
                <span>PIX Instantâneo</span>
                <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded">Rápido</span>
              </TabsTrigger>
              <TabsTrigger
                value="credit_card"
                className="data-[state=active]:bg-[#009EE3] data-[state=active]:text-white font-medium flex items-center gap-2"
              >
                <CreditCard className="w-4 h-4" />
                <span>Cartão de Crédito</span>
              </TabsTrigger>
            </TabsList>

            {/* ABA PIX */}
            <TabsContent value="pix" className="space-y-5">
              <div className="bg-[#F0F8FF] border border-[#BAE0FD] rounded-xl p-4 flex flex-col sm:flex-row items-center gap-5">
                {/* QR Code Simulado SVG */}
                <div className="w-40 h-40 bg-white p-3 rounded-lg border border-sky-200 shadow-inner flex flex-col items-center justify-center shrink-0">
                  <div className="grid grid-cols-6 gap-1 w-full h-full p-1 bg-stone-900 rounded">
                    {/* Visual de QR Code realista com cantos */}
                    <div className="col-span-2 row-span-2 bg-white rounded-sm p-1">
                      <div className="w-full h-full bg-stone-900 rounded-xs" />
                    </div>
                    <div className="col-span-2 bg-white rounded-xs" />
                    <div className="col-span-2 row-span-2 bg-white rounded-sm p-1">
                      <div className="w-full h-full bg-stone-900 rounded-xs" />
                    </div>
                    <div className="col-span-2 bg-white" />
                    <div className="col-span-2 row-span-2 bg-white rounded-sm p-1">
                      <div className="w-full h-full bg-stone-900 rounded-xs" />
                    </div>
                    <div className="col-span-2 bg-white" />
                    <div className="col-span-2 bg-white" />
                  </div>
                  <span className="text-[10px] text-sky-800 font-semibold mt-1">
                    MercadoPago Test QR
                  </span>
                </div>

                <div className="flex-1 space-y-2 text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-sky-800 bg-sky-100 px-2 py-0.5 rounded">
                      PIX MercadoPago Simulado
                    </span>
                    <span className="text-xs text-stone-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> Expira em 15min
                    </span>
                  </div>
                  <p className="text-xs text-stone-700">
                    Abra seu aplicativo de banco e selecione{' '}
                    <strong>Pagar via Pix com QR Code</strong>, transfira diretamente pela{' '}
                    <strong>Chave Telefone</strong> ou use o <strong>Copia e Cola</strong> abaixo.
                  </p>
                  <p className="text-[11px] text-stone-500">
                    Beneficiário: <strong>{pixData.receiver}</strong> · {pixData.city}
                  </p>
                </div>
              </div>

              {/* Bloco Chave PIX da Nora (Telefone) */}
              <div className="bg-[#FAF7F2] border border-[#E8DFD5] rounded-xl p-3.5 space-y-2 text-left">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#8C3A1D] uppercase tracking-wider">
                    Chave PIX da Sra Nora (Telefone Celular)
                  </span>
                  <span className="text-[11px] text-stone-500 bg-white px-2 py-0.5 rounded border border-[#E8DFD5]">
                    Favorecida: Nora
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3 bg-white p-2.5 rounded-lg border border-[#E8DFD5]">
                  <div>
                    <span className="text-xs text-stone-500 block text-[11px]">
                      Chave para transferência:
                    </span>
                    <span className="font-mono font-bold text-sm text-[#2D1F1A]">
                      {pixData.pixKeyFormatted}
                    </span>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={handleCopyPixKey}
                    className="border-[#B8502E]/30 hover:bg-[#F9EDE8] text-[#B8502E] font-medium text-xs flex items-center gap-1.5 shrink-0"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    {copiedKey ? 'Chave Copiada!' : 'Copiar Chave'}
                  </Button>
                </div>
              </div>

              {/* Código Copia e Cola */}
              <div className="space-y-1.5 text-left">
                <Label className="text-xs font-semibold text-stone-700">
                  Código Pix Copia e Cola (simulado):
                </Label>
                <div className="flex gap-2">
                  <Input
                    readOnly
                    value={pixData.pixCopyPaste}
                    className="font-mono text-xs bg-[#FAF7F2] text-stone-600 truncate select-all"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCopyPix}
                    className="border-sky-300 hover:bg-sky-50 text-sky-700 font-medium shrink-0 flex items-center gap-1.5 text-xs"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    {copied ? 'Copiado!' : 'Copiar'}
                  </Button>
                </div>
              </div>

              {/* Botão para Simular Confirmação Instantânea */}
              <div className="pt-2">
                <Button
                  onClick={handleSimulatePixPayment}
                  disabled={loading}
                  className="w-full bg-[#009EE3] hover:bg-[#0081BA] text-white font-medium py-3 rounded-xl shadow-md flex items-center justify-center gap-2 text-sm"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Confirmando compensação bancária no MercadoPago...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Simular Confirmação Imediata do PIX</span>
                    </>
                  )}
                </Button>
                <p className="text-[11px] text-stone-500 text-center mt-2">
                  Ao clicar, o webhook simulado do MercadoPago aprova e confirma o agendamento na
                  hora.
                </p>
              </div>
            </TabsContent>

            {/* ABA CARTÃO DE CRÉDITO */}
            <TabsContent value="credit_card">
              {/* Seletor de Cartões de Teste Oficiais MercadoPago */}
              <div className="mb-4 bg-amber-50/70 border border-amber-200 rounded-xl p-3 text-left">
                <span className="text-xs font-bold text-amber-900 block mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  Selecione um cartão de teste oficial do MercadoPago:
                </span>
                <div className="space-y-1.5">
                  {MERCADOPAGO_TEST_CARDS.map((card, idx) => (
                    <button
                      key={card.number}
                      type="button"
                      onClick={() => handleSelectPresetCard(idx)}
                      className={`w-full text-left p-2.5 rounded-lg text-xs transition-all flex items-center justify-between border ${
                        selectedPresetCard === idx
                          ? 'bg-white border-[#009EE3] text-[#009EE3] font-semibold shadow-xs ring-1 ring-[#009EE3]'
                          : 'bg-white/60 border-amber-200 text-stone-700 hover:bg-white'
                      }`}
                    >
                      <div>
                        <span className="font-mono font-medium block">{card.number}</span>
                        <span className="text-[11px] text-stone-500">{card.label}</span>
                      </div>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                          card.simulatedResult === 'approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : card.simulatedResult === 'rejected'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {card.simulatedResult === 'approved'
                          ? 'Aprova'
                          : card.simulatedResult === 'rejected'
                            ? 'Recusa'
                            : 'Análise'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Formulário do Cartão */}
              <form onSubmit={handleProcessCard} className="space-y-3.5 text-left">
                <div>
                  <Label htmlFor="cardNumber" className="text-xs font-medium text-stone-700">
                    Número do cartão
                  </Label>
                  <Input
                    id="cardNumber"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="0000 0000 0000 0000"
                    required
                    className="font-mono text-sm mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="cardHolder" className="text-xs font-medium text-stone-700">
                    Nome impresso no cartão
                  </Label>
                  <Input
                    id="cardHolder"
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                    required
                    className="text-sm mt-1"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="expiry" className="text-xs font-medium text-stone-700">
                      Validade (MM/AA)
                    </Label>
                    <Input
                      id="expiry"
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      placeholder="MM/AA"
                      required
                      className="font-mono text-sm mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cvv" className="text-xs font-medium text-stone-700">
                      Código CVV
                    </Label>
                    <Input
                      id="cvv"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      placeholder="123"
                      required
                      maxLength={4}
                      className="font-mono text-sm mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="installments" className="text-xs font-medium text-stone-700">
                    Parcelamento
                  </Label>
                  <select
                    id="installments"
                    value={installments}
                    onChange={(e) => setInstallments(Number(e.target.value))}
                    className="w-full mt-1 border border-[#EADFD5] rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#009EE3]"
                  >
                    <option value={1}>
                      1x de R${' '}
                      {booking.agreedPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}{' '}
                      (sem juros)
                    </option>
                    <option value={2}>
                      2x de R${' '}
                      {(booking.agreedPrice / 2).toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                      })}{' '}
                      (sem juros)
                    </option>
                    <option value={3}>
                      3x de R${' '}
                      {(booking.agreedPrice / 3).toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                      })}{' '}
                      (sem juros)
                    </option>
                  </select>
                </div>

                {paymentResult && !paymentResult.success && (
                  <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-lg text-xs">
                    <strong>Falha no teste:</strong> {paymentResult.statusDetail}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#009EE3] hover:bg-[#0081BA] text-white font-medium py-3 rounded-xl shadow-md mt-4 flex items-center justify-center gap-2 text-sm"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Processando no MercadoPago Test...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>
                        Pagar R${' '}
                        {booking.agreedPrice.toLocaleString('pt-BR', {
                          minimumFractionDigits: 2,
                        })}{' '}
                        (Modo Teste)
                      </span>
                    </>
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        )}
      </div>

      {/* Footer do Modal */}
      <div className="bg-[#FAF7F2] border-t border-[#E8DFD5] px-6 py-3 flex items-center justify-between text-[11px] text-stone-500">
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          Conexão Segura Criptografada (Simulação)
        </span>
        {onClose && (
          <button onClick={onClose} className="text-stone-600 hover:text-stone-900 underline">
            Fechar / Pagar depois
          </button>
        )}
      </div>
    </div>
  )
}
