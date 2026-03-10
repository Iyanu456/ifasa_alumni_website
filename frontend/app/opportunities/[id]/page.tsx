import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin, Building } from "lucide-react";

export default function OpportunityDetailsPage() {
  const opportunity = {
    title: "Junior Architect",
    organization: "Studio Nexus",
    category: "Job",
    location: "Lagos, Nigeria",
    deadline: "December 20, 2026",
    image: "https://picsum.photos/seed/opportunity/1200/700",
    description: `
Studio Nexus is looking for a motivated Junior Architect to join our design team. 
The successful candidate will support senior architects in design development,
documentation, and project coordination.

Responsibilities include assisting in conceptual design, preparing drawings, 
creating presentations, and supporting project delivery.
    `,
    requirements: [
      "Bachelor's degree in Architecture",
      "Strong proficiency in Revit or AutoCAD",
      "Good visualization and presentation skills",
      "Strong communication skills",
    ],
    link: "#",
  };

  return (
    <main className=" min-h-screen pt-[6em] pb-[4em]">
      <section className="w-[92%] sm:w-[90%] md:w-[70%] mx-auto">

        {/* Image */}
        {opportunity.image && (
          <div className="relative w-full h-[250px] sm:h-[320px] md:h-[380px] rounded-xl overflow-hidden mb-6">
            <Image
              src={opportunity.image}
              alt={opportunity.title}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        )}

        {/* Header */}
        <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded-full">
          {opportunity.category}
        </span>

        <h1 className="text-2xl sm:text-3xl font-semibold mt-2 mb-2">
          {opportunity.title}
        </h1>

        <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
          <span className="flex items-center gap-1">
            <Building size={16} /> {opportunity.organization}
          </span>

          {opportunity.location && (
            <span className="flex items-center gap-1">
              <MapPin size={16} /> {opportunity.location}
            </span>
          )}

          {opportunity.deadline && (
            <span className="flex items-center gap-1">
              <Calendar size={16} /> Deadline: {opportunity.deadline}
            </span>
          )}
        </div>

        <hr className="border-gray-300 md:mt-[4em]" />

        {/* Description */}
        <div className=" py-6 mb-6">
          <h2 className="font-semibold text-lg md:text-xl mb-2.5">Description</h2>
          <p className="text-gray-600 leading-relaxed ">
            {opportunity.description}
          </p>
        </div>

        <hr className="border-gray-300" />

        {/* Requirements */}
        <div className="py-6 mb-6">
          <h2 className="font-semibold mb-2.5 text-lg md:text-xl">Requirements</h2>

          <ul className="list-disc list-inside text-gray-600 space-y-2">
            {opportunity.requirements.map((req) => (
              <li key={req}>{req}</li>
            ))}
          </ul>
        </div>

        {/* Apply */}
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href={opportunity.link}
            target="_blank"
            className="bg-primary text-white px-6 py-3 rounded-full font-medium text-center hover:opacity-90 transition"
          >
            Apply Now
          </a>

          <Link
            href="/opportunities"
            className="border border-gray-300 px-6 py-3 rounded-full font-medium text-center hover:bg-gray-50 transition"
          >
            Back to opportunities
          </Link>
        </div>
      </section>
    </main>
  );
}