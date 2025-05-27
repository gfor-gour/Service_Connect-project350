"use client"

import Link from "next/link"
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react"

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center">
              <span className="bg-white text-gray-800 px-3 py-1 rounded-md shadow-md font-bold text-xl">Service</span>
              <span className="ml-2 text-xl font-bold">Connect</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Connecting you with trusted local service providers. Quality services, reliable professionals, seamless
              experience.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors duration-200"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors duration-200"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors duration-200"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors duration-200"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                >
                  Our Services
                </Link>
              </li>
              <li>
                <Link
                  href="/providers"
                  className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                >
                  Become a Provider
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Services</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/services/electrician"
                  className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                >
                  Electricians
                </Link>
              </li>
              <li>
                <Link
                  href="/services/plumber"
                  className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                >
                  Plumbers
                </Link>
              </li>
              <li>
                <Link
                  href="/services/cleaner"
                  className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                >
                  Home Cleaners
                </Link>
              </li>
              <li>
                <Link
                  href="/services/babysitter"
                  className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                >
                  Babysitters
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-gray-300 text-sm">support@serviceconnect.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-gray-300 text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                <span className="text-gray-300 text-sm">
                  123 Service Street
                  <br />
                  Business District
                  <br />
                  City, State 12345
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-700">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-400">© {new Date().getFullYear()} ServiceConnect. All Rights Reserved.</p>
            <nav className="flex flex-wrap justify-center md:justify-end gap-6 text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors duration-200">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors duration-200">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-gray-400 hover:text-white transition-colors duration-200">
                Cookie Policy
              </Link>
              <Link href="/support" className="text-gray-400 hover:text-white transition-colors duration-200">
                Support
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
