import React, { useState, useEffect } from 'react'
import {
  CreditCard,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Filter,
  ArrowUpRight,
  AlertCircle,
  RotateCcw,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getPayments, getBookings } from '@/lib/data'
import { PaymentTransaction } from '@/types'
import { NORA_PIX_CONFIG } from '@/lib/noraConfig'

export default function AdminPagamentosPage() {
  const [payments, setPayments] = useState<PaymentTransaction[]>([])

  const loadData = () => {
    setPayments(getPayments())
  }

  useEffect(() => {
    loadData()
    const handler = () => loadData()
    window.addEventListener('nora_storage_change', handler)
    return () => window.removeEventListener('nora_storage_change', handler)
  }, [])

  const totalPix = payments
    .filter((p) => p.method === 'pix' && p.status === 'approved')
    .reduce((acc, p) => acc + p.amount, 0)

  const totalCard = payments
    .filter((p) => p.method === 'credit_card' && p.status === 'approved')
    .reduce((acc, p) => acc + p.amount, 0)

  const totalAll = totalPix + totalCard

  return (
    <div className="space-y-8 text-left">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2D1F1A]">
              Transações &amp; MercadoPago
            </h1>
            <Badge className="bg-amber-400 text-stone-900 font-bold text-xs uppercase tracking-wider">
              Modo Teste Simulado
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-[#7B6153]">
            Histórico completo de pagamentos recebidos via Cartão de Crédito e PIX.
          </p>
        </div>
      </div>

      {/* BANNER DE INTEGRAÇÃO ISOLADA & DADOS BANCÁRIOS / PIX */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-sky-50 border border-sky-200 rounded-2xl p-5 space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="bg-[#009EE3] text-white font-bold text-[10px] px-2 py-0.5 rounded">
              MercadoPago Sandbox
            </div>
            <span className="font-bold text-sky-950">
              Camada de Pagamento Pronta para Credenciais Reais
            </span>
          </div>
          <p className="text-sky-900 leading-relaxed">
            O fluxo simula respostas reais de cartões de teste e compensação bancária do PIX. Para
            ativar cobranças reais na conta bancária da Sra Nora, basta plugar o{' '}
            <code>Access Token</code> de produção na camada <code>src/lib/mercadopago.ts</code>.
          </p>
        </div>

        {/* Card Chave PIX Cadastrada da Sra Nora */}
        <div className="bg-[#FAF7F2] border border-[#E8DFD5] rounded-2xl p-5 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-semibold uppercase tracking-wider text-[10px] text-[#8C3A1D]">
              Chave PIX da Sra Nora
            </span>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
              Ativa
            </span>
          </div>
          <div>
            <span className="text-stone-500 text-[11px] block">Telefone Celular:</span>
            <span className="font-mono font-bold text-base text-[#2D1F1A]">
              {NORA_PIX_CONFIG.formattedKey}
            </span>
          </div>
          <p className="text-[11px] text-stone-500 pt-1 border-t border-[#E8DFD5]">
            Valor copiável:{' '}
            <code className="font-mono bg-white px-1 py-0.5 rounded border border-[#E8DFD5] text-stone-700">
              {NORA_PIX_CONFIG.rawKey}
            </code>
          </p>
        </div>
      </div>

      {/* CARDS DE RESUMO FINANCEIRO */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-[#EADFD5] bg-white rounded-2xl shadow-xs">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-semibold uppercase text-stone-500 tracking-wider">
                Total Recebido (Teste)
              </span>
              <p className="font-serif text-3xl font-bold text-[#2D1F1A]">
                R$ {totalAll.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-[11px] text-[#7B6153]">{payments.length} transações processadas</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#EADFD5] bg-white rounded-2xl shadow-xs">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-semibold uppercase text-stone-500 tracking-wider">
                Via PIX Instantâneo
              </span>
              <p className="font-serif text-2xl font-bold text-[#009EE3]">
                R$ {totalPix.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-[11px] text-[#7B6153]">Sem taxa de intermediador</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-sky-100 text-[#009EE3] flex items-center justify-center">
              <QrCode className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#EADFD5] bg-white rounded-2xl shadow-xs">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-semibold uppercase text-stone-500 tracking-wider">
                Via Cartão de Crédito
              </span>
              <p className="font-serif text-2xl font-bold text-purple-700">
                R$ {totalCard.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-[11px] text-[#7B6153]">Cartões de teste oficiais MP</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center">
              <CreditCard className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* TABELA / LISTA DE TRANSAÇÕES */}
      <div className="space-y-4">
        <h2 className="font-serif text-lg font-bold text-[#2D1F1A]">
          Registro de Transações no Gateway
        </h2>

        {payments.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center border border-[#EADFD5]">
            <p className="text-xs text-stone-500">Nenhum pagamento registrado ainda.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {payments.map((tx) => (
              <Card key={tx.id} className="border-[#EADFD5] bg-white rounded-2xl shadow-xs">
                <CardContent className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#2D1F1A]">{tx.clientName}</span>
                      <span className="font-mono text-[10px] text-stone-500">ID: #{tx.id}</span>
                      <span className="font-mono text-[10px] text-[#B8502E]">
                        Ref: #{tx.bookingCode}
                      </span>
                    </div>

                    <p className="text-stone-500 flex items-center gap-2">
                      <span>{new Date(tx.createdAt).toLocaleDateString('pt-BR')}</span>
                      <span>às {new Date(tx.createdAt).toLocaleTimeString('pt-BR')}</span>
                      <span>·</span>
                      <span className="font-semibold uppercase tracking-wider text-sky-800">
                        {tx.method === 'pix' ? 'PIX Simulado' : 'Cartão de Crédito'}
                      </span>
                      {tx.cardLastFour && <span>(Final {tx.cardLastFour})</span>}
                    </p>
                  </div>

                  <div className="text-right flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2">
                    <span className="font-serif font-bold text-base text-[#2D1F1A]">
                      R$ {tx.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                    <Badge
                      className={
                        tx.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                          : tx.status === 'rejected'
                            ? 'bg-rose-100 text-rose-900 border-rose-300'
                            : 'bg-amber-100 text-amber-900 border-amber-300'
                      }
                    >
                      {tx.status === 'approved'
                        ? 'Aprovado (MP)'
                        : tx.status === 'rejected'
                          ? 'Recusado'
                          : 'Em Análise'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
