"use client"

import { Target, Heart, Lightbulb, Award, Shield } from "lucide-react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

const About = () => {
  const values = [
    {
      icon: Shield,
      title: "Trust & Reliability",
      description: "We ensure every service provider is verified, licensed, and trustworthy for your peace of mind.",
      color: "text-blue-600",
    },
    {
      icon: Heart,
      title: "Customer-Centric",
      description: "Your satisfaction is our top priority. We're committed to delivering exceptional experiences.",
      color: "text-red-600",
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "Leveraging cutting-edge technology to enhance your service booking and management experience.",
      color: "text-yellow-600",
    },
  ]

  const teamMembers = [
    {
      name: "Gour Gupal Talukder Shawon",
      role: "Developer & Co-Founder",
      institution: "SWE, SUST",
      description: "Passionate about creating seamless user experiences and building scalable platforms.",
    },
    {
      name: "Amit Sharma",
      role: "Developer & Co-Founder",
      institution: "SWE, SUST",
      description: "Expert in backend development and system architecture with a focus on reliability.",
    },
  ]

  const achievements = [
    { number: "10K+", label: "Happy Customers" },
    { number: "500+", label: "Verified Providers" },
    { number: "50+", label: "Cities Covered" },
    { number: "4.9★", label: "Average Rating" },
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
                About
                <span className="block text-gray-300">ServiceConnect</span>
              </h1>
              <p className="text-xl md:text-2xl mb-10 text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Empowering communities by connecting customers with trusted local service providers. Our mission is to
                make your life easier, one service at a time.
              </p>

              {/* Achievement Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12 max-w-3xl mx-auto">
                {achievements.map((achievement, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl font-bold text-white">{achievement.number}</div>
                    <div className="text-sm text-gray-400">{achievement.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-800 mb-8">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">Our Mission</h2>
              <p className="text-xl text-gray-600 leading-relaxed mb-8">
                At ServiceConnect, we aim to bridge the gap between customers and local service providers by offering a
                seamless, reliable, and efficient platform. Whether you need a quick fix or long-term assistance, we&apos;re
                here to help you connect with the right professionals.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-800 mb-2">Simplicity</div>
                  <p className="text-gray-600">Easy-to-use platform for booking services</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-800 mb-2">Quality</div>
                  <p className="text-gray-600">Only verified and trusted service providers</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-800 mb-2">Community</div>
                  <p className="text-gray-600">Supporting local businesses and professionals</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Our Core Values</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                The principles that guide everything we do and shape our company culture
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {values.map((value, index) => {
                const IconComponent = value.icon
                return (
                  <div
                    key={index}
                    className="group text-center bg-gray-50 p-8 rounded-xl hover:bg-white hover:shadow-lg transition-all duration-300"
                  >
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 group-hover:bg-white group-hover:shadow-md transition-all duration-300 mb-6">
                      <IconComponent className={`w-8 h-8 ${value.color}`} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-3">{value.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{value.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Meet Our Team</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                The passionate individuals behind ServiceConnect who are dedicated to your success
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {teamMembers.map((member, index) => (
                <div
                  key={index}
                  className="group bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                      <span className="text-2xl font-bold text-white">{member.name.charAt(0)}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{member.name}</h3>
                    <p className="text-gray-600 font-medium mb-1">{member.role}</p>
                    <p className="text-sm text-gray-500 mb-4">{member.institution}</p>
                    <p className="text-gray-600 text-sm leading-relaxed">{member.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Company Story */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Our Story</h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <p className="text-lg text-gray-600 leading-relaxed">
                    ServiceConnect was born from a simple observation: finding reliable local service providers
                    shouldn&apos;t be a hassle. As students at SUST, we experienced firsthand the challenges of connecting
                    with trustworthy professionals for everyday needs.
                  </p>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    We decided to build a platform that would solve this problem not just for us, but for entire
                    communities. Today, ServiceConnect serves thousands of customers and hundreds of service providers,
                    creating meaningful connections and supporting local economies.
                  </p>
                </div>

                <div className="bg-gray-50 p-8 rounded-xl">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">What Sets Us Apart</h3>
                  <div className="space-y-4">
                    {[
                      "Rigorous provider verification process",
                      "24/7 customer support",
                      "Transparent pricing with no hidden fees",
                      "Local community focus",
                      "Technology-driven solutions",
                    ].map((feature, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <Award className="w-5 h-5 text-green-600" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}

export default About
