"use client";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#f8f8f8] pb-[5em] pt-[6em]">
      <section className="mx-auto w-[92%] max-w-4xl rounded-3xl border border-gray-100 bg-white p-8 sm:w-[90%]">
        <h1 className="text-3xl font-semibold text-gray-900">Privacy Policy</h1>
        <p className="mt-4 text-sm leading-7 text-gray-600">
          IFASA Alumni collects the information you provide during registration,
          profile completion, donations, and contact requests so we can operate
          the alumni platform, maintain the community directory, and communicate
          relevant updates.
        </p>
        <p className="mt-4 text-sm leading-7 text-gray-600">
          Personal information is used only for alumni engagement, platform
          administration, security, and records management. We do not sell your
          data. Information may be shared with trusted service providers only
          when required to deliver platform features such as email delivery,
          authentication, or file storage.
        </p>
        <p className="mt-4 text-sm leading-7 text-gray-600">
          You may request corrections to your profile information by signing in
          and updating your account, or by contacting the association through the
          official contact channels listed on this site.
        </p>
      </section>
    </main>
  );
}
