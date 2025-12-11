export type PaymentStatus = "pending" | "completed" | "failed" | "unknown";

export interface CashAppPayment {
  id: string;
  amount: number;
  note: string;
  cashTag: string;
  paymentUrl: string;
  status: PaymentStatus;
}
