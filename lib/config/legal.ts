export interface LegalSection {
  title: string;
  body: string[];
}

export interface LegalDoc {
  heading: string;
  lastUpdated: string;
  intro?: string[];
  sections: LegalSection[];
}

export const TERMS_DOC: LegalDoc = {
  heading: "Terms of Service",
  lastUpdated: "August 25, 2026",
  intro: [
    "UT Autos is a concierge booking platform for mobile detailing of ultra-luxury cars and private jets. By using UT Autos, you agree to these Terms.",
  ],
  sections: [
    {
      title: "1. The service",
      body: [
        "Customers browse a curated fleet, build a personal garage, and book detailing services performed by independent detailers. UT Autos is provided \"AS IS\" and \"AS AVAILABLE,\" without warranties of any kind, express or implied, including merchantability, fitness for a particular purpose, and non-infringement.",
      ],
    },
    {
      title: "2. Bookings and deposits",
      body: [
        "Booking a service requires a deposit (currently 10%) to mobilize a detailer, processed via Stripe, Paystack, PayPal, Apple Pay, or bank transfer, depending on what's enabled. Deposits, cancellation terms, and refund eligibility are shown at checkout and are binding once a booking is confirmed.",
      ],
    },
    {
      title: "3. Detailers are independent",
      body: [
        "Detailing services are performed by independent detailers, not UT Autos employees. UT Autos facilitates the booking and payment but is not the service provider. UT Autos is not liable for the quality of detailing work, for damage caused by a detailer, or for disputes between a customer and a detailer, beyond what's stated in any applicable service guarantee communicated at booking.",
      ],
    },
    {
      title: "4. Vehicle/aircraft liability",
      body: [
        "Customers are responsible for accurately describing the vehicle/aircraft and any special handling requirements. UT Autos and its detailers are not liable for pre-existing damage, and any damage claim arising from a service must be reported within 48 hours of service completion.",
      ],
    },
    {
      title: "5. Accounts",
      body: ["You're responsible for your account credentials and activity under your account."],
    },
    {
      title: "6. Limitation of liability",
      body: [
        "To the maximum extent permitted by law, UT Autos's liability is capped at the amount paid for the specific booking giving rise to a claim. UT Autos is not liable for indirect, incidental, or consequential damages.",
      ],
    },
    {
      title: "7. Prohibited use",
      body: ["No fraudulent payment activity, no abuse of detailers or staff, no attempts to break or reverse-engineer the platform."],
    },
    {
      title: "8. Termination",
      body: ["We may suspend or cancel bookings/accounts for violations of these Terms, fraud, or abuse."],
    },
    {
      title: "9. Governing law",
      body: ["These Terms are governed by the laws of Nigeria."],
    },
    {
      title: "10. Contact",
      body: ["Budoessien2331@outlook.com"],
    },
  ],
};

export const PRIVACY_DOC: LegalDoc = {
  heading: "Privacy Policy",
  lastUpdated: "August 25, 2026",
  sections: [
    {
      title: "What we collect",
      body: [
        "Account info: name, email, phone (via Supabase Auth).",
        "Booking details: vehicle/aircraft info, service address, appointment times.",
        "Payment info: handled directly by Stripe/Paystack/PayPal/Apple Pay — UT Autos does not store your card or bank details itself.",
      ],
    },
    {
      title: "Why we collect it",
      body: ["To create your account, process bookings, dispatch detailers, and handle payments."],
    },
    {
      title: "Who we share it with",
      body: [
        "Supabase — database, auth, and row-level security provider.",
        "Payment processors (Stripe, Paystack, PayPal) — only the data needed to process your payment; see their respective privacy policies.",
        "Assigned detailer — your service address and vehicle/aircraft details, so they can perform the booked service.",
        "We do not sell your personal data.",
      ],
    },
    {
      title: "Your rights (Nigeria Data Protection Act 2023)",
      body: [
        "You can request access to, correction of, or deletion of your data at any time by contacting us below. Some booking/payment records may be retained as required for tax or dispute-resolution purposes even after a deletion request.",
      ],
    },
    {
      title: "Security",
      body: ["Data is stored in Supabase with row-level security; payments are handled by PCI-compliant third-party processors, not stored on our servers."],
    },
    {
      title: "Contact",
      body: ["Budoessien2331@outlook.com"],
    },
  ],
};
