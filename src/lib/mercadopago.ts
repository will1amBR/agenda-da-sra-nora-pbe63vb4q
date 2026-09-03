// Módulo de Integração com MercadoPago (MODO TESTE SIMULADO)
// Camada isolada para troca futura por SDK real (@mercadopago/sdk-react ou API REST v1/payments)

export interface TestCardOption {
  number: string
  label: string
  expiry: string
  cvv: string
  brand: 'mastercard' | 'visa' | 'elo'
  simulatedResult: 'approved' | 'rejected' | 'in_process'
  statusDetail: string
}

export const MERCADOPAGO_TEST_CARDS: TestCardOption[] = [
  {
    number: '4242 •••• •••• 4242',
    label: 'Cartão de Teste - Aprovação Imediata (Sucesso)',
    expiry: '12/28',
    cvv: '123',
    brand: 'visa',
    simulatedResult: 'approved',
    statusDetail: 'Pagamento aprovado instantaneamente pelo emissor de teste.',
  },
  {
    number: '5502 •••• •••• 0001',
    label: 'Cartão de Teste - Recusa por Limite / Saldo Insuficiente',
    expiry: '10/27',
    cvv: '456',
    brand: 'mastercard',
    simulatedResult: 'rejected',
    statusDetail: 'cc_rejected_insufficient_amount: saldo insuficiente simulado.',
  },
  {
    number: '4012 •••• •••• 0002',
    label: 'Cartão de Teste - Análise de Risco (Em Processamento)',
    expiry: '08/29',
    cvv: '789',
    brand: 'visa',
    simulatedResult: 'in_process',
    statusDetail: 'in_process: pagamento em revisão de segurança antifraude.',
  },
]

export interface ProcessCardPaymentParams {
  bookingId: string
  bookingCode: string
  clientName: string
  amount: number
  cardNumber: string
  cardHolderName: string
  cardExpiry: string
  cardCvv: string
  installments: number
  simulatedOutcome?: 'approved' | 'rejected' | 'in_process'
}

export interface PaymentResult {
  success: boolean
  transactionId: string
  status: 'approved' | 'rejected' | 'in_process'
  statusDetail: string
  amount: number
  method: 'credit_card' | 'pix'
  paidAt?: string
  receiptUrl?: string
}

import { NORA_PIX_CONFIG } from './noraConfig'

// Reexporta a configuração central do PIX para fácil acesso
export { NORA_PIX_CONFIG }

export function generateTestPixData(bookingCode: string, amount: number) {
  // Código Copia e Cola padrão EMV / Pix simulado realista com a chave telefone oficial da Nora
  const cleanCode = bookingCode.replace(/[^a-zA-Z0-9]/g, '')
  const centavos = Math.round(amount * 100)
  const pixKeyRaw = NORA_PIX_CONFIG.rawKey // 11982106774
  // Payload EMV Pix padrão do Banco Central com a chave celular (+5511982106774 / 11982106774)
  const pixCopyPaste = `00020126480014br.gov.bcb.pix0114+55${pixKeyRaw}520400005303986540${centavos}5802BR5916NORA SERVICOS CE6008PARACURU62240520TESTMP${cleanCode}6304C8A1`

  // Data de expiração: 15 minutos a partir de agora
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString()

  return {
    pixCopyPaste,
    pixKey: NORA_PIX_CONFIG.rawKey,
    pixKeyFormatted: NORA_PIX_CONFIG.formattedKey,
    pixKeyType: NORA_PIX_CONFIG.keyType,
    receiver: NORA_PIX_CONFIG.receiver,
    city: NORA_PIX_CONFIG.city,
    expiresAt,
  }
}

// Simula a chamada da API do MercadoPago com delay de rede
export async function simulateMercadoPagoCardPayment(
  params: ProcessCardPaymentParams,
): Promise<PaymentResult> {
  // Simular delay de gateway (1.2s)
  await new Promise((resolve) => setTimeout(resolve, 1200))

  // Determinar resultado pelo cartão ou pelo outcome forçado
  let status: 'approved' | 'rejected' | 'in_process' = params.simulatedOutcome || 'approved'
  let detail = 'Pagamento aprovado em modo teste pelo MercadoPago.'

  if (params.cardNumber.includes('0001') || params.simulatedOutcome === 'rejected') {
    status = 'rejected'
    detail = 'Recusado pelo emissor: saldo insuficiente ou cartão bloqueado (simulação MP).'
  } else if (params.cardNumber.includes('0002') || params.simulatedOutcome === 'in_process') {
    status = 'in_process'
    detail = 'Pagamento em processo de validação de segurança pelo MercadoPago.'
  }

  const txId = 'mp_test_' + Math.random().toString(36).substring(2, 11)

  return {
    success: status === 'approved',
    transactionId: txId,
    status,
    statusDetail: detail,
    amount: params.amount,
    method: 'credit_card',
    paidAt: status === 'approved' ? new Date().toISOString() : undefined,
  }
}

// Simulação de confirmação automática do PIX
export async function simulateMercadoPagoPixConfirmation(
  bookingId: string,
  amount: number,
): Promise<PaymentResult> {
  await new Promise((resolve) => setTimeout(resolve, 1800))
  const txId = 'mp_pix_' + Math.random().toString(36).substring(2, 11)

  return {
    success: true,
    transactionId: txId,
    status: 'approved',
    statusDetail: 'PIX compensado instantaneamente pelo Banco Central / MercadoPago Test.',
    amount,
    method: 'pix',
    paidAt: new Date().toISOString(),
  }
}
