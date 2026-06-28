import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", "font-sans")}
    >
      <body>
        <ThemeProvider>
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
export const metadata = {
  title: "Church Elder Dashboard",
}

export default function ElderLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
