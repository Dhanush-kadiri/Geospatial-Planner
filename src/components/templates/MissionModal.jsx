import React from "react";
import "../styling/Modal.css";

const MissionModal = ({ coordinates, onInsertPolygon, onClose }) => {
  // Calculate total distance by summing up the distances between all waypoints
  const totalDistance = coordinates.reduce((acc, curr, index) => {
    if (index === 0) return acc; 
    const distanceBetween = curr.distance; 
    return acc + distanceBetween;
  }, 0);

  return (
    <div className="modal">
      <h2>Mission Planner</h2>
      <button className="close-btn" onClick={onClose}>
        Close
      </button>

      {/* Headings for the table */}
      <div className="coordinates-list">
        <div className="coordinate-row headings">
          <div><strong>Identifier</strong></div>
          <div><strong>Coordinates</strong></div>
          <div><strong>Distance</strong></div>
        </div>

        {/* Coordinates and distances */}
        {coordinates.map((item, index) => (
          <div className="coordinate-row" key={index}>
            <div><strong>{item.waypoint}</strong></div>
            <div>{item.coord[0].toFixed(6)}, {item.coord[1].toFixed(6)}</div>
            <div>
              {index === 0
                ? ` 0 km`
                : ` ${(coordinates[index].distance / 1000).toFixed(2)} km (WP${index - 1} - WP${index})`}
            </div>
          </div>
        ))}
      </div>

      {/* Total distance */}
      <div className="total-distance">
        <strong>Total Distance:</strong> {(totalDistance / 1000).toFixed(2)} km
      </div>
    </div>
  );
};

export default MissionModal;
