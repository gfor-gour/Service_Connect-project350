const Footer = () => {
    return (
      <footer className="bg-gray-100 dark:bg-gray-800 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-black dark:text-white">
            © {new Date().getFullYear()} ServiceFinder. All Rights Reserved.
          </p>
          <nav className="mt-4 flex justify-center gap-6 text-sm">
            <a href="/privacy" className="hover:underline text-black dark:text-white">
              Privacy Policy
            </a>
            <a href="/terms" className="hover:underline text-black dark:text-white">
              Terms of Service
            </a>
          </nav>
        </div>
      </footer>
    );
  };
  
  export default Footer;
  