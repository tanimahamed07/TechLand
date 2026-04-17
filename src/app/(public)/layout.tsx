import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import React from "react";
import AiChatButton from "@/components/shared/AiChatButton";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Navbar></Navbar>
      {children}
      <AiChatButton></AiChatButton>
      <Footer></Footer>
    </div>
  );
};

export default Layout;