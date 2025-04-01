import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Image from "next/image";
import Link from "next/link";

const Home = () => {
  return (
    <>
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="bg-white dark:bg-black text-black dark:text-white min-h-screen">
        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center text-center p-8 md:p-16 bg-black text-white dark:bg-black dark:text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
            Find Trusted Local Services
          </h1>
          <p className="text-lg md:text-2xl mb-8 max-w-2xl">
            Connecting you with professional electricians, plumbers,
            babysitters, and more!
          </p>
          <button className="px-6 py-3 border-2 border-violet-600 text-white dark:text-black dark:bg-black bg-violet-600 hover:opacity-90 transition rounded">
            Explore Services
          </button>
        </section>

        {/* Service Categories */}
        <section className="p-8 md:p-16">
          <h2 className="text-3xl font-bold text-center mb-8 text-violet-600 dark:text-violet-600">
            Our Services
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: "Electricians", image: "/electrician.jpeg" },
              { name: "Plumbers", image: "/plumber.jpeg" },
              { name: "Babysitters", image: "/babysitter.jpeg" },
              { name: "Home Cleaners", image: "/cleaner.jpeg" },
            ].map((service, index) => (
              <div
                key={index}
                className="relative group bg-violet-100 dark:bg-violet-800 rounded-lg overflow-hidden shadow-md"
              >
                <Image
                  src={service.image}
                  alt={service.name}
                  width={300}
                  height={200}
                  className="w-full h-64 object-cover opacity-80 group-hover:opacity-100 transition"
                />
                <div className="absolute inset-0 bg-black/50 dark:bg-white/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                  <h3 className="text-xl font-bold text-white dark:text-black">
                    {service.name}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="flex flex-col items-center justify-center text-center p-8 md:p-16 bg-black text-white dark:bg-black dark:text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
            Ready to Book a Service?
          </h2>
          <p className="text-lg md:text-xl mb-8 max-w-2xl">
            Discover trusted professionals in your area today!
          </p>

          <button className="px-6 py-3 border-2 border-violet-600 text-white dark:text-black dark:bg-black bg-violet-600 hover:opacity-90 transition rounded">
            <Link href="/login">Get Started</Link>
          </button>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </>
  );
};

export default Home;
