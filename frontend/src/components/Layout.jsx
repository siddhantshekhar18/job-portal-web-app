import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";

import Navbar from "./Navbar";
import Footer from "./Footer";

function Layout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  return (
    <>
      <Navbar />

      <main>
        <Outlet />
      </main>

      <Footer />
    </>
  );
}

export default Layout;
