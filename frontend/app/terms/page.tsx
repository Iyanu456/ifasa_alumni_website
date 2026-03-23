"use client";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#f8f8f8] pb-[5em] pt-[6em]">
      <section className="mx-auto w-[92%] max-w-4xl rounded-3xl border border-gray-100 bg-white p-8 sm:w-[90%]">
        <h1 className="text-3xl font-semibold text-gray-900">Terms of Use</h1>
        <p className="mt-4 text-sm leading-7 text-gray-600">
          By using the IFASA Alumni platform, you agree to provide accurate
          information, keep your account secure, and use the directory, news,
          events, and opportunities features responsibly.
        </p>
        <p className="mt-4 text-sm leading-7 text-gray-600">
          Administrative tools are reserved for authorized association officers.
          Unauthorized access, misuse of alumni information, spam, or abusive
          conduct may result in account suspension or removal.
        </p>
        <p className="mt-4 text-sm leading-7 text-gray-600">
          Content submitted to the platform, including profile data, event
          listings, news, and gallery uploads, must be lawful, accurate, and
          appropriate for the association community.
        </p>
      </section>
    </main>
  );
}
