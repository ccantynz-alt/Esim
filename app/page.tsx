import { Hero } from "@/components/home/Hero";
import {
  TrustBar,
  PopularDestinations,
  HowItWorks,
  WhyUs,
  FinalCta,
} from "@/components/home/sections";
import { Faq } from "@/components/Faq";
import { site } from "@/lib/site";

const homeFaqs = [
  {
    q: "What is an eSIM?",
    a: "An eSIM is a digital SIM card built into your phone. Instead of swapping a plastic chip, you scan a QR code and a local data plan installs in seconds — your home SIM stays in place for calls and texts.",
  },
  {
    q: "Which phones support eSIM?",
    a: "Most phones from 2018 onward: iPhone XS and later, Google Pixel 3 and later, Samsung Galaxy S20 and later, and many more. Check our compatibility page for the full list, or dial *#06# — if you see an EID number, you're ready.",
  },
  {
    q: `How fast do I get my ${site.name} eSIM?`,
    a: "Instantly. The QR code arrives by email within seconds of payment, and you can also retrieve it anytime from your dashboard.",
  },
  {
    q: "Do I keep my WhatsApp and phone number?",
    a: "Yes. Your eSIM only handles data. WhatsApp, iMessage and your regular number keep working exactly as before.",
  },
  {
    q: "What happens if my data runs out?",
    a: "Top up from your dashboard in two taps — no new QR code needed. We'll also email you before you run low.",
  },
  {
    q: "Can I get a refund?",
    a: "If your eSIM can't connect and our support team can't fix it, you get a full refund. Unused, un-activated eSIMs are refundable within 30 days.",
  },
];

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustBar />
      <PopularDestinations />
      <HowItWorks />
      <WhyUs />
      <Faq items={homeFaqs} />
      <FinalCta />
    </>
  );
}
