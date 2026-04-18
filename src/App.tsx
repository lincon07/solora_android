import "./App.css"

import Layout from "./layout"
import { Routes, Route } from "react-router-dom"

import { OnboardingWizard } from "./app/(onboard)/onboard-wizzard"
import { Settings } from "./app/(settings)/settings"
import { CalendarPage } from "./app/(calendar)/calendar"
import { HomePage } from "./app/(home)/home"
import { ListsPage } from "./app/(lists)/lists"
import { MealPlanner } from "./app/(meals)/meals"

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage  />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/lists" element={<ListsPage   />} />
        <Route path="/meals" element={<MealPlanner   />} />
        <Route path="/onboard-wizzard" element={<OnboardingWizard />} />
      </Routes>
    </Layout>
  )
}

export default App
