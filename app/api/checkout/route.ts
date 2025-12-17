const session = await stripe.checkout.sessions.create({
  mode: "payment",
  payment_method_types: ["card"],
  line_items: [
    {
      price_data: {
        currency: "usd",
        unit_amount: 500,
        product_data: { name: "Voicemail Greeting" },
      },
      quantity: 1,
    },
  ],
  success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
  cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/create`,
  metadata: {
    voicemailId, //prod_TceTPKrPMuN0bw
  },
});
