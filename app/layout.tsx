import "./globals.css";
import { Inter } from "next/font/google";
import AdminNotificationWrapper from "@/app/admin/layout"; // If you used this previously
import { getServerSession } from "next-auth"; // ✅ Import this
import SessionProvider from "@/components/SessionProvider"; // ✅ We will create this next

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "SaSia Studio",
  description: "Creative Studio Management",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(); // ✅ Get server session

  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Wrap everything in the Provider */}
        <SessionProvider session={session}>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}