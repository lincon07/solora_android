import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import App from "./App"

import { ApiHealthProvider } from "@/providers/api-health"
import { ApiDisconnectedOverlay } from "@/components/ui/api-disconnected-overlay"
import { AppBootstrap } from "./components/ui/bootstrap/app-bootstrap"
import { ThemeProvider } from "./providers/theme"
import { HubProvider } from "./providers/hub"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <ApiHealthProvider intervalMs={5000}>
        <AppBootstrap>
          <ApiDisconnectedOverlay />
          <HubProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </HubProvider>
        </AppBootstrap>
      </ApiHealthProvider>
    </ThemeProvider>
  </React.StrictMode>
)
