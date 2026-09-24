import { ArrowRight, MapPin, Navigation } from "lucide-react";
import { useState } from "react";

function RoutePlanner() {
    const [start, setStart] = useState("");
    const [destination, setDestination] = useState("");

    const handlePlanRoute = () => {
        console.log("Planning route:", {
            start,
            destination,
        });
    };

    return (
        <div className="rounded-2xl border border-gray-800 bg-gray-900 p-5">
            <div className="mb-5">
                <h2 className="text-base font-semibold text-white">
                    Plan Your Journey
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                    Enter your starting point and destination.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_auto_1fr_auto] lg:items-end">
                <div>
                    <label className="mb-2 block text-xs font-medium text-gray-400">
                        Start Location
                    </label>

                    <div className="relative">
                        <MapPin
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-green-400"
                        />

                        <input
                            value={start}
                            onChange={(event) => setStart(event.target.value)}
                            placeholder="Enter starting location"
                            className="w-full rounded-xl border border-gray-700 bg-gray-950 py-3 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-blue-500"
                        />
                    </div>
                </div>

                <div className="hidden lg:flex items-center justify-center pb-2">
                    <ArrowRight size={20} className="text-gray-600" />
                </div>

                <div>
                    <label className="mb-2 block text-xs font-medium text-gray-400">
                        Destination
                    </label>

                    <div className="relative">
                        <Navigation
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-red-400"
                        />

                        <input
                            value={destination}
                            onChange={(event) =>
                                setDestination(event.target.value)
                            }
                            placeholder="Enter destination"
                            className="w-full rounded-xl border border-gray-700 bg-gray-950 py-3 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-blue-500"
                        />
                    </div>
                </div>

                <button
                    onClick={handlePlanRoute}
                    disabled={!start || !destination}
                    className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    Find Routes
                </button>
            </div>
        </div>
    );
}

export default RoutePlanner;