import ContactClient from "./ContactClient";

export const metadata = {
  title: "Contact — EsportsMice",
  description: "Get in touch with the EsportsMice team. Submit corrections, suggest features, inquire about partnerships, or just say hello.",
  alternates: { canonical: "https://esportsmice.com/contact" },
  openGraph: {
    title: "Contact — EsportsMice",
    description: "Get in touch with the EsportsMice team.",
    url: "https://esportsmice.com/contact",
    images: [{ url: "https://esportsmice.com/og?title=Contact&subtitle=Get+in+Touch", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function ContactPage() {
  return <ContactClient />;
}
