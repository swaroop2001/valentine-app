import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Sparkles, ChevronLeft } from "lucide-react";
import "./App.css";

export default function App() {
  // Stage management
  const [stage, setStage] = useState("splash"); // splash, letter, proposal, celebration

  // Carousel
  const memories = [
    { img: "/memory-1.jpg", title: "" },
    { img: "/memory-2.jpg", title: "" },
    { img: "/memory-3.jpg", title: "" },
    { img: "/memory-4.jpg", title: "" },
    { img: "/memory-5.jpg", title: "" },
  ];
  const [currentImage, setCurrentImage] = useState(0);

    // Proposal / No button logic
    const proposalRef = useRef(null);
    const noBtnRef = useRef(null);
    const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
    const [noClicks, setNoClicks] = useState(0);

    // Messages for chasing No button
    const messages = [
      "Are you sure? 😅",
      "Pretty please? 🥺",
      "I promise unlimited cuddles 🐻",
      "I'll cook your favorite forever 🍝",
    ];

    // fireworks canvas
    const canvasRef = useRef(null);

    const launchFireworks = useCallback(() => {
      const c = canvasRef.current;
      if (!c) return;
      const ctx = c.getContext("2d");
      c.width = window.innerWidth;
      c.height = window.innerHeight;
      const rand = (a, b) => Math.random() * (b - a) + a;
      const colors = ["#ffb8de", "#f0cce5", "#ffdde1", "#fff7fb"];
      for (let i = 0; i < 40; i++) {
        const x = rand(0, c.width);
        const y = rand(0, c.height / 2);
        const r = rand(4, 12);
        ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
      setTimeout(() => ctx.clearRect(0, 0, c.width, c.height), 900);
    }, []);

    // Keep No button inside proposal card
    const moveNoButton = useCallback(() => {
      const container = proposalRef.current;
      const btn = noBtnRef.current;
      if (!container || !btn) {
        const x = (Math.random() - 0.5) * 160;
        const y = (Math.random() - 0.5) * 80;
        setNoPosition({ x, y });
        setNoClicks((p) => p + 1);
        return;
      }

      const contRect = container.getBoundingClientRect();
      const btnRect = btn.getBoundingClientRect();

      const currentLeft = btnRect.left - contRect.left;
      const currentTop = btnRect.top - contRect.top;

      const padding = 8;
      const minTranslateX = Math.round(-currentLeft + padding);
      const maxTranslateX = Math.round(contRect.width - btnRect.width - currentLeft - padding);
      const minTranslateY = Math.round(-currentTop + padding);
      const maxTranslateY = Math.round(contRect.height - btnRect.height - currentTop - padding);

      if (maxTranslateX < minTranslateX) {
        setNoPosition({ x: 0, y: 0 });
        setNoClicks((p) => p + 1);
        return;
      }

      const x = Math.floor(Math.random() * (maxTranslateX - minTranslateX + 1)) + minTranslateX;
      const y = Math.floor(Math.random() * (maxTranslateY - minTranslateY + 1)) + minTranslateY;

      setNoPosition({ x, y });
      setNoClicks((p) => p + 1);
    }, []);

    // Auto-advance slideshow every 5s
    useEffect(() => {
      const interval = setInterval(() => {
        setCurrentImage((prev) => (prev + 1) % memories.length);
      }, 5000);
      return () => clearInterval(interval);
    }, [memories.length]);

    // easter key sequence: "pookie"
    useEffect(() => {
      let typed = "";
      const handler = (e) => {
        typed += e.key.toLowerCase();
        if (typed.includes("pookie")) {
          launchFireworks();
          typed = "";
        }
        if (typed.length > 20) typed = typed.slice(-10);
      };
      window.addEventListener("keydown", handler);
      return () => window.removeEventListener("keydown", handler);
    }, [launchFireworks]);

    // canvas sizing
    useEffect(() => {
      const onResize = () => {
        const c = canvasRef.current;
        if (!c) return;
        c.width = window.innerWidth;
        c.height = window.innerHeight;
      };
      window.addEventListener("resize", onResize);
      onResize();
      return () => window.removeEventListener("resize", onResize);
    }, []);

    const renderAmbient = () => {
      const hearts = [];
      const heartCount = 80;
      for (let i = 0; i < heartCount; i++) {
        const left = ((i * 97.3) % 100) + (Math.random() * 2 - 1) * 2;
        const top = ((i * 61.7) % 100) + (Math.random() * 2 - 1) * 2;
        hearts.push(
          <div
            key={`big-heart-${i}`}
            className="ambient-heart"
            style={{
              left: `${Math.max(0, Math.min(100, left))}%`,
              top: `${Math.max(0, Math.min(100, top))}%`,
              animationDelay: `${-Math.random() * 20}s`,
              animationDuration: `${8 + Math.random() * 18}s`,
            }}
          >
            ❤️
          </div>
        );
      }

      const stars = [];
      const starCount = 180;
      for (let i = 0; i < starCount; i++) {
        const left = ((i * 53.1) % 100) + (Math.random() * 2 - 1) * 2;
        const top = ((i * 37.9) % 100) + (Math.random() * 2 - 1) * 2;
        stars.push(
          <div
            key={`star-${i}`}
            className="ambient-star"
            style={{
              left: `${Math.max(0, Math.min(100, left))}%`,
              top: `${Math.max(0, Math.min(100, top))}%`,
              animationDelay: `${-Math.random() * 20}s`,
              animationDuration: `${6 + Math.random() * 16}s`,
            }}
          >
            ✨
          </div>
        );
      }

      return (
        <>
          <div className="ambient-floating">{hearts}</div>
          <div className="ambient-floating">{stars}</div>
        </>
      );
    };

    return (
      <div className="app">
        <div className="bg-gradient" />
        <div className="bg-overlay" />

        <div className="ambient">
          <div className="floating-hearts">
            {["💖", "💗", "💘", "💕", "💓"].map((heart, i) => (
              <motion.div key={i} className="heart-float" animate={{ y: [0, -80, -140], opacity: [0, 1, 0] }} transition={{ duration: 6 + i, repeat: Infinity }}>
                {heart}
              </motion.div>
            ))}
          </div>

          {renderAmbient()}
        </div>

        <canvas ref={canvasRef} className="fireworks" />

        <AnimatePresence mode="wait">
          {stage === "splash" && (
            <motion.div key="splash" className="stage splash-screen" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <motion.div className="splash-content" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }}>
                <motion.div animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                  <Heart size={64} className="splash-icon" fill="currentColor" style={{ color: "var(--accent-mid)", marginBottom: 20 }} />
                </motion.div>
                <h1 className="title">Happy Valentine's Day</h1>
                <p className="subtitle">To My Forever Pookie 💕</p>
                <motion.button className="btn btn-primary" onClick={() => setStage("letter")} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }}>
                  <Heart size={16} style={{ marginRight: 8 }} /> Open My Heart
                </motion.button>
              </motion.div>
            </motion.div>
          )}

          {stage === "letter" && (
            <motion.div key="letter" className="stage letter-stage" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <motion.div className="letter-card" initial={{ rotateY: 90, opacity: 0 }} animate={{ rotateY: 0, opacity: 1 }} transition={{ duration: 0.6 }}>
                <div className="letter-content">
                  <div className="left-column">
                    <div className="carousel">
                      <motion.div className="carousel-inner" key={currentImage} initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -100 }} transition={{ duration: 0.5 }}>
                        <img src={memories[currentImage].img} alt="memory" className="carousel-img" />
                      </motion.div>
                    </div>
                  </div>

                  <div className="right-column">
                    <h2><Heart size={22} style={{ marginRight: 8, color: "var(--accent-mid)" }} /> To My Forever Pookie</h2>
                    <div className="letter-text">
                      <p>From our first meeting to sunsets and quiet nights, every second with you has been pure magic.</p>
                      <p>You are my home, my happiness, my favorite forever story.</p>
                    </div>
                    <motion.button className="btn btn-primary continue-btn" onClick={() => setStage("proposal")} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }}>
                      <Sparkles size={16} style={{ marginRight: 8 }} /> Continue to the Question
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {stage === "proposal" && (
            <motion.div key="proposal" className="stage proposal-stage" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <motion.div className="proposal-card" ref={proposalRef} initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }}>
                <h2 className="proposal-question"><Heart size={28} style={{ marginRight: 10, color: "var(--accent-mid)" }} /> Will you be my Valentine?</h2>

                {noClicks > 0 && (
                  <motion.p className="proposal-message" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} key={noClicks}>
                    {messages[Math.min(noClicks - 1, messages.length - 1)]}
                  </motion.p>
                )}

                <div className="proposal-actions">
                  <motion.button className="btn btn-yes" onClick={() => { setStage("celebration"); launchFireworks(); }} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>Yes 💖</motion.button>

                  <motion.button
                    ref={noBtnRef}
                    className="btn btn-no"
                    style={{ transform: `translate(${noPosition.x}px, ${noPosition.y}px)` }}
                    onMouseEnter={moveNoButton}
                    onClick={moveNoButton}
                    whileHover={{ scale: 1.03 }}
                  >
                    No 😅
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}

          {stage === "celebration" && (
            <motion.div key="celebration" className="stage celebration-stage" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <motion.div className="celebration-card" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 90, damping: 14 }}>
                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                  <Heart size={80} style={{ color: "var(--accent-mid)", marginBottom: 20 }} fill="currentColor" />
                </motion.div>
                <motion.h1 animate={{ y: [0, -18, 0] }} transition={{ duration: 2, repeat: Infinity }}>Forever Starts Now 💖</motion.h1>
                <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>I Love You Pookie ✨</motion.h2>

                <motion.div className="celebration-image-container" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.8 }}>
                  <img src="/memory-1.jpg" alt="Our special moment" className="celebration-image" />
                </motion.div>

                <motion.p className="celebration-text" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }}>Thank you for every beautiful moment — here's to forever 🥂</motion.p>

                <motion.button className="btn btn-restart" onClick={() => { setStage("splash"); setNoClicks(0); setNoPosition({ x: 0, y: 0 }); }} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <ChevronLeft size={16} style={{ marginRight: 8 }} /> Start Over
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="controls">
          <motion.button className="btn-back" onClick={() => {
            if (stage === "letter") setStage("splash");
            else if (stage === "proposal") setStage("letter");
            else if (stage === "celebration") setStage("proposal");
          }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>← Back</motion.button>
        </div>
      </div>
    );
  }
  // Proposal / No button logic
  const proposalRef = useRef(null);
  const noBtnRef = useRef(null);
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
  const [noClicks, setNoClicks] = useState(0);

  // Messages for chasing No button
  const messages = [
    "Are you sure? 😅",
    "Pretty please? 🥺",
    "I promise unlimited cuddles 🐻",
    "I'll cook your favorite forever 🍝",
  ];

  // fireworks canvas
  const canvasRef = useRef(null);

  const launchFireworks = useCallback(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    c.width = window.innerWidth;
    c.height = window.innerHeight;
    const rand = (a, b) => Math.random() * (b - a) + a;
    const colors = ["#ffb8de", "#f0cce5", "#ffdde1", "#fff7fb"];
    for (let i = 0; i < 40; i++) {
      const x = rand(0, c.width);
      const y = rand(0, c.height / 2);
      const r = rand(4, 12);
      ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    setTimeout(() => ctx.clearRect(0, 0, c.width, c.height), 900);
  }, []);

  // Keep No button inside proposal card
  const moveNoButton = useCallback(() => {
    const container = proposalRef.current;
    const btn = noBtnRef.current;
    if (!container || !btn) {
      const x = (Math.random() - 0.5) * 160;
      const y = (Math.random() - 0.5) * 80;
      setNoPosition({ x, y });
      setNoClicks((p) => p + 1);
      return;
    }

    const contRect = container.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();

    const currentLeft = btnRect.left - contRect.left;
    const currentTop = btnRect.top - contRect.top;

    const padding = 8;
    const minTranslateX = Math.round(-currentLeft + padding);
    const maxTranslateX = Math.round(contRect.width - btnRect.width - currentLeft - padding);
    const minTranslateY = Math.round(-currentTop + padding);
    const maxTranslateY = Math.round(contRect.height - btnRect.height - currentTop - padding);

    if (maxTranslateX < minTranslateX) {
      setNoPosition({ x: 0, y: 0 });
      setNoClicks((p) => p + 1);
      return;
    }

    const x = Math.floor(Math.random() * (maxTranslateX - minTranslateX + 1)) + minTranslateX;
    const y = Math.floor(Math.random() * (maxTranslateY - minTranslateY + 1)) + minTranslateY;

    setNoPosition({ x, y });
    setNoClicks((p) => p + 1);
  }, []);

  // Auto-advance slideshow every 5s
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % memories.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [memories.length]);

  // easter key sequence: "pookie"
  useEffect(() => {
    let typed = "";
    const handler = (e) => {
      typed += e.key.toLowerCase();
      if (typed.includes("pookie")) {
        launchFireworks();
        typed = "";
      }
      if (typed.length > 20) typed = typed.slice(-10);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [launchFireworks]);

  // canvas sizing
  useEffect(() => {
    const onResize = () => {
      const c = canvasRef.current;
      if (!c) return;
      c.width = window.innerWidth;
      c.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);
    onResize();
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const renderAmbient = () => {
    const hearts = [];
    const heartCount = 80;
    for (let i = 0; i < heartCount; i++) {
      const left = ((i * 97.3) % 100) + (Math.random() * 2 - 1) * 2;
      const top = ((i * 61.7) % 100) + (Math.random() * 2 - 1) * 2;
      hearts.push(
        <div
          key={`big-heart-${i}`}
          className="ambient-heart"
          style={{
            left: `${Math.max(0, Math.min(100, left))}%`,
            top: `${Math.max(0, Math.min(100, top))}%`,
            animationDelay: `${-Math.random() * 20}s`,
            animationDuration: `${8 + Math.random() * 18}s`,
          }}
        >
          ❤️
        </div>
      );
    }

    const stars = [];
    const starCount = 180;
    for (let i = 0; i < starCount; i++) {
      const left = ((i * 53.1) % 100) + (Math.random() * 2 - 1) * 2;
      const top = ((i * 37.9) % 100) + (Math.random() * 2 - 1) * 2;
      stars.push(
        <div
          key={`star-${i}`}
          className="ambient-star"
          style={{
            left: `${Math.max(0, Math.min(100, left))}%`,
            top: `${Math.max(0, Math.min(100, top))}%`,
            animationDelay: `${-Math.random() * 20}s`,
            animationDuration: `${6 + Math.random() * 16}s`,
          }}
        >
          ✨
        </div>
      );
    }

    return (
      <>
        <div className="ambient-floating">{hearts}</div>
        <div className="ambient-floating">{stars}</div>
      </>
    );
  };

  return (
    <div className="app">
      <div className="bg-gradient" />
      <div className="bg-overlay" />

      <div className="ambient">
        <div className="floating-hearts">
          {["💖", "💗", "💘", "💕", "💓"].map((heart, i) => (
            <motion.div key={i} className="heart-float" animate={{ y: [0, -80, -140], opacity: [0, 1, 0] }} transition={{ duration: 6 + i, repeat: Infinity }}>
              {heart}
            </motion.div>
          ))}
        </div>

        {renderAmbient()}
      </div>

      <canvas ref={canvasRef} className="fireworks" />

      <AnimatePresence mode="wait">
        {stage === "splash" && (
          <motion.div key="splash" className="stage splash-screen" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="splash-content" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }}>
              <motion.div animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                <Heart size={64} className="splash-icon" fill="currentColor" style={{ color: "var(--accent-mid)", marginBottom: 20 }} />
              </motion.div>
              <h1 className="title">Happy Valentine's Day</h1>
              <p className="subtitle">To My Forever Pookie 💕</p>
              <motion.button className="btn btn-primary" onClick={() => setStage("letter")} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }}>
                <Heart size={16} style={{ marginRight: 8 }} /> Open My Heart
              </motion.button>
            </motion.div>
          </motion.div>
        )}

        {stage === "letter" && (
          <motion.div key="letter" className="stage letter-stage" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="letter-card" initial={{ rotateY: 90, opacity: 0 }} animate={{ rotateY: 0, opacity: 1 }} transition={{ duration: 0.6 }}>
              <div className="letter-content">
                <div className="left-column">
                  <div className="carousel">
                    <motion.div className="carousel-inner" key={currentImage} initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -100 }} transition={{ duration: 0.5 }}>
                      <img src={memories[currentImage].img} alt="memory" className="carousel-img" />
                    </motion.div>
                  </div>
                </div>

                <div className="right-column">
                  <h2><Heart size={22} style={{ marginRight: 8, color: "var(--accent-mid)" }} /> To My Forever Pookie</h2>
                  <div className="letter-text">
                    <p>From our first meeting to sunsets and quiet nights, every second with you has been pure magic.</p>
                    <p>You are my home, my happiness, my favorite forever story.</p>
                  </div>
                  <motion.button className="btn btn-primary continue-btn" onClick={() => setStage("proposal")} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }}>
                    <Sparkles size={16} style={{ marginRight: 8 }} /> Continue to the Question
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {stage === "proposal" && (
          <motion.div key="proposal" className="stage proposal-stage" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="proposal-card" ref={proposalRef} initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }}>
              <h2 className="proposal-question"><Heart size={28} style={{ marginRight: 10, color: "var(--accent-mid)" }} /> Will you be my Valentine?</h2>

              {noClicks > 0 && (
                <motion.p className="proposal-message" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} key={noClicks}>
                  {messages[Math.min(noClicks - 1, messages.length - 1)]}
                </motion.p>
              )}

              <div className="proposal-actions">
                <motion.button className="btn btn-yes" onClick={() => { setStage("celebration"); launchFireworks(); }} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>Yes 💖</motion.button>

                <motion.button
                  ref={noBtnRef}
                  className="btn btn-no"
                  style={{ transform: `translate(${noPosition.x}px, ${noPosition.y}px)` }}
                  onMouseEnter={moveNoButton}
                  onClick={moveNoButton}
                  whileHover={{ scale: 1.03 }}
                >
                  No 😅
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {stage === "celebration" && (
          <motion.div key="celebration" className="stage celebration-stage" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="celebration-card" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 90, damping: 14 }}>
              <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                <Heart size={80} style={{ color: "var(--accent-mid)", marginBottom: 20 }} fill="currentColor" />
              </motion.div>
              <motion.h1 animate={{ y: [0, -18, 0] }} transition={{ duration: 2, repeat: Infinity }}>Forever Starts Now 💖</motion.h1>
              <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>I Love You Pookie ✨</motion.h2>

              <motion.div className="celebration-image-container" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.8 }}>
                <img src="/memory-1.jpg" alt="Our special moment" className="celebration-image" />
              </motion.div>

              <motion.p className="celebration-text" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }}>Thank you for every beautiful moment — here's to forever 🥂</motion.p>

              <motion.button className="btn btn-restart" onClick={() => { setStage("splash"); setNoClicks(0); setNoPosition({ x: 0, y: 0 }); }} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <ChevronLeft size={16} style={{ marginRight: 8 }} /> Start Over
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="controls">
        <motion.button className="btn-back" onClick={() => {
          if (stage === "letter") setStage("splash");
          else if (stage === "proposal") setStage("letter");
          else if (stage === "celebration") setStage("proposal");
        }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>← Back</motion.button>
      </div>
    </div>
  );
}