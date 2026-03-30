const CookiesPage = () => {
  return (
    <main className="mx-auto max-w-4xl px-6 py-14">
      <h1 className="text-3xl font-bold text-primary-800">Cookie Policy</h1>
      <p className="mt-3 text-primary-600">
        This Cookie Policy explains how Rentiful uses cookies and similar
        technologies to improve your browsing experience.
      </p>

      <section className="mt-8 space-y-6 text-primary-700">
        <div>
          <h2 className="text-xl font-semibold text-primary-800">
            What Cookies We Use
          </h2>
          <p className="mt-2">
            We use essential cookies for authentication and session management,
            and performance cookies to understand how pages are used.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-primary-800">
            Why We Use Cookies
          </h2>
          <p className="mt-2">
            Cookies help keep you signed in, remember preferences, and improve
            the reliability and performance of our services.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-primary-800">
            Managing Cookies
          </h2>
          <p className="mt-2">
            You can control cookies through browser settings. Disabling certain
            cookies may affect key app functionality.
          </p>
        </div>
      </section>
    </main>
  );
};

export default CookiesPage;
