import FooterSection from "../landing/FooterSection";

const TermsPage = () => {
  return (
    <div className="min-h-screen bg-primary-50">
      <section className="border-b border-primary-200 bg-linear-to-br from-white to-primary-100 px-6 py-14">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm font-medium text-primary-500">Legal</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-primary-900">Terms of Service</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-primary-600">
            These terms govern your use of Rentiful. By accessing the platform,
            you agree to follow the rules below.
          </p>
        </div>
      </section>

      <section className="px-6 py-10">
        <div className="mx-auto max-w-5xl space-y-5">
          {[
            {
              title: "Account Responsibilities",
              text: "You are responsible for account security and for ensuring profile information is accurate and up to date.",
            },
            {
              title: "Listing and Application Accuracy",
              text: "Users must not provide false, misleading, or fraudulent information in listings, profiles, or rental applications.",
            },
            {
              title: "Acceptable Use",
              text: "You agree not to misuse the platform, interfere with normal operations, or violate local housing and rental laws.",
            },
            {
              title: "Service Changes",
              text: "Features may be updated to improve quality, security, and reliability. We may modify or discontinue features with notice.",
            },
          ].map((section) => (
            <article key={section.title} className="rounded-xl border border-primary-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-primary-800">{section.title}</h2>
              <p className="mt-3 leading-7 text-primary-600">{section.text}</p>
            </article>
          ))}
        </div>
      </section>

      <FooterSection />
    </div>
  );
};

export default TermsPage;
