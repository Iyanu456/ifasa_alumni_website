import Image from "next/image";
import EventCard from "./components/EventCard";

export default function Home() {
  return (
    <div className="grid bg-[#f5f5f5]">
      <section className="relative grid h-max">
        <Image
          unoptimized
          src={"/Landscape_of_Obafemi_Awolowo_University.png"}
          alt="Landscape_of_Obafemi_Awolowo_University"
          className="w-full h-[75vh] md:max-h-[75vh] object-cover "
          width={1000}
          height={1000}
        />
        <div className="absolute  bg-[#0e00006b] w-full h-full py-[4em]"></div>
        <div className="absolute grid place-items-center w-full h-full">
          <div className="w-[90%] md:w-[80%]">
            <h1 className="text-[2.2em] md:text-[3em] lg:text-[3.5em] xl:text-[4em] font-semibold text-white leading-[1.2em] text-shadow-lg/50 font-montserrat">
              Ife Architecture <br></br>Alumni Association
            </h1>
            <p className="text-gray-100/80 mt-4 mb-3 md:leading-7 text-[0.9em] md:text-lg max-md:mt-5 max-md:mb-3.5">
              A vibrant community of architects, designers, and builders shaping
              the future. <br></br>Are you an alumnus?{" "}
              <span className="font-semibold text-white">
                <br></br>Join the network today.
              </span>
            </p>

            <button className="bg-primary px-9 py-3.5 cursor-pointer text-white rounded-md mt-4 md:text-lg font-medium">
              Join the Network
            </button>
          </div>
        </div>
      </section>

      <section className="w-full h-max my-[3em] ">
        <h1 className="text-center text-2xl font-semibold">Upcoming Events</h1>
        <div className="w-[90%] md:w-[80%] mt-[2em] mx-auto grid md:grid-cols-3  lg:grid-cols-4 gap-[1em]">
          <EventCard />
          <EventCard />
          <EventCard />
          <EventCard />
        </div>
      </section>
    </div>
  );
}
