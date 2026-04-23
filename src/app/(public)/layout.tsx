"use client";

import ChatBox from "@/components/ai/ChatBox";
import { Navbar } from "@/components/Navbar";
import React, { useState } from "react";
import { MessageCircle } from "lucide-react"; // চ্যাট আইকনের জন্য
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";


const Layout = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false); // চ্যাটবক্স খোলা না বন্ধ তা ট্র্যাক করবে

  return (
    <div className="relative min-h-screen">
      <Navbar />
      <main>{children}</main>

      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
        {/* যদি isOpen true হয় তবেই চ্যাটবক্স দেখাবে */}
        {isOpen && <ChatBox onClose={() => setIsOpen(false)} />}

        {/* যদি চ্যাটবক্স বন্ধ থাকে তবে একটি ফ্লোটিং বাটন দেখাবে */}
        {!isOpen && (
          <Button
            onClick={() => setIsOpen(true)}
            size="icon"
            className="w-14 h-14 rounded-full shadow-2xl hover:scale-110 transition-transform"
          >
            <MessageCircle className="w-6 h-6" />
          </Button>
        )}
      </div>
      <footer>
        <Footer></Footer>
      </footer>
    </div>
  );
};

export default Layout;
