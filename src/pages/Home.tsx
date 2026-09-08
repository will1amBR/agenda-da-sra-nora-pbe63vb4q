import React from 'react'
import { Link } from 'react-router-dom'
import {
  Calendar,
  Heart,
  Sparkles,
  Home as HomeIcon,
  CheckCircle2,
  Clock,
  MapPin,
  ShieldCheck,
  ArrowRight,
  Phone,
  HelpCircle,
  Coins,
  Smile,
  BadgeCheck,
  Zap,
  CalendarCheck2,
  FileCheck,
  Check,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { getServices } from '@/lib/data'
import NoraHeroPhoto from '@/components/NoraHeroPhoto'

// Atalhos rápidos para o agendamento em poucos cliques
const QUICK_BOOKING_CARDS = [
  {
    id: 'cuidado-idosos-diaria',
    title: 'Cuidar de Idosos',
    subtitle: 'Companhia amorosa, rotina e remédios',
    price: 'A partir de R$ 160',
    icon: Heart,
    colorClass: 'text-rose-600 bg-rose-50 border-rose-200 hover:border-rose-400',
    badge: 'Dedicação total',
  },
  {
    id: 'limpeza-casa-simples',
    title: 'Limpeza de Casa Simples',
    subtitle: 'Manutenção, poeira, banheiros e piso',
    price: 'R$ 100 a R$ 150',
    icon: Sparkles,
    colorClass: 'text-teal-700 bg-teal-50 border-teal-200 hover:border-teal-400',
    badge: 'Mais pedido',
  },
  {
    id: 'limpeza-casa-elaborada',
    title: 'Limpeza Elaborada / Praia',
    subtitle: 'Faxina pesada, varanda e azulejos',
    price: 'R$ 200 a R$ 250 (até R$ 300)',
    icon: HomeIcon,
    colorClass: 'text-amber-700 bg-amber-50 border-amber-200 hover:border-amber-400',
    badge: 'Capricho máximo',
  },
]

// 4 passos do agendamento simplificado
const BOOKING_STEPS = [
  {
    step: '1',
    title: 'Toque em Agendar',
    desc: 'Comece pelo botão principal ou escolha direto o serviço desejado.',
  },
  {
    step: '2',
    title: 'Escolha o que precisa',
    desc: 'Cuidado de idosos ou limpeza para a sua residência em Paracuru.',
  },
  {
    step: '3',
    title: 'Dia e Horário',
    desc: 'Selecione a melhor data na agenda aberta da Nora.',
  },
  {
    step: '4',
    title: 'Pronto!',
    desc: 'Nora confere e aprova. Pagamento seguro só após a aprovação.',
  },
]

export default function Home() {
  const services = getServices()

  return (
    <div className="space-y-16 sm:space-y-20 pb-20">
      {/* =========================================================================
          HERO SECTION COM NOVA FOTO DA SRA NORA EM DESTAQUE IMEDIATO
          Mobile: foto no topo para visualização instantânea
          Desktop: foto em destaque à direita lado a lado com os CTAs de agendamento rápido
          ========================================================================= */}
      <section className="relative overflow-hidden pt-6 pb-16 sm:pt-10 sm:pb-20 md:py-20 bg-gradient-to-b from-teal-50/60 via-[#F6F8F7] to-[#F6F8F7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Card Hero com composição de impacto */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Foto da Sra Nora: no mobile renderiza no topo (order-1), no desktop fica na coluna da direita (lg:order-2) */}
            <div className="order-1 lg:order-2 lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-sm sm:max-w-md">
                {/* Glow decorativo de fundo */}
                <div className="absolute -inset-3 bg-gradient-to-tr from-teal-500/20 via-emerald-300/30 to-amber-200/20 rounded-3xl blur-2xl opacity-80" />

                <div className="relative space-y-3">
                  {/* Nova foto da Sra Nora */}
                  <NoraHeroPhoto />

                  {/* Micro-chamada logo abaixo da foto para reforço de conversão rápida */}
                  <div className="bg-white/95 backdrop-blur-sm p-3.5 rounded-2xl border border-slate-200/90 shadow-sm flex items-center justify-between text-left">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 flex items-center gap-1">
                        <Zap className="w-3 h-3 text-amber-500 fill-amber-500" /> Agendamento Fácil
                      </span>
                      <p className="text-xs font-semibold text-slate-800">
                        Reserve seu horário em menos de 2 minutos
                      </p>
                    </div>
                    <Button
                      asChild
                      size="sm"
                      className="bg-teal-700 hover:bg-teal-800 text-white rounded-full px-4 text-xs font-semibold shadow-xs shrink-0"
                    >
                      <Link to="/agendar">Agendar</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Texto de Apresentação e CTA principal: order-2 no mobile, lg:order-1 no desktop */}
            <div className="order-2 lg:order-1 lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200/80 text-teal-900 text-xs font-bold uppercase tracking-wider">
                <MapPin className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                <span>Atendimento Presencial em Paracuru &amp; Região (CE)</span>
              </div>

              <div className="space-y-3">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                  Cuidado dedicado com seus idosos,{' '}
                  <span className="text-teal-700 underline decoration-teal-500/30 decoration-wavy underline-offset-8">
                    carinho e limpeza
                  </span>{' '}
                  para a sua casa.
                </h1>

                <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
                  Olá! Sou a <strong>Sra Nora</strong>. Moro em Paracuru/CE e dedico minha vida com
                  muito respeito a <strong>cuidar de idosos</strong> e a{' '}
                  <strong>deixar residências e casas de praia impecáveis</strong>. Agende seu
                  horário em poucos cliques, com valor transparente e confirmação rápida.
                </p>
              </div>

              {/* Bloco de Ação Principal (Objetivo número 1: Agendamento em poucos cliques) */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-teal-100 shadow-md space-y-3.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-900 flex items-center gap-1.5">
                    <CalendarCheck2 className="w-4 h-4 text-teal-700" />
                    <span>Faça seu agendamento agora mesmo</span>
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">
                    Sem cobrança antecipada
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <Button
                    asChild
                    size="lg"
                    className="bg-teal-700 hover:bg-teal-800 text-white rounded-full px-8 py-6 text-base font-bold shadow-md transition-all hover:scale-[1.02] flex-1"
                  >
                    <Link to="/agendar" className="flex items-center justify-center gap-2">
                      <Calendar className="w-5 h-5" />
                      <span>Agendar Horário com a Nora</span>
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </Button>

                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="rounded-full px-6 py-6 text-sm font-semibold border-slate-300 text-slate-700 hover:bg-slate-50"
                  >
                    <a href="#atalhos-rapidos" className="flex items-center justify-center gap-1.5">
                      <span>Escolher por Serviço</span>
                    </a>
                  </Button>
                </div>

                {/* Micro-passo transparente */}
                <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-y-1 text-[11px] text-slate-600">
                  <span className="flex items-center gap-1 text-emerald-700 font-medium">
                    <Check className="w-3.5 h-3.5 text-emerald-600" /> Escolha o serviço
                  </span>
                  <span className="flex items-center gap-1 text-emerald-700 font-medium">
                    <Check className="w-3.5 h-3.5 text-emerald-600" /> Selecione o dia
                  </span>
                  <span className="flex items-center gap-1 text-emerald-700 font-medium">
                    <Check className="w-3.5 h-3.5 text-emerald-600" /> Aprovação da Nora
                  </span>
                  <span className="flex items-center gap-1 text-emerald-700 font-medium">
                    <Check className="w-3.5 h-3.5 text-emerald-600" /> Pagamento liberado
                  </span>
                </div>
              </div>

              {/* Provas Sociais / Badges de Confiança */}
              <div className="pt-2 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-slate-600">
                <div className="flex items-center gap-2 bg-white/70 backdrop-blur-xs p-2.5 rounded-xl border border-slate-200">
                  <BadgeCheck className="w-4 h-4 text-teal-700 shrink-0" />
                  <span className="font-medium">Paracuru &amp; Região</span>
                </div>
                <div className="flex items-center gap-2 bg-white/70 backdrop-blur-xs p-2.5 rounded-xl border border-slate-200">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-medium">Pontualidade &amp; Zelo</span>
                </div>
                <div className="flex items-center gap-2 bg-white/70 backdrop-blur-xs p-2.5 rounded-xl border border-slate-200 col-span-2 sm:col-span-1">
                  <Coins className="w-4 h-4 text-amber-600 shrink-0" />
                  <span className="font-medium">Preço Claro &amp; Justo</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SEÇÃO 1: ATALHOS RÁPIDOS DE AGENDAMENTO (CLIQUE DIRETO POR SERVIÇO)
          Permite ao visitante agendar em 1 clique já com o serviço pré-selecionado
          ========================================================================= */}
      <section id="atalhos-rapidos" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="text-left space-y-2 max-w-2xl">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
                <Zap className="w-3.5 h-3.5 text-teal-700" />
                Agendamento Rápido em Poucos Cliques
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                O que você gostaria de agendar hoje?
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Toque no botão do serviço desejado para abrir o fluxo de agendamento já com o tipo
                pré-selecionado. Prático, rápido e direto ao ponto.
              </p>
            </div>

            <Button
              asChild
              variant="outline"
              className="rounded-full border-teal-600 text-teal-800 hover:bg-teal-50 self-start md:self-auto font-semibold text-xs"
            >
              <Link to="/agendar" className="flex items-center gap-1.5">
                <span>Fluxo Completo de Agendamento</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </Button>
          </div>

          {/* Cards de Atalho Rápido */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {QUICK_BOOKING_CARDS.map((card) => {
              const IconComp = card.icon
              return (
                <div
                  key={card.id}
                  className="rounded-2xl border border-slate-200 p-5 bg-gradient-to-b from-slate-50/50 to-white flex flex-col justify-between gap-4 hover:border-teal-500 hover:shadow-md transition-all group text-left"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div
                        className={`w-11 h-11 rounded-xl flex items-center justify-center border ${card.colorClass}`}
                      >
                        <IconComp className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold text-teal-900 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                        {card.badge}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-bold text-lg text-slate-900 group-hover:text-teal-700 transition-colors">
                        {card.title}
                      </h3>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">{card.subtitle}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-baseline justify-between text-xs">
                      <span className="text-slate-500">Valor de referência:</span>
                      <span className="font-bold text-sm text-teal-800">{card.price}</span>
                    </div>
                  </div>

                  <Button
                    asChild
                    className="w-full bg-teal-700 hover:bg-teal-800 text-white rounded-full py-5 text-xs font-bold shadow-xs transition-transform group-hover:scale-[1.01]"
                  >
                    <Link to={`/agendar?service=${card.id}`}>
                      <span>Agendar este serviço</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                    </Link>
                  </Button>
                </div>
              )
            })}
          </div>

          {/* Destaque do Plano Mensal / Rotina Fixo */}
          <div className="bg-teal-50/70 border border-teal-200/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-left">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-teal-900 tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-teal-700" />
                Compromisso Fixo Permanente das Quartas-feiras
              </span>
              <p className="text-xs sm:text-sm font-semibold text-slate-900">
                Cuidado dedicado de idosos semanal (R$ 500/mês · pagamento todo dia 03).
              </p>
              <p className="text-[11px] text-slate-600">
                A agenda de quartas-feiras já está travada para a cliente fixa real da Nora. Para
                novos atendimentos, consulte os dias de segunda, terça, quinta, sexta ou sábado.
              </p>
            </div>
            <Button
              asChild
              variant="outline"
              className="bg-white border-teal-300 text-teal-800 hover:bg-teal-100/50 rounded-full text-xs font-semibold shrink-0"
            >
              <Link to="/agendar?service=cuidado-idosos-diaria">Ver Dias Disponíveis</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SEÇÃO 2: CAMINHO CURTO EM 4 PASSOS ("COMO É SIMPLES AGENDAR")
          1) Toque em agendar, 2) Escolha o que precisa, 3) Dia e horário, 4) Pronto
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <Badge className="bg-teal-600 text-white px-3 py-1 rounded-full text-xs font-medium">
              Caminho Simples
            </Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
              Agendamento em 4 Passos Rápidos
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              O fluxo foi desenhado para ser leve, direto e sem burocracia. Veja como funciona do
              início ao fim:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {BOOKING_STEPS.map((s) => (
              <div
                key={s.step}
                className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700/80 text-left space-y-3 relative flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-600 text-white font-extrabold text-base flex items-center justify-center shadow-md">
                    {s.step}
                  </div>
                  <h3 className="font-bold text-base text-white">{s.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center pt-4">
            <Button
              asChild
              size="lg"
              className="bg-teal-500 hover:bg-teal-600 text-slate-950 font-bold rounded-full px-8 py-6 text-sm shadow-md transition-transform hover:scale-105"
            >
              <Link to="/agendar" className="flex items-center gap-2">
                <span>Iniciar Agendamento em Poucos Cliques</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          CATÁLOGO COMPLETO DE SERVIÇOS & TABELA DE PREÇOS TRANSPARENTE
          ========================================================================= */}
      <section id="servicos" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <Badge className="bg-teal-700 text-white px-3 py-1 rounded-full text-xs font-medium">
            Tabela Transparente
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
            Todos os Serviços Prestados pela Sra Nora
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Valores reais definidos pela Sra Nora em Paracuru. Você solicita pelo preço base ou
            fixo, e ela confirma ou combina um valor adequado às necessidades da sua casa.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => {
            return (
              <div
                key={service.id}
                className="flex flex-col justify-between border border-slate-200 hover:border-teal-600 hover:shadow-md transition-all rounded-3xl bg-white overflow-hidden p-6 sm:p-7 group text-left"
              >
                <div className="space-y-4">
                  {/* Badge topo & Categoria */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-semibold text-teal-800 uppercase tracking-wider bg-teal-50 px-2.5 py-1 rounded-full border border-teal-100">
                      {service.category === 'idosos'
                        ? 'Cuidado de Idosos'
                        : service.category === 'limpeza'
                          ? 'Limpeza Residencial'
                          : 'Recorrente / Semanal'}
                    </span>
                    {service.badge && (
                      <span className="text-[10px] text-amber-900 bg-amber-100 font-semibold px-2 py-0.5 rounded-full">
                        {service.badge}
                      </span>
                    )}
                  </div>

                  {/* Título & Descrição */}
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-teal-700 transition-colors leading-snug">
                      {service.name}
                    </h3>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                  {/* Preço em destaque limpo */}
                  <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-teal-800 tracking-wider block">
                      {service.priceType === 'monthly_fixed'
                        ? 'Valor Mensal Fixo'
                        : service.priceType === 'range'
                          ? 'Faixa de Preço Estimada'
                          : 'Preço Fixo de Referência'}
                    </span>
                    <div className="flex items-baseline gap-1 text-slate-900">
                      <span className="text-xs font-semibold">R$</span>
                      <span className="text-3xl font-bold text-teal-800">
                        {service.basePrice.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
                      </span>
                      {service.priceType === 'monthly_fixed' && (
                        <span className="text-xs text-slate-500 font-medium">/mês (dia 03)</span>
                      )}
                      {service.priceType === 'range' && (
                        <span className="text-xs text-slate-500 font-medium">
                          a R$ {service.priceRange?.max}
                        </span>
                      )}
                    </div>
                    {service.priceRange?.note && (
                      <p className="text-[11px] text-slate-500 italic pt-1">
                        {service.priceRange.note}
                      </p>
                    )}
                  </div>

                  {/* Lista de Itens Inclusos */}
                  <div className="space-y-2 pt-1">
                    <span className="text-xs font-semibold text-slate-900 block">
                      O que está incluso:
                    </span>
                    <ul className="space-y-1.5 text-xs text-slate-600">
                      {service.highlights.map((h, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Ação CTA clara e moderna */}
                <div className="pt-6 mt-4 border-t border-slate-100">
                  <Button
                    asChild
                    className="w-full bg-teal-700 hover:bg-teal-800 text-white rounded-full transition-all font-medium text-sm py-5 shadow-xs group-hover:scale-[1.01]"
                  >
                    <Link to={`/agendar?service=${service.id}`}>
                      <span>Agendar Este Serviço</span>
                      <ArrowRight className="w-4 h-4 ml-1.5" />
                    </Link>
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* =========================================================================
          COMO FUNCIONA O FLUXO DE APROVAÇÃO E NEGOCIAÇÃO DA SRA NORA
          ========================================================================= */}
      <section
        id="como-funciona"
        className="bg-slate-950 text-white py-16 sm:py-20 rounded-3xl max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 shadow-xl"
      >
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-14">
          <Badge className="bg-teal-600 text-white px-3 py-1 rounded-full text-xs font-medium">
            Transparência Total
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Como Funciona a Aprovação da Nora?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Criado exatamente conforme a rotina da Sra Nora: você solicita com valor fixo, ela
            avalia a casa ou a rotina do idoso, e só após aprovação mútua o pagamento é liberado.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {/* Passo 1 */}
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-teal-600 text-white font-bold text-lg flex items-center justify-center">
              1
            </div>
            <h3 className="text-lg font-bold text-white">Você Escolhe o Serviço &amp; Data</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Seleciona o serviço desejado (com o preço fixo pré-definido) e sugere o melhor dia e
              horário em Paracuru. O horário fica temporariamente bloqueado como{' '}
              <strong className="text-amber-300">"Aguardando aprovação"</strong>.
            </p>
          </div>

          {/* Passo 2 */}
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-teal-600 text-white font-bold text-lg flex items-center justify-center">
              2
            </div>
            <h3 className="text-lg font-bold text-white">Nora Avalia ou Negocia o Valor</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              A Sra Nora pode <strong className="text-emerald-300">aprovar pelo preço fixo</strong>,{' '}
              <strong className="text-amber-300">propor outro valor</strong> (ex: casa maior ou com
              mais cômodos/sujidade) para você aceitar, ou recusar caso não tenha horário.
            </p>
          </div>

          {/* Passo 3 */}
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-teal-600 text-white font-bold text-lg flex items-center justify-center">
              3
            </div>
            <h3 className="text-lg font-bold text-white">Pagamento &amp; Confirmação</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Após a aprovação e você concordar com o valor, você faz o pagamento via{' '}
              <strong>PIX ou Cartão no MercadoPago</strong> (em modo teste). O agendamento vira{' '}
              <strong className="text-emerald-300">Confirmado</strong> na agenda dela!
            </p>
          </div>
        </div>

        {/* CTA Banner Passo */}
        <div className="mt-12 text-center pt-8 border-t border-slate-800">
          <Button
            asChild
            size="lg"
            className="bg-teal-600 hover:bg-teal-700 text-white rounded-full px-8 py-6 text-base font-medium shadow-sm"
          >
            <Link to="/agendar">Fazer Minha Solicitação de Agendamento</Link>
          </Button>
        </div>
      </section>

      {/* =========================================================================
          SOBRE A SRA NORA & PARACURU
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 grid grid-cols-1 md:grid-cols-12 gap-8 items-center shadow-xs">
          <div className="md:col-span-5 space-y-4">
            <div className="relative rounded-2xl overflow-hidden shadow-md">
              <img
                src="https://img.usecurling.com/p/600/450?q=house+cleaning+elderly+care"
                alt="Ambiente acolhedor e limpo em Paracuru"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

          <div className="md:col-span-7 space-y-4 text-left">
            <Badge className="bg-teal-700 text-white text-xs">Sobre a Nora</Badge>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Mais que um serviço, um compromisso de carinho e zelo
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Moradora de <strong>Paracuru (Ceará)</strong>, a Sra Nora é conhecida pelas famílias
              da cidade pela dedicação com idosos que necessitam de companhia amorosa, paciência e
              rotina medicamentosa, além do capricho impecável com faxinas de casas grandes e
              pequenas.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              Tudo é tratado com seriedade: sem surpresas, com comunicação clara pelo site ou pelo
              WhatsApp, e respeito à sua casa e aos seus familiares.
            </p>

            <div className="pt-2 flex flex-wrap gap-3 text-xs font-semibold text-teal-800">
              <span className="bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                📍 Paracuru - CE
              </span>
              <span className="bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                ❤️ Cuidado Afetuoso de Idosos
              </span>
              <span className="bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                ✨ Limpeza Caprichada
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          PERGUNTAS FREQUENTES
          ========================================================================= */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center space-y-3 mb-10">
          <h2 className="text-3xl font-bold text-slate-900">Dúvidas Comuns</h2>
          <p className="text-sm text-slate-500">Tudo o que você precisa saber antes de agendar</p>
        </div>

        <div className="space-y-4 text-left">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <h3 className="font-semibold text-sm text-slate-900">
              Por que o valor pode ser negociado após o envio?
            </h3>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              Casas com áreas externas muito grandes, churrasqueiras, muitos banheiros ou tempo
              excessivo fechadas demandam mais horas e produtos. Nesses casos, a Sra Nora pode
              sugerir um ajuste justo (por exemplo, de R$ 200 para R$ 250 ou R$ 300), e você só
              confirma se concordar!
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <h3 className="font-semibold text-sm text-slate-900">
              Como funciona o plano mensal de quarta-feira (R$ 500)?
            </h3>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              É o pacote dedicado para idosos: a Sra Nora reserva todas as quartas-feiras do mês
              para a mesma família em Paracuru, com pagamento mensal fixo realizado todo dia 03 do
              mês.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <h3 className="font-semibold text-sm text-slate-900">
              O MercadoPago cobra algum valor real agora?
            </h3>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              Não! O sistema está operando em <strong>Modo Teste (Simulado)</strong> oficial. Você
              pode testar o pagamento com cartões de demonstração ou simular a aprovação instantânea
              do PIX sem nenhum débito em conta. Chave PIX oficial registrada da Nora: (11)
              98210-6774.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
