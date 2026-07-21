import FooterSection from "../landing/FooterSection";

const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-primary-50">
      <section className="border-b border-primary-200 bg-linear-to-br from-white to-primary-100 px-6 py-14">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm font-medium text-primary-500">Legal</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-primary-900">
            Privacy Policy
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-primary-600">
            This policy describes what personal information we collect, why we
            collect it, and how we protect it.
          </p>
        </div>
      </section>

      <section className="px-6 py-10">
        <div className="mx-auto max-w-5xl space-y-5 text-primary-700">
          {[
            {
              title: "Information We Collect",
              text: "We collect account details, profile information, property interactions, and application data required to operate core rental features.",
            },
            {
              title: "How We Use Data",
              text: "Data is used to deliver platform functions, process applications, improve search relevance, and support account and service communication.",
            },
            {
              title: "Data Sharing",
              text: "We do not sell personal information. Data may be shared with trusted infrastructure providers solely to operate and secure the service.",
            },
            {
              title: "Your Rights and Choices",
              text: "You can update profile details in dashboard settings and request account deletion directly from the app.",
            },
          ].map((section) => (
            <article
              key={section.title}
              className="rounded-xl border border-primary-200 bg-white p-6 shadow-sm"
            >
              <h2 className="text-xl font-semibold text-primary-800">
                {section.title}
              </h2>
              <p className="mt-3 leading-7 text-primary-600">{section.text}</p>
            </article>
          ))}
        </div>
      </section>

      <FooterSection />
    </div>
  );
};

export default PrivacyPage;
