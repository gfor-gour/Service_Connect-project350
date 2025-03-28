import Image from "next/image";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Contact = () => {
    return (
        <>
        <Navbar/>

        <main className="bg-white dark:bg-black text-black dark:text-white min-h-screen">
            {/* Contact Section */}
            <section className="flex flex-col items-center justify-center text-center p-8 md:p-16">
                <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
                    Get in Touch with Us
                </h1>
                <p className="text-lg md:text-2xl mb-8 max-w-2xl">
                    We are here to help you with any questions or concerns you may have.
                </p>
                
                <div className="mb-8">
                    <h2 className="text-2xl font-semibold mb-2">Contact Information</h2>
                    <p className="text-lg">📞 Phone: (123) 456-7890</p>
                    <p className="text-lg">✉️ Email: info@localservices.com</p>
                    <p className="text-lg">🏢 Address: 123 Service St, Hometown, ST 12345</p>
                </div>

                <button className="px-6 py-3 bg-black text-white dark:bg-white dark:text-black hover:opacity-90 transition rounded">
                    Send Us a Message
                </button>
            </section>
        </main>
        <Footer/>
        </>
    );
};

export default Contact;