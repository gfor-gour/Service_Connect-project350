"use client"

import { useState } from "react"
import Image from "next/image"
import { ArrowRight, CheckCircle, Zap, DollarSign, Star, Users, Shield, Clock } from "lucide-react"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"

const Home = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const openDialog = () => setIsDialogOpen(true)
  const closeDialog = () => setIsDialogOpen(false)

  const services = [
    {
      name: "Electricians",
      image: "/electrician.jpeg",
      description: "Expert electricians for all your electrical needs and installations.",
      features: ["24/7 Emergency", "Licensed & Insured", "Free Estimates"],
    },
    {
      name: "Plumbers",
      image: "/plumber.jpeg",
      description: "Professional plumbers for quick and reliable plumbing solutions.",
      features: ["Emergency Service", "Modern Equipment", "Warranty Included"],
    },
    {
      name: "Babysitters",
      image: "/babysitter.jpeg",
      description: "Trusted and background-checked babysitters for your peace of mind.",
      features: ["Background Checked", "CPR Certified", "Flexible Hours"],
    },
    {
      name: "Home Cleaners",
      image: "/cleaner.jpeg",
      description: "Professional cleaning services for a spotless and healthy home.",
      features: ["Eco-Friendly", "Fully Equipped", "Satisfaction Guaranteed"],
    },
  ]

  const features = [
    {
      title: "Verified Professionals",
      description: "All service providers are thoroughly vetted, licensed, and background-checked.",
      icon: Shield,
      color: "text-blue-600",
    },
    {
      title: "Fast Response",
      description: "Get quick responses and same-day service availability for urgent needs.",
      icon: Zap,
      color: "text-yellow-600",
    },
    {
      title: "Transparent Pricing",
      description: "No hidden fees. Get upfront pricing and detailed quotes before work begins.",
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      title: "24/7 Support",
      description: "Round-the-clock customer support to help you whenever you need assistance.",
      icon: Clock,
      color: "text-purple-600",
    },
  ]

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Homeowner",
      content: "Found an amazing electrician through ServiceConnect. Professional, punctual, and reasonably priced!",
      rating: 5,
    },
    {
      name: "Mike Chen",
      role: "Business Owner",
      content: "The plumber fixed our emergency leak within 2 hours. Excellent service and communication.",
      rating: 5,
    },
    {
      name: "Emily Davis",
      role: "Working Parent",
      content: "The babysitter was fantastic with our kids. Background-checked and very reliable.",
      rating: 5,
    },
  ]

  return (
    <>
      <Navbar />

      <main className="bg-white text-gray-800 min-h-screen">
        {/* Hero Section */}
        <section className="relative bg-gray-800 text-white overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800"></div>

          <div className="relative container mx-auto px-6 py-20 lg:py-32">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                Connect with
                <span className="block text-gray-300">Trusted Local Services</span>
              </h1>
              <p className="text-xl md:text-2xl mb-10 text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Discover professional electricians, plumbers, babysitters, and home cleaners in your area. Reliable,
                fast, and trusted services at your fingertips.
              </p>

              {/* Hero Stats */}
              <div className="grid grid-cols-3 gap-8 mb-12 max-w-2xl mx-auto">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">10K+</div>
                  <div className="text-sm text-gray-400">Happy Customers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">500+</div>
                  <div className="text-sm text-gray-400">Service Providers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">4.9★</div>
                  <div className="text-sm text-gray-400">Average Rating</div>
                </div>
              </div>

              {/* CTA Button */}
              <button
                onClick={openDialog}
                className="group inline-flex items-center space-x-3 px-8 py-4 text-lg font-semibold text-gray-800 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <span>Get Started Today</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </section>

        {/* Service Categories */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Our Professional Services</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Choose from our wide range of verified and trusted service providers
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {services.map((service, index) => (
                <div
                  key={index}
                  className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className="relative overflow-hidden">
                    <Image
                      src={service.image || "/placeholder.svg"}
                      alt={service.name}
                      width={400}
                      height={250}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gray-800/20 group-hover:bg-gray-800/10 transition-colors"></div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{service.name}</h3>
                    <p className="text-gray-600 mb-4 text-sm leading-relaxed">{service.description}</p>
                    <ul className="space-y-1">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center text-sm text-gray-500">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Why Choose ServiceConnect?</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                We&apos;re committed to connecting you with the best service providers in your area
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => {
                const IconComponent = feature.icon
                return (
                  <div
                    key={index}
                    className="group text-center bg-gray-50 p-8 rounded-xl hover:bg-white hover:shadow-lg transition-all duration-300"
                  >
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 group-hover:bg-white group-hover:shadow-md transition-all duration-300 mb-6">
                      <IconComponent className={`w-8 h-8 ${feature.color}`} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">What Our Customers Say</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-md">
                  <div className="flex items-center mb-4">
                    {Array.from({ length: testimonial.rating }, (_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4 italic">{`"${testimonial.content}"`}</p>
                  <div>
                    <div className="font-semibold text-gray-800">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 bg-gray-800 text-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Find Your Perfect Service Provider?</h2>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              Join thousands of satisfied customers and book your trusted service provider today.
            </p>
            <button
              onClick={openDialog}
              className="group inline-flex items-center space-x-3 px-8 py-4 text-lg font-semibold text-gray-800 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <span>Start Your Search</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </section>

        {/* Dialog Box */}
        {isDialogOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
              {/* Dialog Header */}
              <div className="bg-gray-800 px-8 py-6 text-center">
                <h2 className="text-2xl font-bold text-white mb-2">Welcome to ServiceConnect!</h2>
                <p className="text-gray-300 text-sm">Choose how you&apos;d like to get started</p>
              </div>

              {/* Dialog Content */}
              <div className="p-8">
                <p className="text-gray-600 mb-8 text-center leading-relaxed">
                  Whether you&apos;re looking for services or offering them, we&apos;re here to help you connect with the right
                  people.
                </p>

                <div className="space-y-4">
                  <button
                    onClick={() => (window.location.href = "/login")}
                    className="w-full flex items-center justify-center space-x-2 px-6 py-4 text-lg font-semibold text-white bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors duration-200"
                  >
                    <span>Sign In</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => (window.location.href = "/signup")}
                    className="w-full flex items-center justify-center space-x-2 px-6 py-4 text-lg font-semibold text-gray-800 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                  >
                    <span>Create Account</span>
                    <Users className="w-5 h-5" />
                  </button>
                </div>

                <button
                  onClick={closeDialog}
                  className="w-full mt-6 px-6 py-3 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                >
                  Maybe Later
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </>
  )
}

export default Home
