import Footer from "@/components/ui/Footer";
import Navbar from "@/components/ui/Navbar";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <Navbar />
      </header>

      {/* Main content */}
      <main className="flex-grow w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="w-full max-w-screen">
        <Footer />
      </footer>
    </div>
  );
};

export default MainLayout;
