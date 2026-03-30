import FooterSection from "../landing/FooterSection";
import Link from "next/link";

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-primary-50">
      <section className="border-b border-primary-200 bg-linear-to-br from-white to-primary-100 px-6 py-14">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm font-medium text-primary-500">Support</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-primary-900">
            Contact the Rentiful team
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-primary-600">
            We are here to help with listings, applications, account issues,
            and platform questions.
          </p>
        </div>
      </section>

      <section className="px-6 py-10">
        <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-3">
          <article className="rounded-2xl border border-primary-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-primary-800">General Support</h2>
            <p className="mt-2 text-sm text-primary-600">support@rentiful.com</p>
          </article>
          <article className="rounded-2xl border border-primary-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-primary-800">Call Us</h2>
            <p className="mt-2 text-sm text-primary-600">+1 (555) 555-1212</p>
          </article>
          <article className="rounded-2xl border border-primary-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-primary-800">Working Hours</h2>
            <p className="mt-2 text-sm text-primary-600">Mon - Fri, 9:00 AM - 6:00 PM</p>
          </article>
        </div>
      </section>

      <section className="px-6 pb-12">
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-primary-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-primary-800">Send a message</h2>
            <form className="mt-5 space-y-4">
              <input
                type="text"
                placeholder="Your name"
                className="w-full rounded-lg border border-primary-300 px-3 py-2 outline-none focus:border-primary-500"
              />
              <input
                type="email"
                placeholder="Your email"
                className="w-full rounded-lg border border-primary-300 px-3 py-2 outline-none focus:border-primary-500"
              />
              <textarea
                placeholder="How can we help?"
                rows={5}
                className="w-full rounded-lg border border-primary-300 px-3 py-2 outline-none focus:border-primary-500"
              />
              <button
                type="button"
                className="w-full rounded-lg bg-primary-700 px-4 py-2 font-semibold text-white hover:bg-primary-800"
              >
                Send Message
              </button>
            </form>
          </div>

          <div className="rounded-2xl border border-primary-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-primary-800">Need quick answers?</h2>
            <p className="mt-3 text-primary-600">
              Visit our FAQ for common questions about account setup, rental
              applications, approvals, and dashboard features.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/faq" className="rounded-lg bg-primary-700 px-4 py-2 font-semibold text-white hover:bg-primary-800">
                Open FAQ
              </Link>
              <Link href="/terms" className="rounded-lg border border-primary-300 bg-white px-4 py-2 font-semibold text-primary-700 hover:bg-primary-100">
                View Terms
              </Link>
            </div>
          </div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
};

export default ContactPage;
