import Footer from "../components/Footer";
import Navbar from "../components/Navbar";


const About = () => {
return (
    <>
    {/* Navbar */}
    <Navbar />

    {/* Main Content */}
    <main className="bg-white dark:bg-black text-black dark:text-white min-h-screen">
        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center text-center p-8 md:p-16">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
            About Us
        </h1>
        <p className="text-lg md:text-2xl mb-8 max-w-3xl">
            Our mission is to bridge the gap between customers and local service
            providers by offering a trustworthy and efficient platform. We aim
            to make booking local services seamless and reliable.
        </p>
        </section>

        {/* Values Section */}
        <section className="p-8 md:p-16">
        <h2 className="text-3xl font-bold text-center mb-8">Our Values</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
            {
                title: "Trustworthy",
                description:
                "We ensure that every service provider on our platform is verified and reliable.",
            },
            {
                title: "User-Friendly",
                description:
                "Our platform is designed to make finding and booking services easy for everyone.",
            },
            {
                title: "Innovation",
                description:
                "We leverage cutting-edge AI technology to enhance user experience.",
            },
            ].map((value, index) => (
            <div
                key={index}
                className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-md text-center"
            >
                <h3 className="text-xl font-bold mb-4">{value.title}</h3>
                <p>{value.description}</p>
            </div>
            ))}
        </div>
        </section>

        {/* Team Section */}
        <section className="p-8 md:p-16 bg-gray-50 dark:bg-gray-900">
        <h2 className="text-3xl font-bold text-center mb-8">Meet the Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
            {
                name: "Gour Gupal Talukder Shawon",
                role: "Developer & Co-Founder",
            },
            {
                name: "Amit Sharma",
                role: "Developer & Co-Founder",
            },
            ].map((member, index) => (
            <div
                key={index}
                className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-md text-center"
            >
                <h3 className="text-xl font-bold mb-4">{member.name}</h3>
                <p>{member.role}</p>
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