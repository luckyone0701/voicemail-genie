POST /v2/online-checkout/payment-links
{
  "idempotency_key": "uuid",
  "order": {
    "location_id": "YOUR_LOCATION_ID",
    "line_items": [
      {
        "name": "Pro Plan",
        "quantity": "1",
        "base_price_money": {
          "amount": 1200,
          "currency": "USD"
        }
      }
    ]
  },
  "payment_options": {
      "accept_partial_amount": false
  },
  "checkout_options": {
      "redirect_url": "https://yourapp.com/payment/success",
      "accepted_payment_methods": {
        "afterpay_clearpay": false,
        "cash_app_pay": true,
        "google_pay": true,
        "apple_pay": true,
        "card": true
      }
  }
}
