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
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { getServices } from '@/lib/data'
import NoraHeroPhoto from '@/components/NoraHeroPhoto'

export default function Home() {
  const services = getServices()

  return (
    <div className="space-y-20 pb-20">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 md:py-24 bg-gradient-to-b from-teal-50/50 via-[#F6F8F7] to-[#F6F8F7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Texto de Apresentação */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200/80 text-teal-800 text-xs font-semibold uppercase tracking-wider">
                <MapPin className="w-3.5 h-3.5 text-teal-700" />
                Atendimento em Paracuru &amp; Região (Ceará)
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight leading-[1.15]">
                Cuidado com os seus idosos,{' '}
                <span className="text-teal-700 underline decoration-teal-500/30 decoration-wavy underline-offset-8">
                  carinho e limpeza
                </span>{' '}
                para a sua casa.
              </h1>

              <p className="text-lg text-slate-600 leading-relaxed max-w-2xl font-normal">
                Olá! Sou a <strong>Sra Nora</strong>. Moro em Paracuru/CE e dedico minha vida com
                muito respeito a <strong>cuidar de idosos</strong> e a{' '}
                <strong>deixar residências e casas de praia impecáveis</strong>. Agende com preço
                justo, transparência e aprovação direta.
              </p>

              {/* Botões de Ação */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Button
                  asChild
                  size="lg"
                  className="bg-teal-700 hover:bg-teal-800 text-white rounded-full px-8 py-6 text-base shadow-md transition-transform hover:scale-105"
                >
                  <Link to="/agendar" className="flex items-center gap-2 font-medium">
                    <Calendar className="w-5 h-5" />
                    <span>Solicitar Agendamento</span>
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="rounded-full px-7 py-6 text-base border-slate-300 text-slate-700 hover:bg-white"
                >
                  <a href="#servicos" className="flex items-center gap-2 font-medium">
                    <span>Ver Serviços &amp; Preços</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </Button>
              </div>

              {/* Provas Sociais / Badges */}
              <div className="pt-6 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <BadgeCheck className="w-4 h-4 text-teal-700 shrink-0" />
                  <span>Residências &amp; idosos em Paracuru</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Pontualidade &amp; Confiança</span>
                </div>
                <div className="flex items-center gap-2">
                  <Coins className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Preço fixo com ajuste negociável</span>
                </div>
              </div>
            </div>

            {/* Card Visual Hero / Destaque Nora */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md">
                {/* Efeito Glow / Círculo Suave */}
                <div className="absolute -inset-2 bg-gradient-to-tr from-teal-600/15 to-emerald-200/30 rounded-3xl blur-xl" />

                <div className="relative bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200 space-y-6">
                  {/* Foto da Sra Nora (isolada no componente NoraHeroPhoto e configurada em src/lib/noraConfig.ts) */}
                  <NoraHeroPhoto />

                  {/* Fatos Reais dos Serviços */}
                  <div className="space-y-3 text-left">
                    <h3 className="text-lg font-bold text-slate-900">Dedicação de Verdade</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      "Atendo casas de família com muito amor. Cuido com todo respeito dos idosos e
                      deixo qualquer casa, seja simples ou praia grande, limpa e cheirosa."
                    </p>
                  </div>

                  {/* Exemplo de Rotina Real */}
                  <div className="bg-teal-50/60 p-4 rounded-xl border border-teal-200/80 text-xs space-y-1.5 text-left">
                    <span className="font-semibold text-teal-800 uppercase text-[10px] tracking-wider block">
                      Compromisso Fixo Permanente
                    </span>
                    <p className="font-medium text-slate-900">
                      Quartas-feiras: Cuidado dedicado com plano mensal (R$ 500/mês).
                    </p>
                    <p className="text-[11px] text-slate-600">
                      Compromisso real com pagamento pontual todo dia 03 e agenda travada.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATÁLOGO DE SERVIÇOS & PREÇOS (CONFORME REGRAS REAIS) */}
      <section id="servicos" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <Badge className="bg-teal-700 text-white px-3 py-1 rounded-full text-xs font-medium">
            Tabela Transparente
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
            Serviços Prestados pela Sra Nora
          </h2>
          <p className="text-base text-slate-600">
            Valores reais definidos pela Sra Nora em Paracuru. Você solicita pelo preço base ou
            fixo, e ela confirma ou combina um valor adequado às necessidades da sua casa.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => {
            return (
              <div
                key={service.id}
                className="flex flex-col justify-between border border-slate-200 hover:border-teal-600 hover:shadow-md transition-all rounded-3xl bg-white overflow-hidden p-6 sm:p-7 group"
              >
                <div className="space-y-4 text-left">
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
                      <span>Agendar Agora</span>
                      <ArrowRight className="w-4 h-4 ml-1.5" />
                    </Link>
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* COMO FUNCIONA O AGENDAMENTO (PASSO A PASSO DA NORA) */}
      <section
        id="como-funciona"
        className="bg-slate-950 text-white py-16 sm:py-20 rounded-3xl max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 my-10 shadow-xl"
      >
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
          <Badge className="bg-teal-600 text-white px-3 py-1 rounded-full text-xs font-medium">
            Passo a Passo
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Como Funciona o Agendamento?
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Criado exatamente conforme a rotina da Sra Nora: você solicita com valor fixo, ela
            avalia a casa ou a rotina do idoso, e só após aprovação o pagamento é liberado.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Passo 1 */}
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4 text-left relative">
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
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4 text-left relative">
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
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4 text-left relative">
            <div className="w-10 h-10 rounded-xl bg-teal-600 text-white font-bold text-lg flex items-center justify-center">
              3
            </div>
            <h3 className="text-lg font-bold text-white">Pagamento &amp; Confirmação</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Após a aprovação e você concordar com o valor, você faz o pagamento via{' '}
              <strong>PIX ou Cartão no MercadoPago</strong> (em modo de teste). O agendamento vira{' '}
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

      {/* SOBRE A SRA NORA & PARACURU */}
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
            <h2 className="text-3xl font-bold text-slate-900">
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

            <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold text-teal-800">
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

      {/* PERGUNTAS FREQUENTES */}
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
              É o pacote preferido para idosos: a Sra Nora reserva todas as quartas-feiras do mês
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
              do PIX sem nenhum débito em conta.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
