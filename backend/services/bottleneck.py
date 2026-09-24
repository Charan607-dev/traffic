from typing import List, Dict, Any

def identify_bottlenecks(traffic_items: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Scan intersections to pinpoint high risk bottleneck locations."""
    bottlenecks = []
    for item in traffic_items:
        speed = float(item.get("average_speed", item.get("avgSpeed", 30.0)))
        count = int(item.get("vehicle_count", item.get("vehicleCount", 0)))
        
        if speed < 16.0 or count > 120:
            severity = "Critical" if speed < 11.0 or count > 160 else "High"
            bottlenecks.append({
                "id": f"BN-{item.get('junctionId', item.get('junction_id', '01'))}",
                "junctionId": item.get("junctionId", item.get("junction_id", "J-01")),
                "junctionName": item.get("junctionName", f"Junction {item.get('junctionId')}"),
                "severity": severity,
                "vehicleCount": count,
                "averageSpeed": speed,
                "congestionIndex": round(min(1.0, count / 180.0), 2),
                "estimatedQueueLength": int(count * 4.2),
                "detectedAt": "Just now"
            })
    return bottlenecks
