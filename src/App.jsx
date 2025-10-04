import { Routes, Route, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

import confetti from "canvas-confetti";

function Intro() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => navigate("/details"), 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5 }}
      className="page"
    >
      <h1 style={{ fontSize: "3rem", fontWeight: "700" }}>Are you ready?</h1>
    </motion.div>
  );
}

function Details() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => navigate("/finale"), 4000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2 }}
      className="page"
    >
      <h2 style={{ fontSize: "2.2rem", marginBottom: "1rem", color: "#FFD700" }}>
        Bring drinks, not presents 
      </h2>
      <h3 style={{ fontSize: "1.8rem" }}>October 11th · 9:00 PM</h3>
    </motion.div>
  );
}

function Finale() {
  const [showImage, setShowImage] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [flash, setFlash] = useState(false);
  const [strike, setStrike] = useState(false);
  const navigate = useNavigate();

  const triggerLightning = () => {
    // flash overlay
    setFlash(true);
    setTimeout(() => setFlash(false), 300);

    // falling bolts
    setStrike(true);
    setTimeout(() => setStrike(false), 600);
  };

  const handleCelebrate = () => {
    triggerLightning();
    setTimeout(() => setShowImage(true), 400);
    setTimeout(() => setShowButton(true), 1600);
  };

  const handleViewDetails = () => {
    triggerLightning();
    setTimeout(() => navigate("/details"), 400);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      className="page"
      style={{ position: "relative" }}
    >
      {/* white flash */}
      {flash && (
        <motion.div
          className="lightning-flash"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.9, 0, 0.6, 0] }}
          transition={{ duration: 0.5 }}
        />
      )}

      {/* falling lightning bolts */}
      {strike && (
        <>
          <div className="lightning-bolt strike-animation" />
          <div className="lightning-bolt strike-animation" />
        </>
      )}

      <h2 style={{ fontSize: "2.5rem", color: "#FFD700" }}>See you there ⚡</h2>

      <motion.button
        style={{
          marginTop: "2rem",
          padding: "1rem 2.5rem",
          backgroundColor: "#FFD700",
          color: "#000",
          border: "none",
          borderRadius: "50px",
          fontSize: "1.2rem",
          fontWeight: "bold",
          boxShadow: "0 0 25px rgba(255,215,0,0.5)",
        }}
        whileHover={{ scale: 1.1 }}
        onClick={handleCelebrate}
      >
        Celebrate
      </motion.button>

      {showImage && (
        <motion.img
  src="/me.png"
  alt="Birthday Celebration"
  initial={{ opacity: 0, scale: 0.5 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 1, ease: "easeOut" }}
  style={{
    display: "block",
    margin: "2rem auto 1rem auto",   // centers horizontally in normal flow
    width: "80%",
    maxWidth: "400px",
    height: "auto",
    borderRadius: "20px",
    boxShadow: "0 0 40px rgba(255,215,0,0.4)",
    zIndex: 10,
  }}
/>

      )}

      {showButton && (
        <motion.button
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          onClick={handleViewDetails}
          style={{
            position: "absolute",
            top: "calc(50% + 270px)",
            left: "10%",
            transform: "translateX(-50%)",
            backgroundColor: "#000",
            color: "#FFD700",
            border: "2px solid #FFD700",
            padding: "0.8rem 2rem",
            borderRadius: "40px",
            fontWeight: "bold",
            fontSize: "1rem",
            boxShadow: "0 0 20px rgba(255,215,0,0.3)",
            zIndex: 11,
          }}
          whileHover={{ scale: 1.1 }}
        >
          View Details
        </motion.button>
      )}
    </motion.div>
  );
}

function BackgroundMusic() {
  const [audio] = useState(() => new Audio("/me.mp3"));
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0);

  useEffect(() => {
    audio.loop = true;
    audio.volume = 0;
    audio.muted = true;

    // try autoplay muted
    audio.play().catch(() => {
      console.log("Autoplay blocked until interaction");
    });

    // fade-in unmute when user first interacts
    const unmute = () => {
      audio.muted = false;
      if (!isPlaying) {
        fadeIn();
        setIsPlaying(true);
      }
      window.removeEventListener("click", unmute);
      window.removeEventListener("touchstart", unmute);
    };

    window.addEventListener("click", unmute);
    window.addEventListener("touchstart", unmute);

    return () => {
      audio.pause();
      window.removeEventListener("click", unmute);
      window.removeEventListener("touchstart", unmute);
    };
  }, []);

  const fadeIn = () => {
    let v = 0;
    const fade = setInterval(() => {
      v += 0.05;
      audio.volume = v;
      setVolume(v);
      if (v >= 0.5) {
        clearInterval(fade);
        audio.volume = 0.5;
        setVolume(0.5);
      }
    }, 200);
  };

  const fadeOut = () => {
  let v = volume;
  const fade = setInterval(() => {
    v = Math.max(0, v - 0.05);      // 👈 clamp to 0
    audio.volume = v;
    setVolume(v);
    if (v <= 0) {
      clearInterval(fade);
      audio.volume = 0;
      audio.pause();
      setIsPlaying(false);
    }
  }, 150);
};


  const toggleSound = async () => {
    if (isPlaying) {
      fadeOut();
    } else {
      try {
        await audio.play();
        audio.muted = false;
        fadeIn();
        setIsPlaying(true);
      } catch (e) {
        console.log("Playback blocked:", e);
      }
    }
  };

  return (
    <button
      onClick={toggleSound}
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        color: "#FFD700",
        border: "2px solid #FFD700",
        borderRadius: "50%",
        width: "60px",
        height: "60px",
        fontSize: "1.5rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        zIndex: 999,
        boxShadow: "0 0 20px rgba(255, 215, 0, 0.4)",
        backdropFilter: "blur(4px)",
        transition: "all 0.3s ease",
      }}
      title={isPlaying ? "Mute" : "Play Music"}
    >
      {isPlaying ? "🔊" : "🔇"}
    </button>
  );
}





export default function App() {
  return (
    <>
      <BackgroundMusic /> {/* ✅ Mount the music player */}
      <Routes>
        <Route path="/" element={<Intro />} />
        <Route path="/details" element={<Details />} />
        <Route path="/finale" element={<Finale />} />
      </Routes>
    </>
  );
}

