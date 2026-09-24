import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import RoutePlannerPage from "./pages/RoutePlannerPage";
import TrafficAnalytics from "./pages/TrafficAnalytics";
import Bottlenecks from "./pages/Bottlenecks";
import SignalOptimization from "./pages/SignalOptimization";
import Sustainability from "./pages/Sustainability";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Main Dashboard */}
                <Route path="/" element={<Dashboard />} />

                {/* Route Intelligence */}
                <Route
                    path="/route-planner"
                    element={<RoutePlannerPage />}
                />

                {/* Traffic Analysis */}
                <Route
                    path="/traffic-analytics"
                    element={<TrafficAnalytics />}
                />

                {/* AI Bottleneck Detection */}
                <Route
                    path="/bottlenecks"
                    element={<Bottlenecks />}
                />

                {/* Dynamic Signal Optimization */}
                <Route
                    path="/signal-optimization"
                    element={<SignalOptimization />}
                />

                {/* Sustainability */}
                <Route
                    path="/sustainability"
                    element={<Sustainability />}
                />

                {/* Unknown URL → Dashboard */}
                <Route
                    path="*"
                    element={<Navigate to="/" replace />}
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;