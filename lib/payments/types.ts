export type PaymentProviderId = "stripe" | "paystack" | "paypal" | "apple_pay" | "bank_transfer";

export type PaymentProviderMeta = {
  id: PaymentProviderId;
  label: string;
  description: string;
  configured: boolean;
};
