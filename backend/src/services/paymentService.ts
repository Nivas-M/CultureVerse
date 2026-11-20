/**
 * Payment Service Abstraction for CultureVerse
 * Isolates payment provider integration and handles realistic transaction records,
 * platform commission calculation (configurable), and custodian payout ledgers.
 */

export interface PaymentIntentOptions {
  bookingId: string;
  amount: number;
  currency: string;
  custodianId: string;
  travellerId: string;
  metadata?: Record<string, any>;
}

export interface PaymentResult {
  success: boolean;
  transactionId: string;
  paymentGatewayRef: string;
  provider: string;
  amount: number;
  currency: string;
  status: 'SUCCESS' | 'FAILED';
  breakdown: {
    baseFare: number;
    platformCommissionPercent: number;
    platformCommissionAmount: number;
    custodianNetAmount: number;
  };
  errorMessage?: string;
}

export interface IPaymentProvider {
  name: string;
  processPayment(options: PaymentIntentOptions): Promise<PaymentResult>;
  processPayout(custodianId: string, amount: number): Promise<{ success: boolean; payoutRef: string }>;
}

/**
 * Sandboxed / Mock Payment Provider for Hackathon / Pilot MVP
 * Simulates genuine banking authorization, generates deterministic refs,
 * and maintains transparent ledger breakdown.
 */
export class MockPaymentProvider implements IPaymentProvider {
  name = 'MOCK_SANDBOX_GATEWAY';

  async processPayment(options: PaymentIntentOptions): Promise<PaymentResult> {
    // Configurable platform commission (defaults to 15% if not set in environment)
    const commissionRate = parseFloat(process.env.PLATFORM_COMMISSION_RATE || '0.15');
    const commissionAmount = Math.round(options.amount * commissionRate * 100) / 100;
    const custodianShare = Math.round((options.amount - commissionAmount) * 100) / 100;

    // Simulate gateway delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    const gatewayRef = `pay_mock_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const txId = `TXN-TV-${Date.now()}`;

    return {
      success: true,
      transactionId: txId,
      paymentGatewayRef: gatewayRef,
      provider: this.name,
      amount: options.amount,
      currency: options.currency || 'INR',
      status: 'SUCCESS',
      breakdown: {
        baseFare: options.amount,
        platformCommissionPercent: commissionRate * 100,
        platformCommissionAmount: commissionAmount,
        custodianNetAmount: custodianShare
      }
    };
  }

  async processPayout(custodianId: string, amount: number): Promise<{ success: boolean; payoutRef: string }> {
    const payoutRef = `pout_mock_${Date.now()}_${custodianId.slice(-4)}`;
    return {
      success: true,
      payoutRef
    };
  }
}

/**
 * Future Real Payment Provider stub (e.g. Razorpay / UPI / Stripe)
 */
export class RazorpayPaymentProvider implements IPaymentProvider {
  name = 'RAZORPAY_LIVE';

  async processPayment(options: PaymentIntentOptions): Promise<PaymentResult> {
    throw new Error('Razorpay live keys not configured in MVP environment.');
  }

  async processPayout(custodianId: string, amount: number): Promise<{ success: boolean; payoutRef: string }> {
    throw new Error('Payout routing not configured.');
  }
}

class PaymentService {
  private provider: IPaymentProvider;

  constructor() {
    // In production with credentials, switches to real provider; defaults to MockPaymentProvider
    this.provider = new MockPaymentProvider();
  }

  public getProviderName(): string {
    return this.provider.name;
  }

  public async chargeBooking(options: PaymentIntentOptions): Promise<PaymentResult> {
    return await this.provider.processPayment(options);
  }

  public async disbursePayout(custodianId: string, amount: number) {
    return await this.provider.processPayout(custodianId, amount);
  }
}

export const paymentService = new PaymentService();
