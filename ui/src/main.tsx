import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter, Route, Routes } from "react-router"

import "./index.css"
import { ThemeProvider } from "@/components/theme-provider.tsx"
import { PacketViewer } from "./components/PacketViewer.tsx"
import Navbar from "./components/Navbar.tsx"
import Home from "./components/Home.tsx"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="viewer" element={<PacketViewer />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
)
