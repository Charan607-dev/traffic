from http.server import HTTPServer, BaseHTTPRequestHandler
import json
from services.preprocessing import clean_traffic_data
from services.prediction import predict_traffic
from services.bottleneck import identify_bottlenecks
from services.signal_optimization import compute_adaptive_signal
from services.fuel_estimation import compute_fuel_metrics
from services.emissions import compute_emissions_metrics
from services.noise_estimation import compute_noise_metrics

MOCK_TRAFFIC = [
    {
        "junctionId": "J-01",
        "junctionName": "Central Plaza",
        "vehicleCount": 142,
        "averageSpeed": 18.5,
        "density": 35.5,
        "congestionLevel": "High",
        "congestionIndex": 0.78,
        "estimatedIdleTime": 14,
    },
    {
        "junctionId": "J-02",
        "junctionName": "Tech Park Cross",
        "vehicleCount": 89,
        "averageSpeed": 32.4,
        "density": 22.25,
        "congestionLevel": "Moderate",
        "congestionIndex": 0.49,
        "estimatedIdleTime": 7,
    },
    {
        "junctionId": "J-03",
        "junctionName": "Metro Interchange",
        "vehicleCount": 178,
        "averageSpeed": 11.2,
        "density": 44.5,
        "congestionLevel": "Very High",
        "congestionIndex": 0.92,
        "estimatedIdleTime": 22,
    },
    {
        "junctionId": "J-04",
        "junctionName": "Harbor Bridge",
        "vehicleCount": 54,
        "averageSpeed": 48.0,
        "density": 13.5,
        "congestionLevel": "Low",
        "congestionIndex": 0.28,
        "estimatedIdleTime": 3,
    },
]

class RequestHandler(BaseHTTPRequestHandler):
    def _set_headers(self, status=200):
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_OPTIONS(self):
        self._set_headers(204)

    def do_GET(self):
        if self.path == "/" or self.path == "/api":
            self._set_headers(200)
            self.wfile.write(json.dumps({"status": "healthy", "service": "Urban Traffic AI Backend"}).encode())
            return

        if self.path == "/api/traffic":
            self._set_headers(200)
            self.wfile.write(json.dumps(MOCK_TRAFFIC).encode())
            return

        if self.path == "/api/bottlenecks":
            bottlenecks = identify_bottlenecks(MOCK_TRAFFIC)
            self._set_headers(200)
            self.wfile.write(json.dumps(bottlenecks).encode())
            return

        if self.path == "/api/signal-optimization":
            recommendations = [
                compute_adaptive_signal(item["junctionId"], item["junctionName"], item["vehicleCount"])
                for item in MOCK_TRAFFIC
            ]
            self._set_headers(200)
            self.wfile.write(json.dumps(recommendations).encode())
            return

        if self.path == "/api/sustainability":
            fuel = compute_fuel_metrics(distance_km=150.0, avg_speed_kmh=27.5, idle_time_mins=46.0)
            emissions = compute_emissions_metrics(fuel["fuelConsumption"])
            noise = compute_noise_metrics(vehicle_count=463, avg_speed_kmh=27.5)

            summary = {
                "before": {
                    **fuel,
                    **emissions,
                    **noise,
                    "idleTime": 46.0,
                    "idleTimeReduced": 11.5,
                    "idleTimeReductionPercentage": 25.0
                },
                "after": {
                    "fuelConsumption": round(fuel["fuelConsumption"] - fuel["fuelSaved"], 2),
                    "fuelSaved": fuel["fuelSaved"],
                    "fuelSavingPercentage": 18.0,
                    "co2Emissions": round(emissions["co2Emissions"] - emissions["co2Reduced"], 2),
                    "co2Reduced": emissions["co2Reduced"],
                    "co2ReductionPercentage": 20.0,
                    "idleTime": 34.5,
                    "idleTimeReduced": 11.5,
                    "idleTimeReductionPercentage": 25.0,
                    "noiseScore": max(45.0, round(noise["noiseScore"] - 6.5, 1)),
                    "noiseImpact": "Moderate"
                },
                "summary": {
                    "totalFuelSaved": fuel["fuelSaved"],
                    "totalCO2Reduced": emissions["co2Reduced"],
                    "totalIdleTimeReduced": 11.5,
                    "averageNoiseScore": noise["noiseScore"],
                    "monitoredJunctions": 4,
                    "optimizedJunctions": 4
                }
            }
            self._set_headers(200)
            self.wfile.write(json.dumps(summary).encode())
            return

        self._set_headers(404)
        self.wfile.write(json.dumps({"error": "Endpoint not found"}).encode())

    def do_POST(self):
        content_length = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(content_length).decode() if content_length > 0 else "{}"
        try:
            data = json.loads(body) if body else {}
        except json.JSONDecodeError as err:
            self._set_headers(400)
            self.wfile.write(json.dumps({"error": "Invalid JSON body", "detail": str(err)}).encode())
            return

        if self.path == "/api/predict":
            try:
                clean_item = clean_traffic_data(data)
                pred = predict_traffic(
                    clean_item["junction_id"],
                    data.get("vehicleCount", data.get("vehicle_count", data.get("Vehicle Count"))),
                    traffic_features=data
                )
                self._set_headers(200)
                self.wfile.write(json.dumps(pred).encode())
            except Exception as error:
                self._set_headers(500)
                self.wfile.write(json.dumps({
                    "error": "Prediction failed",
                    "detail": str(error)
                }).encode())
            return

        if self.path == "/api/routes":
            # Return demo route comparison
            routes = [
                {
                    "id": "R-FAST",
                    "name": "Arterial Highway (Fastest)",
                    "start": data.get("start", {"name": "Central", "latitude": 12.97, "longitude": 77.59}),
                    "destination": data.get("destination", {"name": "Airport", "latitude": 13.19, "longitude": 77.70}),
                    "distance": 34.2,
                    "estimatedTravelTime": 42,
                    "traffic": {
                        "congestionLevel": "Moderate",
                        "averageSpeed": 48.8,
                        "vehicleDensity": 28.5,
                        "estimatedDelay": 8
                    },
                    "sustainability": {
                        "estimatedFuel": 2.45,
                        "estimatedFuelSaved": 0.4,
                        "estimatedCO2": 5.65,
                        "estimatedCO2Saved": 0.9,
                        "noiseImpact": "Moderate",
                        "noiseScore": 68.0
                    },
                    "isRecommended": False
                },
                {
                    "id": "R-ECO",
                    "name": "Green Eco-Corridor (Lowest Emissions)",
                    "start": data.get("start", {"name": "Central", "latitude": 12.97, "longitude": 77.59}),
                    "destination": data.get("destination", {"name": "Airport", "latitude": 13.19, "longitude": 77.70}),
                    "distance": 31.8,
                    "estimatedTravelTime": 45,
                    "traffic": {
                        "congestionLevel": "Low",
                        "averageSpeed": 42.4,
                        "vehicleDensity": 16.0,
                        "estimatedDelay": 2
                    },
                    "sustainability": {
                        "estimatedFuel": 1.95,
                        "estimatedFuelSaved": 0.9,
                        "estimatedCO2": 4.5,
                        "estimatedCO2Saved": 2.05,
                        "noiseImpact": "Low",
                        "noiseScore": 58.5
                    },
                    "isRecommended": True
                }
            ]
            self._set_headers(200)
            self.wfile.write(json.dumps(routes).encode())
            return

        self._set_headers(404)
        self.wfile.write(json.dumps({"error": "Endpoint not found"}).encode())

def run_server(port=None):
    if port is None:
        import os
        port = int(os.environ.get("PORT", 8081))
    server_address = ("127.0.0.1", port)
    httpd = HTTPServer(server_address, RequestHandler)
    print(f"Urban Traffic AI Backend listening on http://localhost:{port}")
    httpd.serve_forever()

if __name__ == "__main__":
    run_server()
