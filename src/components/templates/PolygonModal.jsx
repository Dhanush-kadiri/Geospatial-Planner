import React from "react";
import "../styling/Modal.css";
import { calculateDistance } from "../utils/calculateDistance"; 

const PolygonModal = ({ coordinates, onClose }) => {
  // Calculate edge distances and total distance
  const edgeDistances = coordinates.map((item, index) => {
    const nextIndex = (index + 1) % coordinates.length; 
    const nextCoord = coordinates[nextIndex]?.coord;

    if (
      item.coord &&
      Array.isArray(item.coord) &&
      item.coord.length === 2 &&
      nextCoord &&
      Array.isArray(nextCoord) &&
      nextCoord.length === 2
    ) {
      return calculateDistance(item.coord, nextCoord); 
    }
    return 0; 
  });

  // Calculate total distance
  const totalDistance = edgeDistances.reduce((acc, dist) => acc + dist, 0);

  return (
    <div className="modal">
      <h2>Polygon Planner</h2>
      <button className="close-btn" onClick={onClose}>
        Close
      </button>

      {/* Headings for the table */}
      <div className="coordinates-list">
        <div className="coordinate-row headings">
          <div><strong>Waypoint</strong></div>
          <div><strong>Coordinates</strong></div>
          <div><strong>Edge Distance</strong></div>
        </div>

        {/* Coordinates and distances */}
        {coordinates.map((item, index) => {
          const edgeDistance =
            edgeDistances[index] > 0
              ? `${(edgeDistances[index] / 1000).toFixed(2)} km`
              : "0 km";
          return (
            <div className="coordinate-row" key={index}>
              <div><strong>{item.waypoint}</strong></div>
              <div>{item.coord[0].toFixed(6)}, {item.coord[1].toFixed(6)}</div>
              <div>
                {edgeDistance}{" "}
                {index < coordinates.length - 1
                  ? `(WP${index} - WP${index + 1})`
                  : `(WP${index} - WP0)` }
              </div>
            </div>
          );
        })}
      </div>

      {/* Total distance */}
      <div className="total-distance">
        <strong>Total Distance:</strong> {(totalDistance / 1000).toFixed(2)} km
      </div>
    </div>
  );
};

export default PolygonModal;
