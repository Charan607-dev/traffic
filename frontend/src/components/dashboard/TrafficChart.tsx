import {
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

import { trafficRecords } from "../../data/demoTrafficData";

function TrafficChart() {
    const chartData = trafficRecords.map((record) => ({
        time: record.timestamp.slice(11, 16),
        vehicles: record.vehicleCount,
        speed: record.avgSpeed,
        congestion: record.congestionIndex,
    }));

    return (
        <div className="rounded-2xl border border-gray-800 bg-gray-900 p-5">
            {/* Header */}
            <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                    <h3 className="text-base font-semibold text-white">
                        Traffic Flow Analysis
                    </h3>

                    <p className="mt-1 text-xs text-gray-500">
                        Vehicle count and congestion trends
                    </p>
                </div>

                <div className="flex flex-wrap gap-4 text-xs">
                    <div className="flex items-center gap-2 text-gray-400">
                        <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                        Vehicles
                    </div>

                    <div className="flex items-center gap-2 text-gray-400">
                        <span className="h-2.5 w-2.5 rounded-full bg-orange-500" />
                        Congestion
                    </div>

                    <div className="flex items-center gap-2 text-gray-400">
                        <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
                        Speed
                    </div>
                </div>
            </div>

            {/* Chart */}
            <div className="h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={chartData}
                        margin={{
                            top: 10,
                            right: 10,
                            left: -20,
                            bottom: 0,
                        }}
                    >
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#1f2937"
                        />

                        <XAxis
                            dataKey="time"
                            stroke="#6b7280"
                            tick={{ fill: "#9ca3af", fontSize: 11 }}
                            axisLine={false}
                            tickLine={false}
                        />

                        <YAxis
                            stroke="#6b7280"
                            tick={{ fill: "#9ca3af", fontSize: 11 }}
                            axisLine={false}
                            tickLine={false}
                        />

                        <Tooltip
                            contentStyle={{
                                backgroundColor: "#111827",
                                border: "1px solid #374151",
                                borderRadius: "12px",
                                color: "#ffffff",
                            }}
                            labelStyle={{
                                color: "#9ca3af",
                            }}
                        />

                        <Line
                            type="monotone"
                            dataKey="vehicles"
                            name="Vehicles"
                            stroke="#3b82f6"
                            strokeWidth={3}
                            dot={{ r: 3 }}
                            activeDot={{ r: 5 }}
                        />

                        <Line
                            type="monotone"
                            dataKey="congestion"
                            name="Congestion Index"
                            stroke="#f97316"
                            strokeWidth={3}
                            dot={{ r: 3 }}
                            activeDot={{ r: 5 }}
                        />

                        <Line
                            type="monotone"
                            dataKey="speed"
                            name="Average Speed"
                            stroke="#22c55e"
                            strokeWidth={3}
                            dot={{ r: 3 }}
                            activeDot={{ r: 5 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default TrafficChart;