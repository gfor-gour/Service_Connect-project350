import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const About = () => {
  return (
    <>
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 min-h-screen">
        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center text-center p-8 md:p-16 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 text-white">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
            About Us
          </h1>
          <p className="text-lg md:text-2xl mb-8 max-w-3xl">
            Empowering communities by connecting customers with trusted local service providers. Our mission is to make your life easier, one service at a time.
          </p>
        </section>

        {/* Mission Section */}
        <section className="p-8 md:p-16">
          <h2 className="text-4xl font-bold text-center mb-12 text-indigo-600 dark:text-indigo-400">
            Our Mission
          </h2>
          <p className="text-lg md:text-xl text-center max-w-4xl mx-auto mb-8">
            At Service Connect, we aim to bridge the gap between customers and local service providers by offering a seamless, reliable, and efficient platform. Whether you need a quick fix or long-term assistance, we are here to help.
          </p>
        </section>

        {/* Values Section */}
        <section className="p-8 md:p-16 bg-gray-100 dark:bg-gray-800">
          <h2 className="text-4xl font-bold text-center mb-12 text-indigo-600 dark:text-indigo-400">
            Our Core Values
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Trust & Reliability",
                description: "We ensure every service provider is verified and trustworthy.",
              },
              {
                title: "Customer-Centric",
                description: "Your satisfaction is our top priority. We are here to serve you.",
              },
              {
                title: "Innovation",
                description: "Leveraging cutting-edge technology to enhance your experience.",
              },
            ].map((value, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md text-center"
              >
                <h3 className="text-xl font-bold mb-4">{value.title}</h3>
                <p>{value.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Team Section */}
        <section className="p-8 md:p-16">
          <h2 className="text-4xl font-bold text-center mb-12 text-indigo-600 dark:text-indigo-400">
            Meet Our Team
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                name: "Gour Gupal Talukder Shawon",
                role: "Developer & Co-Founder",
                institution: "SWE, SUST",
              },
              {
                name: "Amit Sharma",
                role: "Developer & Co-Founder",
                institution: "SWE, SUST",
              },
            ].map((member, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md text-center border-4 border-transparent hover:border-indigo-600 dark:hover:border-purple-600 transition-transform transform hover:scale-105"
              >
                <h3 className="text-xl font-bold mb-2">{member.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                  {member.role}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {member.institution}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </>
  );
};

export default About;