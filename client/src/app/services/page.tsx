"use client";

import React from "react";
import { useRouter } from "next/navigation"; // Use next/navigation instead of next/router
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const services = [
  { name: "Electricians", image: "/electrician.jpeg", category: "electrician" },
  { name: "Plumbers", image: "/plumber.jpeg", category: "plumber" },
  { name: "Babysitters", image: "/babysitter.jpeg", category: "babysitter" },
  { name: "Home Cleaners", image: "/cleaner.jpeg", category: "cleaner" },
];

function ServicesPage() {
  const router = useRouter();

  const handleViewProviders = (category: string) => {
    router.push(`/providers?category=${category}`);
  };

  return (
    <>
      <Navbar />
      {/* Main Content */}
      <main className="bg-white dark:bg-black text-black dark:text-white min-h-screen">
        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center text-center p-8 md:p-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
            Our Services
          </h1>
          <p className="text-lg md:text-2xl mb-8 max-w-3xl">
            Explore our wide range of services and find the perfect provider for your needs.
          </p>
        </section>

        {/* Services Section */}
        <section className="p-8 md:p-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden shadow-md"
              >
                {/* Image Container with Hover Effect */}
                <div className="relative group">
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-full h-64 object-cover opacity-80 group-hover:opacity-100 transition"
                  />
                  <div className="absolute inset-0 bg-black/50 dark:bg-white/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                    <h3 className="text-xl font-bold text-white dark:text-black">
                      {service.name}
                    </h3>
                  </div>
                </div>
                {/* Button Section */}
                <div className="p-4 text-center">
                  <button
                    onClick={() => handleViewProviders(service.category)}
                    className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition"
                  >
                    View Providers
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default ServicesPage;