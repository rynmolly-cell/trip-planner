import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TripProvider } from "./context/TripContext";
import { Planner } from "./pages/Planner";
import { ShareView } from "./pages/ShareView";
import "./styles/theme.css";

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, "") || "/"}>
      <Routes>
        <Route
          path="/"
          element={
            <TripProvider>
              <Planner />
            </TripProvider>
          }
        />
        <Route path="/share/:id" element={<ShareView />} />
      </Routes>
    </BrowserRouter>
  );
}
