import FooterSection from "../landing/FooterSection";

const faqs = [
  {
    q: "How do I apply for a property?",
    a: "Open a property page, click apply, complete the form, and submit your application.",
  },
  {
    q: "How can managers approve applications?",
    a: "Go to the manager dashboard applications tab and update the status to Approved or Denied.",
  },
  {
    q: "Can I save favorite properties?",
    a: "Yes, tenants can add properties to favorites and view them from the dashboard.",
  },
  {
    q: "Why is my map location incorrect?",
    a: "Ensure full address details are entered while creating a property for better geocoding accuracy.",
  },
];

const FaqPage = () => {
  return (
    <div className="min-h-screen bg-primary-50">
      <section className="border-b border-primary-200 bg-linear-to-br from-white to-primary-100 px-6 py-14">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm font-medium text-primary-500">Help Center</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-primary-900">Frequently Asked Questions</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-primary-600">
            Find answers for listings, map behavior, applications, and approvals.
          </p>
        </div>
      </section>

      <section className="px-6 py-10">
        <div className="mx-auto max-w-5xl space-y-4">
          {faqs.map((faq) => (
            <article key={faq.q} className="rounded-xl border border-primary-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-primary-800">{faq.q}</h2>
              <p className="mt-2 leading-7 text-primary-600">{faq.a}</p>
            </article>
          ))}
        </div>
      </section>

      <FooterSection />
    </div>
  );
};

export default FaqPage;
