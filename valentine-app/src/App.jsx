import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Sparkles, ChevronLeft } from "lucide-react";
import "./App.css";

// Generate ambient hearts and stars once at module level to avoid impure function calls during render
const generateAmbientHearts = () => {
  const hearts = [];
  const count = 80;
  for (let i = 0; i < count; i++) {
    const jitter = (Math.random() * (100 / count));
    const left = Math.min(100, (i / count) * 100 + jitter);
    hearts.push({
      id: `big-heart-${i}`,
      left: `${left}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${-Math.random() * 20}s`,
      animationDuration: `${8 + Math.random() * 18}s`,
    });
  }
  return hearts;
};

const generateAmbientStars = () => {
  const stars = [];
  const count = 140;
  for (let i = 0; i < count; i++) {
    const jitter = (Math.random() * (100 / count));
    const left = Math.min(100, (i / count) * 100 + jitter);
    stars.push({
      id: `star-${i}`,
      left: `${left}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${-Math.random() * 20}s`,
      animationDuration: `${6 + Math.random() * 16}s`,
    });
  }
  return stars;
};

const AMBIENT_HEARTS = generateAmbientHearts();
const AMBIENT_STARS = generateAmbientStars();

function App() {
  const [stage, setStage] = useState("splash"); // splash, letter, proposal, celebration
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
  const [noClicks, setNoClicks] = useState(0);
  const [currentImage, setCurrentImage] = useState(0);
  const canvasRef = useRef(null);
  const proposalRef = useRef(null);
  const noBtnRef = useRef(null);

  const memories = [
    { img: "/valentine-app/image1.jpg" },
    { img: "/valentine-app/image2.jpg" },
    { img: "/valentine-app/image3.jpg"},
    { img: "/valentine-app/image4.jpg"},
    { img: "/valentine-app/image5.jpg" },
  ];

  const messages = [
    "Come on, you know the answer 😊",
    "Don't be shy 🥰",
    "You're making me nervous 😅",
    "My heart can't take this 💔",
    "Pookie, say YES! 💕",
  ];

  const launchFireworks = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    for (let i = 0; i < 200; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 8,
        life: 1,
        color: `hsl(${Math.random() * 360}, 100%, 70%)`,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.2; // gravity
        p.life -= 0.01;

        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        ctx.fill();
      });

      if (particles.some((p) => p.life > 0)) {
        requestAnimationFrame(animate);
      } else {
        ctx.globalAlpha = 1;
      }
    };
    animate();
  }, []);

  // Initialize audio
  useEffect(() => {
    // Audio removed - no longer needed
  }, []);

  // Auto-advance slideshow
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % memories.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [memories.length]);

  // Easter egg
  useEffect(() => {
    let typed = "";
    const handler = (e) => {
      typed += e.key.toLowerCase();
      if (typed.includes("pookie")) {
        launchFireworks();
        typed = "";
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [launchFireworks]);

  const moveNoButton = () => {
    const container = proposalRef.current;
    const btn = noBtnRef.current;
    if (!container || !btn) {
      // fallback small random nudge
      const x = (Math.random() - 0.5) * 160;
      const y = (Math.random() - 0.5) * 80;
      setNoPosition({ x, y });
      setNoClicks((prev) => prev + 1);
      return;
    }

    const contRect = container.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();

    const currentLeft = btnRect.left - contRect.left;
    const currentTop = btnRect.top - contRect.top;

    const minTranslateX = Math.round(-currentLeft + 4); // small padding
    const maxTranslateX = Math.round(contRect.width - btnRect.width - currentLeft - 4);
    const minTranslateY = Math.round(-currentTop + 4);
    const maxTranslateY = Math.round(contRect.height - btnRect.height - currentTop - 4);

    const x = Math.floor(Math.random() * (maxTranslateX - minTranslateX + 1)) + minTranslateX;
    const y = Math.floor(Math.random() * (maxTranslateY - minTranslateY + 1)) + minTranslateY;

    setNoPosition({ x, y });
    setNoClicks((prev) => prev + 1);
  };

  return (
    <div className="app">
      {/* Background */}
      <div className="bg-gradient"></div>
      {/* background video removed; using static background image from public/background.jpg */}
      <div className="bg-overlay"></div>

      {/* Ambient Elements */}
      <div className="ambient">
        <div className="floating-hearts">
          {["💖", "💗", "💘", "💕", "💓"].map((heart, i) => (
            <motion.div
              key={i}
              className="heart-float"
              animate={{
                y: [0, -100, -200],
                opacity: [0, 1, 0],
                x: Math.sin(i) * 100,
              }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                ease: "easeIn",
              }}
            >
              {heart}
            </motion.div>
          ))}
        </div>

        <div className="particle-field">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="particle"
              animate={{
                x: [0, 50],
                y: [0, 50],
                opacity: [0, 0.6, 0],
              }}
              transition={{
                duration: 3 + i * 0.3,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
        
        {/* Large ambient floating hearts & stars across the whole background (more and evenly distributed) */}
        <div className="ambient-floating">
          {AMBIENT_HEARTS.map((heart) => (
            <div
              key={heart.id}
              className="ambient-heart"
              style={{
                left: heart.left,
                top: heart.top,
                animationDelay: heart.animationDelay,
                animationDuration: heart.animationDuration,
              }}
            >
              ❤️
            </div>
          ))}

          {AMBIENT_STARS.map((star) => (
            <div
              key={star.id}
              className="ambient-star"
              style={{
                left: star.left,
                top: star.top,
                animationDelay: star.animationDelay,
                animationDuration: star.animationDuration,
              }}
            >
              ✨
            </div>
          ))}
        </div>
      </div>

      <canvas ref={canvasRef} className="fireworks"></canvas>

      <AnimatePresence mode="wait">
        {/* Splash Screen */}
        {stage === "splash" && (
          <motion.div
            key="splash"
            className="stage splash-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="splash-content"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                <Heart size={60} className="splash-icon" fill="currentColor" style={{ color: "var(--accent-mid)", marginBottom: "20px" }} />
              </motion.div>
              <h1 className="title">Happy Valentine's Day</h1>
              <p className="subtitle">To My Forever Pookie 💕</p>
              
              <motion.button
                className="btn btn-primary"
                onClick={() => setStage("letter")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Heart size={18} style={{ marginRight: "8px", display: "inline" }} />
                Open My Heart 💌
              </motion.button>
            </motion.div>
          </motion.div>
        )}

        {/* Love Letter */}
        {stage === "letter" && (
          <motion.div
            key="letter"
            className="stage letter-stage"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="letter-card"
              initial={{ rotateY: 90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <div className="letter-content">
                <h2>
                  <Heart size={28} style={{ marginRight: "10px", display: "inline", color: "var(--accent-mid)" }} />
                  To My Forever Pookie 💕
                </h2>
                
                <div className="letter-content-wrapper">
                  {/* Photo Carousel */}
                  <div className="left-column">
                    <div className="carousel">
                      <motion.div
                        className="carousel-inner"
                        key={currentImage}
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ duration: 0.5 }}
                      >
                        <img
                          src={memories[currentImage].img}
                          alt={memories[currentImage].title}
                          className="carousel-img"
                        />
                      </motion.div>
                    </div>
                  </div>

                  {/* Text and Button */}
                  <div className="right-column">
                    <div className="letter-text">
                      <p>
                        From meeting you for the very first time and falling in love with you everyday… every second with you has been pure magic.
                      </p>
                      <p>
                        You are my home, my happiness, my favorite forever story. In a lifetime of moments, you are the ones I want to remember forever.
                      </p>
                      <p>
                        Today, I want to ask you something and every year after this…
                      </p>
                    </div>

                    <motion.button
                      className="btn btn-primary continue-btn"
                      onClick={() => setStage("proposal")}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Sparkles size={18} style={{ marginRight: "8px", display: "inline" }} />
                      Continue to the Question 💍
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Proposal */}
        {stage === "proposal" && (
          <motion.div
            key="proposal"
            className="stage proposal-stage"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="proposal-card"
              ref={proposalRef}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="proposal-question">
                <Heart size={32} style={{ marginRight: "12px", display: "inline", color: "var(--accent-mid)" }} />
                Will you be my Valentine? 💍
              </h2>
              
              {noClicks > 0 && (
                <motion.p
                  className="proposal-message"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={noClicks}
                >
                  {messages[Math.min(noClicks - 1, messages.length - 1)]}
                </motion.p>
              )}

              <div className="proposal-buttons">
                <motion.button
                  className="btn btn-yes"
                  onClick={() => {
                    setStage("celebration");
                    launchFireworks();
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  YES 💕
                </motion.button>

                <motion.button
                  className="btn btn-no"
                  ref={noBtnRef}
                  animate={{ x: noPosition.x, y: noPosition.y }}
                  onMouseEnter={moveNoButton}
                  onTouchStart={moveNoButton}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  No 😢
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Celebration */}
        {stage === "celebration" && (
          <motion.div
            key="celebration"
            className="stage celebration-stage"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="celebration-content"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 15,
              }}
            >
              <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                <Heart size={60} style={{ color: "var(--accent-mid)", marginBottom: "15px" }} fill="currentColor" />
              </motion.div>
              
              <motion.h1
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Forever Starts Now 💖
              </motion.h1>
              
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                I Love You Pookie ✨
              </motion.h2>

              {/* Celebration Image */}
              <motion.div
                className="celebration-image-container"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 }}
              >
                <img
                  src="/valentine-app/image6.PNG"
                  alt="Our special moment"
                  className="celebration-image"
                />
              </motion.div>

              <motion.p
                className="celebration-text"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 }}
              >
                Thank you for 6 beautiful years, and here's to forever 🥂
              </motion.p>

              <motion.button
                className="btn btn-restart"
                onClick={() => {
                  setStage("splash");
                  setNoClicks(0);
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
              >
                <ChevronLeft size={18} style={{ marginRight: "8px", display: "inline" }} />
                Start Over 🔄
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls */}
      <div className="controls">
        <motion.button
          className="btn-back"
          onClick={() => {
            if (stage === "letter") setStage("splash");
            else if (stage === "proposal") setStage("letter");
            else if (stage === "celebration") setStage("proposal");
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          ← Back
        </motion.button>
      </div>
    </div>
  );
}

export default App;
