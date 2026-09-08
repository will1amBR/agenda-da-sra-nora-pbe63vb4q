import React, { useState, useEffect } from 'react'
import {
  MessageSquare,
  Send,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Copy,
  ExternalLink,
  DollarSign,
  Filter,
  Check,
  RefreshCw,
  Sparkles,
  Info,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { computeRemindersList } from '@/lib/reminders'
import { markReminderSent } from '@/lib/data'
import { ReminderItem } from '@/types'
import { NORA_PIX_CONFIG } from '@/lib/noraConfig'
import { useToast } from '@/hooks/use-toast'

export default function AdminLembretesPage() {
  const { toast } = useToast()
  const [reminders, setReminders] = useState<ReminderItem[]>([])
  const [filterType, setFilterType] = useState<'todos' | 'compromisso' | 'pagamento'>('todos')
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const loadData = () => {
    setReminders(computeRemindersList())
  }

  useEffect(() => {
    loadData()
    const handler = () => loadData()
    window.addEventListener('nora_storage_change', handler)
    return () => window.removeEventListener('nora_storage_change', handler)
  }, [])

  const handleSendWhatsApp = (item: ReminderItem) => {
    // Abre WhatsApp Web / app com texto pré-preenchido
    window.open(item.whatsappUrl, '_blank', 'noopener,noreferrer')

    // Marca como enviado no storage
    markReminderSent(item.bookingId, item.type)
    toast({
      title: 'WhatsApp aberto!',
      description: `Mensagem pronta aberta para ${item.clientName}. O status foi atualizado para "Lembrete Enviado".`,
    })
    loadData()
  }

  const handleToggleSentManual = (item: ReminderItem) => {
    markReminderSent(item.bookingId, item.type)
    toast({
      title: item.alreadySent ? 'Status mantido' : 'Marcado como enviado',
      description: `Lembrete de ${item.type} para ${item.clientName} registrado.`,
    })
    loadData()
  }

  const handleCopyMessage = (item: ReminderItem) => {
    navigator.clipboard.writeText(item.suggestedMessage)
    setCopiedId(item.id)
    toast({
      title: 'Mensagem copiada!',
      description: 'Texto pronto copiado para a área de transferência.',
    })
    setTimeout(() => setCopiedId(null), 2500)
  }

  const filteredReminders = reminders.filter((r) => {
    if (filterType === 'compromisso') return r.type === 'compromisso'
    if (filterType === 'pagamento') return r.type === 'pagamento'
    return true
  })

  const unsentCount = reminders.filter((r) => !r.alreadySent).length
  const unsentCompromisso = reminders.filter(
    (r) => !r.alreadySent && r.type === 'compromisso',
  ).length
  const unsentPagamento = reminders.filter((r) => !r.alreadySent && r.type === 'pagamento').length

  const getUrgencyBadge = (urgency: ReminderItem['urgency']) => {
    switch (urgency) {
      case 'hoje':
        return (
          <Badge className="bg-rose-100 text-rose-800 border-rose-300 text-[10px] font-semibold">
            Hoje
          </Badge>
        )
      case 'amanha':
        return (
          <Badge className="bg-amber-100 text-amber-900 border-amber-300 text-[10px] font-semibold">
            Amanhã
          </Badge>
        )
      case 'atrasado':
        return (
          <Badge className="bg-red-100 text-red-900 border-red-300 text-[10px] font-bold">
            Vencimento passou
          </Badge>
        )
      case 'vencendo':
        return (
          <Badge className="bg-teal-50 text-teal-800 border-teal-200 text-[10px] font-semibold">
            Vencimento Próximo
          </Badge>
        )
      default:
        return (
          <Badge className="bg-slate-100 text-slate-700 border-slate-300 text-[10px]">Futuro</Badge>
        )
    }
  }

  return (
    <div className="space-y-8 text-left">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Lembretes por WhatsApp
            </h1>
            {unsentCount > 0 && (
              <Badge className="bg-teal-700 text-white text-xs">
                {unsentCount} pendente{unsentCount > 1 ? 's' : ''}
              </Badge>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Motor de lembretes da Sra Nora: mensagens cordiais prontas em 1 clique para WhatsApp
            (wa.me) para não esquecer compromissos e vencimentos de PIX.
          </p>
        </div>

        <Button
          onClick={loadData}
          variant="outline"
          size="sm"
          className="self-start sm:self-auto border-slate-300 text-slate-700 hover:bg-slate-50 text-xs"
        >
          <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
          Atualizar Lista
        </Button>
      </div>

      {/* BANNER INFORMATIVO (COMO FUNCIONA / CHAVE PIX) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 bg-gradient-to-r from-teal-50 to-emerald-50/60 border border-teal-200/80 rounded-2xl p-5 space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-teal-700 text-white flex items-center justify-center font-bold text-xs">
              WA
            </div>
            <strong className="text-sm font-semibold text-teal-950">
              Envio Direto e Profissional sem Complicação
            </strong>
          </div>
          <p className="text-teal-900/90 leading-relaxed">
            Ao clicar em <strong>"Enviar no WhatsApp"</strong>, o link <code>wa.me</code> abre seu
            WhatsApp Web ou aplicativo no celular com a mensagem carinhosa já redigida em seu nome,
            incluindo dados do atendimento, valor e sua chave PIX. Após o clique, o status é marcado
            como <strong>"Enviado"</strong> para não duplicar o lembrete.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-2 text-xs">
          <span className="text-[10px] uppercase font-bold text-teal-800 tracking-wider block">
            Chave PIX Utilizada nos Lembretes
          </span>
          <p className="text-base font-bold text-slate-900 font-mono">
            {NORA_PIX_CONFIG.formattedKey}
          </p>
          <p className="text-[11px] text-slate-500">
            Chave telefone (11982106774) cadastrada em nome de {NORA_PIX_CONFIG.receiver}.
          </p>
        </div>
      </div>

      {/* FILTROS E CONTADORES */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setFilterType('todos')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
            filterType === 'todos'
              ? 'bg-teal-700 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Todos ({reminders.length})</span>
        </button>

        <button
          onClick={() => setFilterType('compromisso')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
            filterType === 'compromisso'
              ? 'bg-teal-700 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Compromissos ({reminders.filter((r) => r.type === 'compromisso').length})</span>
          {unsentCompromisso > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white text-teal-800 font-bold">
              {unsentCompromisso} pendentes
            </span>
          )}
        </button>

        <button
          onClick={() => setFilterType('pagamento')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
            filterType === 'pagamento'
              ? 'bg-teal-700 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <DollarSign className="w-3.5 h-3.5" />
          <span>Vencimentos PIX ({reminders.filter((r) => r.type === 'pagamento').length})</span>
          {unsentPagamento > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white text-teal-800 font-bold">
              {unsentPagamento} pendentes
            </span>
          )}
        </button>
      </div>

      {/* LISTA DE LEMBRETES */}
      <div className="space-y-4">
        {filteredReminders.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
            <MessageSquare className="w-10 h-10 text-slate-400 mx-auto" />
            <p className="text-sm font-semibold text-slate-900">
              Nenhum lembrete nesta categoria no momento
            </p>
            <p className="text-xs text-slate-500">
              Novas reservas confirmadas ou vencimentos aparecerão aqui automaticamente.
            </p>
          </div>
        ) : (
          filteredReminders.map((item) => {
            const isCompromisso = item.type === 'compromisso'

            return (
              <Card
                key={item.id}
                className={`border-slate-200 bg-white rounded-2xl shadow-xs overflow-hidden transition-all ${
                  item.alreadySent
                    ? 'border-l-4 border-l-emerald-500 opacity-95'
                    : isCompromisso
                      ? 'border-l-4 border-l-teal-600'
                      : 'border-l-4 border-l-amber-500'
                }`}
              >
                <CardContent className="p-5 sm:p-6 space-y-4">
                  {/* Topo do Card */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3.5">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                          isCompromisso ? 'bg-teal-50 text-teal-700' : 'bg-amber-50 text-amber-800'
                        }`}
                      >
                        {isCompromisso ? (
                          <Calendar className="w-4 h-4" />
                        ) : (
                          <DollarSign className="w-4 h-4" />
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900">
                            {item.clientName}
                          </span>
                          <span className="font-mono text-xs text-slate-500">
                            {item.clientPhone}
                          </span>
                        </div>
                        <span className="text-xs text-slate-600">
                          {isCompromisso
                            ? 'Lembrete de Atendimento'
                            : 'Lembrete de Pagamento / Vencimento'}{' '}
                          · {item.serviceName}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {getUrgencyBadge(item.urgency)}

                      {item.alreadySent ? (
                        <Badge className="bg-emerald-100 text-emerald-900 border-emerald-300 text-xs flex items-center gap-1 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Lembrete Enviado</span>
                        </Badge>
                      ) : (
                        <Badge className="bg-slate-100 text-slate-700 border-slate-300 text-xs">
                          Pendente de envio
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Informações centrais */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-700 bg-slate-50/70 p-3.5 rounded-xl border border-slate-100">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                        {isCompromisso ? 'Data e Horário' : 'Data de Vencimento'}
                      </span>
                      <p className="font-semibold text-slate-900 mt-0.5">
                        {item.targetDate} {item.time ? `às ${item.time}` : ''}
                      </p>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                        Valor
                      </span>
                      <p className="font-semibold text-teal-800 mt-0.5">
                        R$ {item.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                        {isCompromisso ? 'Local do Atendimento' : 'Chave PIX'}
                      </span>
                      <p className="text-slate-700 truncate mt-0.5">
                        {isCompromisso
                          ? item.address || 'Paracuru, CE'
                          : `${NORA_PIX_CONFIG.formattedKey} (Tel)`}
                      </p>
                    </div>
                  </div>

                  {/* Pré-visualização da Mensagem formatada */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span className="font-semibold text-slate-700 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                        Texto formatado pronto para o WhatsApp:
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyMessage(item)}
                        className="text-teal-700 hover:text-teal-900 hover:underline flex items-center gap-1 font-medium"
                      >
                        {copiedId === item.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" /> Copiado!
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" /> Copiar texto
                          </>
                        )}
                      </button>
                    </div>

                    <div className="p-3 bg-emerald-50/40 rounded-xl border border-emerald-200/60 font-mono text-[11.5px] text-slate-800 leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto">
                      {item.suggestedMessage}
                    </div>
                  </div>

                  {/* Ações: Botão WhatsApp e Ações Manuais */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <div className="text-[11px] text-slate-500">
                      {item.lastSentAt ? (
                        <span>
                          Último envio registrado em:{' '}
                          <strong>
                            {new Date(item.lastSentAt).toLocaleDateString('pt-BR')} às{' '}
                            {new Date(item.lastSentAt).toLocaleTimeString('pt-BR', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </strong>
                        </span>
                      ) : (
                        <span>Pronto para enviar agora</span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleSentManual(item)}
                        className="text-xs text-slate-600 hover:text-slate-900 h-8"
                      >
                        {item.alreadySent ? 'Reenviar lembrete' : 'Marcar como enviado'}
                      </Button>

                      <Button
                        type="button"
                        onClick={() => handleSendWhatsApp(item)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold h-9 shadow-sm flex items-center gap-2 px-4 transition-transform hover:scale-[1.02]"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Enviar no WhatsApp</span>
                        <ExternalLink className="w-3 h-3 opacity-70" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
