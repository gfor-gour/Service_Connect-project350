import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Image from "next/image";
import Homepage from "./Homepage/homepage";

const Home = () => {
  return (
    <>
      {/* Navbar */}
      <Navbar />
      
      {/* Main Content */}
      <Homepage/>

      {/* Footer */}
      <Footer />
    </>
  );
};

export default Home;
