import FooterSection from "../landing/FooterSection";
import Link from "next/link";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-primary-50">
      <section className="border-b border-primary-200 bg-linear-to-br from-white to-primary-100 px-6 py-14">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm font-medium text-primary-500">Who We Are</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-primary-900">
            Building trust into every rental decision
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-primary-600">
            Rentiful helps tenants discover quality homes and gives managers the
            tools to manage listings, applications, and approvals from one
            modern dashboard.
          </p>
        </div>
      </section>

      <section className="px-6 py-10">
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
          {[
            {
              title: "Reliable Listings",
              text: "Clear property details, transparent pricing, and practical filters that help people decide faster.",
            },
            {
              title: "Faster Approvals",
              text: "A clean application flow that keeps tenants informed and lets managers review requests quickly.",
            },
            {
              title: "One Unified Platform",
              text: "Search, shortlist, apply, approve, and manage active leases without switching tools.",
            },
          ].map((item) => (
            <article
              key={item.title}
              className="rounded-2xl border border-primary-200 bg-white p-6 shadow-sm"
            >
              <h2 className="text-lg font-semibold text-primary-800">{item.title}</h2>
              <p className="mt-3 text-sm leading-6 text-primary-600">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="px-6 pb-12">
        <div className="mx-auto max-w-5xl rounded-2xl border border-primary-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-primary-800">Our Mission</h2>
          <p className="mt-4 text-base leading-7 text-primary-600">
            We are focused on reducing friction in the rental journey. From map
            discovery to application decisions, every part of Rentiful is built
            to be clear, fast, and useful for both sides of the market.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            <Link href="/contact" className="rounded-lg bg-primary-700 px-4 py-2 font-semibold text-white hover:bg-primary-800">
              Contact Our Team
            </Link>
            <Link href="/faq" className="rounded-lg border border-primary-300 bg-white px-4 py-2 font-semibold text-primary-700 hover:bg-primary-100">
              Read FAQ
            </Link>
          </div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
};

export default AboutPage;
