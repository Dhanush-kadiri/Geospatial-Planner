import React, { useState, useEffect, useRef } from "react";
import { transform, fromLonLat } from "ol/proj";
import { Map, View, Overlay } from "ol";
import { Tile as TileLayer } from "ol/layer";
import { OSM } from "ol/source";
import { Draw } from "ol/interaction";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import Feature from "ol/Feature";
import LineString from "ol/geom/LineString";
import MissionModal from "./MissionModal";
import PolygonModal from "./PolygonModal";
import { calculateDistance, calculateTotalDistance } from "../utils/calculateDistance";
import "../styling/Map.css";
import { Style, Stroke } from "ol/style";


const MapComponent = () => {
  const mapRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(false);
  const [lineCoordinates, setLineCoordinates] = useState([]);
  const [polygonCoordinates, setPolygonCoordinates] = useState([]);
  const [polygonDistance, setPolygonDistance] = useState(0);
  const [missionModalOpen, setMissionModalOpen] = useState(false);
  const [polygonModalOpen, setPolygonModalOpen] = useState(false);
  const [waypoints, setWaypoints] = useState([]);
  const [isFinalized, setIsFinalized] = useState(false);
  const [drawingType, setDrawingType] = useState(null);

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = new Map({
        target: "map",
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
        ],
        view: new View({
          center: fromLonLat([0, 0]),
          zoom: 2,
        }),
      });
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.setTarget(undefined);
        mapRef.current = null;
      }
    };
  }, []);

  const addWaypointsToMap = (coordinates) => {
    const map = mapRef.current;

    // Clear existing overlays
    document.querySelectorAll(".waypoint-overlay").forEach((el) => el.remove());

    coordinates.forEach((coord, index) => {
      const waypointElement = document.createElement("div");
      waypointElement.className = "waypoint-overlay";
      waypointElement.innerHTML = `WP${index}`;

      const overlay = new Overlay({
        position: fromLonLat(coord),
        positioning: "center-center",
        element: waypointElement,
        stopEvent: false,
      });

      map.addOverlay(overlay);
    });
  };

  const startDrawing = (type) => {
    setDrawingType(type);

    const map = mapRef.current;
    if (map) {
      const source = new VectorSource();
      const layer = new VectorLayer({ source });
      map.addLayer(layer);

      const draw = new Draw({ source, type });
      let coordinates = [];

      draw.on("drawstart", (e) => {
        const feature = e.feature;

        feature.getGeometry().on("change", (event) => {
          const geometry = event.target;
          if (type === "Polygon") {
            coordinates = geometry.getCoordinates()[0].map((coord) =>
              transform(coord, "EPSG:3857", "EPSG:4326")
            );
          } else if (type === "LineString") {
            coordinates = geometry.getCoordinates().map((coord) =>
              transform(coord, "EPSG:3857", "EPSG:4326")
            );
          }

          setWaypoints(coordinates);
          addWaypointsToMap(coordinates);
        });
      });

      const finalizeDrawing = () => {
        map.removeInteraction(draw);
        setIsDrawing(false);
      
        if (type === "Polygon") {
          setPolygonCoordinates(coordinates);
          setPolygonDistance(calculateTotalDistance(coordinates, true));
          setPolygonModalOpen(true);
        } else if (type === "LineString") {
          setLineCoordinates(coordinates);
          setMissionModalOpen(true);
        }
      
        // Connect points with a line
        if (coordinates.length > 1) {
          const lineFeature = new Feature({
            geometry: new LineString(
              coordinates.map((coord) => fromLonLat(coord)) 
            ),
          });
      
          const source = new VectorSource({
            features: [lineFeature],
          });
      
          const lineLayer = new VectorLayer({
            source,
            style: new Style({
              stroke: new Stroke({
                color: "#FF0000", 
                width: 2,
              }),
            }),
          });
      
          map.addLayer(lineLayer);
        }
      };
      

      draw.on("drawend", finalizeDrawing);

      const handleEnterKey = (event) => {
        if (event.key === "Enter") {
          finalizeDrawing();
          window.removeEventListener("keydown", handleEnterKey);
        }
      };

      window.addEventListener("keydown", handleEnterKey);
      map.addInteraction(draw);
    }
  };

  const handleGenerateReport = () => {
    if (waypoints.length === 0) {
      alert("No waypoints added. Please add some waypoints first.");
      return;
    }

    if (drawingType === "Polygon" && polygonCoordinates.length > 0) {
      setPolygonModalOpen(true);
    } else if (drawingType === "LineString" && lineCoordinates.length > 0) {
      setMissionModalOpen(true);
    } else {
      alert("Please finalise the points by clicking enter key or dual tapping on the last point");
    }

    setIsFinalized(true);
  };

  const resetAfterModalClose = () => {
    setMissionModalOpen(false);
    setPolygonModalOpen(false);
    setIsDrawing(true);
    setIsFinalized(false);
  };

  return (
    <div>
      <div
        id="map"
        className={`map-container ${isDrawing ? "" : "map-blur"}`}
        tabIndex={0}
      ></div>
      <div className="centered-button">
        {!controlsVisible ? (
          <button onClick={() => setControlsVisible(true)} disabled={isDrawing}>
            Wanna know your tour distance?
          </button>
        ) : (
          <>
            <button
              onClick={() => {
                setIsDrawing(true);
                startDrawing("LineString");
              }}
              disabled={isDrawing}
            >
              With LineString
            </button>
            <button
              onClick={() => {
                setIsDrawing(true);
                startDrawing("Polygon");
              }}
              disabled={isDrawing}
            >
              Through Polygon
            </button>
          </>
        )}
      </div>

      <div className="dynamic-modal">
        <h2>Waypoints</h2>
        <h6>Add points and click on the generate report button to calculate the distances</h6>
        <ul>
          {waypoints.map((coord, index) => (
            <li key={index}>
              {`WP${index}: ${coord[0].toFixed(6)}, ${coord[1].toFixed(6)}`}
            </li>
          ))}
        </ul>
        <button onClick={handleGenerateReport}>Generate Report</button>
      </div>

      {missionModalOpen && (
        <MissionModal
          coordinates={lineCoordinates.map((coord, index) => ({
            waypoint: `WP${index}`,
            coord,
            distance:
              index > 0 ? calculateDistance(lineCoordinates[index - 1], coord) : 0,
          }))}
          onClose={resetAfterModalClose}
        />
      )}

      {polygonModalOpen && (
        <PolygonModal
          coordinates={polygonCoordinates.map((coord, index) => ({
            waypoint: `WP${index}`,
            coord,
          }))}
          totalDistance={polygonDistance}
          onClose={resetAfterModalClose}
        />
      )}
    </div>
  );
};

export default MapComponent;
