"use client"

import { Mail, Phone, MapPin, Clock, MessageCircle, Headphones } from 'lucide-react'
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

const Contact = () => {
  const contactMethods = [
    {
      icon: Phone,
      title: "Phone Support",
      description: "Call us for immediate assistance",
      contact: "+1 (555) 123-4567",
      availability: "24/7 Emergency Support",
      color: "text-blue-600",
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Send us your questions anytime",
      contact: "support@serviceconnect.com",
      availability: "Response within 24 hours",
      color: "text-green-600",
    },
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Chat with our support team",
      contact: "Available on website",
      availability: "Mon-Fri: 9AM-6PM",
      color: "text-purple-600",
    },
  ]

  const officeHours = [
    { day: "Monday - Friday", hours: "9:00 AM - 6:00 PM" },
    { day: "Saturday", hours: "10:00 AM - 4:00 PM" },
    { day: "Sunday", hours: "Emergency Support Only" },
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
                Contact
                <span className="block text-gray-300">Our Support Team</span>
              </h1>
              <p className="text-xl md:text-2xl mb-10 text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Have questions or need assistance? We are here to help you 24/7. Reach out to us through any of our
                support channels.
              </p>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-8 mb-12 max-w-2xl mx-auto">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">24/7</div>
                  <div className="text-sm text-gray-400">Support Available</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">{'<2hrs'}</div>
                  <div className="text-sm text-gray-400">Response Time</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">99%</div>
                  <div className="text-sm text-gray-400">Satisfaction Rate</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Methods */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Get in Touch</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Choose the contact method that works best for you
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {contactMethods.map((method, index) => {
                const IconComponent = method.icon
                return (
                  <div
                    key={index}
                    className="group bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                  >
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 group-hover:bg-white group-hover:shadow-md transition-all duration-300 mb-6">
                        <IconComponent className={`w-8 h-8 ${method.color}`} />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-3">{method.title}</h3>
                      <p className="text-gray-600 mb-4">{method.description}</p>
                      <div className="space-y-2">
                        <p className="font-semibold text-gray-800">{method.contact}</p>
                        <p className="text-sm text-gray-500">{method.availability}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Office Information */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
              {/* Office Details */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-4xl font-bold text-gray-800 mb-6">Visit Our Office</h2>
                  <p className="text-xl text-gray-600 leading-relaxed">
                    Our headquarters is located in the heart of the business district. Feel free to visit us during
                    business hours or schedule an appointment.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <MapPin className="w-6 h-6 text-gray-600 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">Address</h4>
                      <p className="text-gray-600">
                        123 Service Street
                        <br />
                        Business District
                        <br />
                        Hometown, ST 12345
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <Clock className="w-6 h-6 text-gray-600 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-3">Business Hours</h4>
                      <div className="space-y-2">
                        {officeHours.map((schedule, index) => (
                          <div key={index} className="flex justify-between">
                            <span className="text-gray-600">{schedule.day}</span>
                            <span className="font-medium text-gray-800">{schedule.hours}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Support Features */}
              <div className="bg-gray-50 p-8 rounded-xl">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Why Contact Us?</h3>
                <div className="space-y-6">
                  {[
                    {
                      icon: Headphones,
                      title: "Expert Support",
                      description: "Our trained support team is ready to help with any questions or issues.",
                    },
                    {
                      icon: Clock,
                      title: "Quick Response",
                      description: "We pride ourselves on fast response times and efficient problem resolution.",
                    },
                    {
                      icon: MessageCircle,
                      title: "Multiple Channels",
                      description: "Reach us through phone, email, or live chat - whatever works best for you.",
                    },
                  ].map((feature, index) => {
                    const IconComponent = feature.icon
                    return (
                      <div key={index} className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <IconComponent className="w-6 h-6 text-gray-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-1">{feature.title}</h4>
                          <p className="text-gray-600 text-sm">{feature.description}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Quick answers to common questions about our services
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {[
                {
                  question: "How do I book a service?",
                  answer: "Simply browse our services, select a provider, and book through our platform. It's that easy!",
                },
                {
                  question: "Are all providers verified?",
                  answer:
                    "Yes, all our service providers go through a thorough verification process including background checks.",
                },
                {
                  question: "What if I'm not satisfied?",
                  answer:
                    "We offer a satisfaction guarantee. Contact our support team and we'll work to resolve any issues.",
                },
                {
                  question: "How do payments work?",
                  answer:
                    "We offer secure online payments and cash on delivery options for your convenience and security.",
                },
              ].map((faq, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-md">
                  <h4 className="font-semibold text-gray-800 mb-3">{faq.question}</h4>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}

export default Contact
