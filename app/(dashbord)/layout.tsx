import Navbar from "@/components/navbar";
import BottomBar from "@/components/ui/buttombar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Be Present ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      <Navbar />
      <div className=" mt-[65px]">
      {children}
      </div>
       <BottomBar />
    </main>

  );
}
