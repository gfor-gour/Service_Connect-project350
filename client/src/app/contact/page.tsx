import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Contact = () => {
  return (
    <>
      <Navbar />

      <main className="bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 min-h-screen">
        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center text-center p-8 md:p-16 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 text-white">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
            Contact Us
          </h1>
          <p className="text-lg md:text-2xl mb-8 max-w-3xl">
            Have questions or need assistance? We're here to help. Reach out to us anytime!
          </p>
        </section>

        {/* Contact Information */}
        <section className="p-8 md:p-16">
          <h2 className="text-4xl font-bold text-center mb-12 text-indigo-600 dark:text-indigo-400">
            Get in Touch
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4">Contact Information</h3>
              <p className="mb-2">📞 Phone: (123) 456-7890</p>
              <p className="mb-2">✉️ Email: info@localservices.com</p>
              <p>🏢 Address: 123 Service St, Hometown, ST 12345</p>
            </div>
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4">Business Hours</h3>
              <p className="mb-2">🕒 Monday - Friday: 9:00 AM - 6:00 PM</p>
              <p>🕒 Saturday - Sunday: 10:00 AM - 4:00 PM</p>
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="p-8 md:p-16 bg-gray-100 dark:bg-gray-800">
          <h2 className="text-4xl font-bold text-center mb-12 text-indigo-600 dark:text-indigo-400">
            Send Us a Message
          </h2>
          <form className="max-w-3xl mx-auto bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2" htmlFor="name">
                Name
              </label>
              <input
                type="text"
                id="name"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                placeholder="Your Name"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                placeholder="Your Email"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2" htmlFor="message">
                Message
              </label>
              <textarea
                id="message"
                rows={4}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                placeholder="Your Message"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full px-6 py-3 text-lg font-bold text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 transition"
            >
              Submit
            </button>
          </form>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Contact;