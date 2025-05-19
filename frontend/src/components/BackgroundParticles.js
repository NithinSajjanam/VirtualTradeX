import Particles from "react-tsparticles";
import React from "react";

const BackgroundParticles = () => (
  <Particles
    className="absolute top-0 left-0 w-full h-full -z-10"
    options={{
      background: { color: "#0F172A" },
      fpsLimit: 60,
      interactivity: {
        events: {
          onClick: { enable: true, mode: "push" },
          onHover: { enable: true, mode: "repulse" },
          resize: true,
        },
        modes: {
          push: { quantity: 4 },
          repulse: { distance: 100, duration: 0.4 },
        },
      },
      particles: {
        color: { value: "#3B82F6" },
        links: {
          color: "#3B82F6",
          distance: 150,
          enable: true,
          opacity: 0.3,
          width: 1,
        },
        move: { enable: true, speed: 2 },
        number: { value: 50 },
        opacity: { value: 0.5 },
        shape: { type: "circle" },
        size: { value: { min: 1, max: 5 } },
      },
      detectRetina: true,
    }}
  />
);

export default BackgroundParticles;
