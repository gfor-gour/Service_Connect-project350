"use client";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Image from "next/image";
import { useState } from "react";

const Home = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const openDialog = () => setIsDialogOpen(true);
  const closeDialog = () => setIsDialogOpen(false);

  return (
    <>
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 min-h-screen">
        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center text-center p-8 md:p-16 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 text-white">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
            Connecting You with Trusted Local Services
          </h1>
          <p className="text-lg md:text-2xl mb-8 max-w-3xl">
            Discover professional electricians, plumbers, babysitters, and home cleaners in your area. Reliable, fast, and trusted services at your fingertips.
          </p>

          {/* Get Started Button */}
          <button
            onClick={openDialog}
            className="px-10 py-5 text-lg font-extrabold text-white bg-black rounded-full shadow-2xl hover:bg-gray-800 transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gray-400"
          >
            Get Started
          </button>
        </section>

        {/* Service Categories */}
        <section className="p-8 md:p-16">
          <h2 className="text-4xl font-bold text-center mb-12 text-indigo-600 dark:text-indigo-400">
            Our Services
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: "Electricians", image: "/electrician.jpeg", description: "Expert electricians for all your electrical needs." },
              { name: "Plumbers", image: "/plumber.jpeg", description: "Professional plumbers for quick and reliable solutions." },
              { name: "Babysitters", image: "/babysitter.jpeg", description: "Trusted babysitters to care for your loved ones." },
              { name: "Home Cleaners", image: "/cleaner.jpeg", description: "Efficient home cleaning services for a spotless home." },
            ].map((service, index) => (
              <div
                key={index}
                className="relative group bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition transform hover:-translate-y-2"
              >
                <Image
                  src={service.image}
                  alt={service.name}
                  width={300}
                  height={200}
                  className="w-full h-64 object-cover opacity-90 group-hover:opacity-100 transition"
                />
                <div className="p-4">
                  <h3 className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
                    {service.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {service.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Dialog Box */}
        {isDialogOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-2xl max-w-md w-full text-center">
              <h2 className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 mb-4">
                Welcome to Our Platform!
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                We're excited to have you here. Whether you're looking for services or offering them, let's get started on your journey!
              </p>
              <div className="flex flex-col gap-4">
                <button
                  onClick={() => (window.location.href = "/login")}
                  className="w-full px-6 py-3 text-lg font-bold text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 transition"
                >
                  Login
                </button>
                <button
                  onClick={() => (window.location.href = "/signup")}
                  className="w-full px-6 py-3 text-lg font-bold text-white bg-purple-600 rounded-lg shadow-md hover:bg-purple-700 transition"
                >
                  Sign Up
                </button>
              </div>
              <button
                onClick={closeDialog}
                className="mt-6 px-6 py-3 text-lg font-bold text-gray-600 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Why Choose Us Section */}
        <section className="p-8 md:p-16 bg-indigo-50 dark:bg-gray-800">
          <h2 className="text-4xl font-bold text-center mb-12 text-indigo-600 dark:text-indigo-400">
            Why Choose Us?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Trusted Professionals",
                description: "All our service providers are verified and highly rated for their expertise.",
                icon: "✓",
              },
              {
                title: "Fast and Reliable",
                description: "Get quick responses and reliable services whenever you need them.",
                icon: "⚡",
              },
              {
                title: "Affordable Pricing",
                description: "Transparent and competitive pricing for all services.",
                icon: "💰",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md hover:shadow-lg transition"
              >
                <div className="text-4xl text-indigo-600 dark:text-indigo-400 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="flex flex-col items-center justify-center text-center p-8 md:p-16 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Ready to Book a Service?
          </h2>
          <p className="text-lg md:text-xl mb-8 max-w-2xl">
            Join thousands of satisfied customers and book your trusted service provider today.
          </p>
          <button
            onClick={openDialog}
            className="px-10 py-5 text-lg font-extrabold text-white bg-blue-600 rounded-full shadow-2xl hover:bg-blue-700 transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-400"
          >
            Explore Services
          </button>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </>
  );
};

export default Home;