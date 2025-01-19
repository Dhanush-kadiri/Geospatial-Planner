export const calculateDistance = (coord1, coord2) => {
    const toRadians = (degree) => (degree * Math.PI) / 180;
    const R = 6371e3; 
  
    const [lon1, lat1] = coord1;
    const [lon2, lat2] = coord2;
  
    const φ1 = toRadians(lat1);
    const φ2 = toRadians(lat2);
    const Δφ = toRadians(lat2 - lat1);
    const Δλ = toRadians(lon2 - lon1);
  
    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
  };
  export const calculateTotalDistance = (coordinates, isPolygon = false) => {
    if (!Array.isArray(coordinates) || coordinates.length < 2) {
      throw new Error("Invalid coordinates: must contain at least two points.");
    }
  
    let totalDistance = 0;
  
    // Iterate through coordinates and calculate distances between consecutive points
    for (let i = 0; i < coordinates.length - 1; i++) {
      totalDistance += calculateDistance(coordinates[i], coordinates[i + 1]);
    }
  
    // If it's a polygon, add the distance from the last point back to the first point
    if (isPolygon) {
      totalDistance += calculateDistance(
        coordinates[coordinates.length - 1],
        coordinates[0]
      );
    }
  
    return totalDistance; 
  };
  