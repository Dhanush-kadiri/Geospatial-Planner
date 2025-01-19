import React from "react";
import { useNavigate } from "react-router-dom"; 
import "../styling/HomePage.css"; 
import video from '../../images/video.mp4'

const HomePage = () => {
    const navigate = useNavigate();

    const handleNavigate = () => {
        navigate("/MapComponent"); 
    };

    return (
        <div className="home-page">
            <div className="content">
                <h1 className="title">Welcome to the Geospatial Planner</h1>
                <p className="description">
                    A powerful tool to draw, visualize, and calculate geospatial data
                    effortlessly. Plan your missions and explore the world with precision.
                </p>
                <div className="gif-container">
                    <video
                        src={video}
                        className="center-gif"
                        autoPlay
                        muted
                        loop
                        playsInline
                    />
                </div>
                <button className="start-button" onClick={handleNavigate}>
                    Get Started
                </button>
            </div>
        </div>
    );
};

export default HomePage;
