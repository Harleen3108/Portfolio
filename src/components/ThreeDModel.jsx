import React, { useRef, useEffect, useState } from "react";
import "../styles/hero.css";

function ThreeDModel() {
  const canvasRef = useRef(null);
  const [images, setImages] = useState([]);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [canvasOpacity, setCanvasOpacity] = useState(0); // Start hidden
  const [isMobile, setIsMobile] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isInHero, setIsInHero] = useState(true);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Easing function for smoother progress
  const easeInOutQuad = (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

  // Preload images
  useEffect(() => {
    const totalFrames = 79;

    const loadedImages = new Array(totalFrames);

    const createPlaceholder = (width, height, frameNum) => {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");

      ctx.fillStyle = "#0f1419";
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = "#4a90e2";
      ctx.font = "bold 20px Arial";
      ctx.textAlign = "center";
      ctx.fillText(`${frameNum}`, width / 2, height / 2);

      const img = new Image();
      img.src = canvas.toDataURL();
      return img;
    };

    const loadImage = (index) => {
      return new Promise((resolve) => {
        const frameNumber = String(index).padStart(3, "0");
        const img = new Image();

        img.onload = () => {
          loadedImages[index - 1] = img;
          setLoadingProgress(Math.floor((index / totalFrames) * 100));
          resolve(true);
        };

        img.onerror = () => {
          const placeholder = createPlaceholder(800, 600, index);
          loadedImages[index - 1] = placeholder;
          setLoadingProgress(Math.floor((index / totalFrames) * 100));
          resolve(false);
        };

        img.src = `/video-frames/frame_${String(frameNumber).padStart(
          4,
          "0"
        )}.jpg`;
      });
    };

    const loadAllImages = async () => {
      setIsLoading(true);
      setError(null);
      setLoadingProgress(0);

      try {
        const immediateFrames = isMobile ? 15 : 25;

        // Load first batch for instant display
        const immediatePromises = [];
        for (let i = 1; i <= immediateFrames; i++) {
          immediatePromises.push(loadImage(i));
        }

        await Promise.all(immediatePromises);

        // Show content immediately in hero section
        if (immediateFrames > 10) {
          setImages(
            loadedImages.slice(0, immediateFrames).filter((img) => img)
          );
          setCanvasOpacity(1); // Make visible only when we have frames
        }

        // Load remaining frames in background
        const remainingPromises = [];
        for (let i = immediateFrames + 1; i <= totalFrames; i++) {
          remainingPromises.push(loadImage(i));
        }

        await Promise.all(remainingPromises);

        setImages(loadedImages.filter((img) => img !== undefined));
        setIsLoading(false);
        setLoadingProgress(100);
      } catch (err) {
        setError("Failed to load images");
        setIsLoading(false);
      }
    };

    loadAllImages();
  }, [isMobile]);

  // Setup canvas - HERO SECTION ONLY
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let lastScrollTime = 0;
    const scrollThrottle = isMobile ? 32 : 16;

    const setCanvasSize = () => {
      const dpr = isMobile
        ? Math.min(1.5, window.devicePixelRatio || 1)
        : window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      ctx.scale(dpr, dpr);
    };

    setCanvasSize();

    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.zIndex = "1";
    canvas.style.pointerEvents = "none";

    const renderFrame = (frameIndex) => {
      if (images.length === 0) return;

      const actualFrameIndex = Math.min(
        Math.floor(frameIndex),
        images.length - 1
      );
      const img = images[actualFrameIndex] || images[0];

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      const canvasRatio = window.innerWidth / window.innerHeight;
      const imgRatio = img.width / img.height;

      let width, height, x, y;

      if (imgRatio > canvasRatio) {
        height = window.innerHeight;
        width = height * imgRatio;
        x = (window.innerWidth - width) / 2;
        y = 0;
      } else {
        width = window.innerWidth;
        height = width / imgRatio;
        x = 0;
        y = (window.innerHeight - height) / 2;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = isMobile ? "medium" : "high";

      ctx.drawImage(img, x, y, width, height);
    };

    const handleScroll = () => {
      const currentTime = Date.now();
      if (currentTime - lastScrollTime < scrollThrottle) {
        return;
      }
      lastScrollTime = currentTime;

      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const heroSection = document.getElementById("hero");
      const aboutSection = document.getElementById("about");

      if (!heroSection || !aboutSection) return;

      const heroHeight = heroSection.offsetHeight;
      const heroTop = heroSection.offsetTop;
      const aboutTop = aboutSection.offsetTop;

      // CRITICAL: Only show model in hero section
      const fadeStart = heroTop + heroHeight * 0.3; // Start fading earlier
      const fadeEnd = aboutTop; // Completely hide when reaching about section

      let opacity = 1;

      if (scrollTop > fadeStart) {
        opacity = Math.max(
          0,
          1 - (scrollTop - fadeStart) / (fadeEnd - fadeStart)
        );
      }

      // COMPLETELY HIDE when past hero section
      if (scrollTop >= aboutTop) {
        opacity = 0;
        setIsInHero(false);
      } else {
        setIsInHero(true);
      }

      setCanvasOpacity(opacity);

      // Only animate frames when in hero section
      if (scrollTop < aboutTop) {
        const maxScroll = Math.max(0, aboutTop - heroTop);
        let progress = 0;
        if (maxScroll > 0) {
          progress = Math.min(
            1,
            Math.max(0, (scrollTop - heroTop) / maxScroll)
          );
          progress = easeInOutQuad(progress);
        }

        const frameIndex = progress * (images.length - 1);
        setCurrentFrame(frameIndex);

        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
        }
        animationFrameId = requestAnimationFrame(() => {
          renderFrame(frameIndex);
        });
      } else {
        // Stop rendering when not in hero section
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
        }
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      }

      canvas.style.opacity = opacity;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", setCanvasSize);

    // Initial render only if in hero
    if (isInHero) {
      renderFrame(0);
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", setCanvasSize);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [images, isMobile, isInHero]);

  return (
    <div className="canvas-container">
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-content">
            <div className="loading-text">
              Loading 3D Experience... {loadingProgress}%
            </div>
            <div className="loading-bar">
              <div
                className="loading-progress"
                style={{
                  width: `${loadingProgress}%`,
                }}
              ></div>
            </div>
            <div className="loading-info">
              {isMobile
                ? "📱 Mobile - Hero Section Only"
                : "💻 Desktop - Hero Section Only"}
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="error-overlay">
          <div className="error-text">{error}</div>
        </div>
      )}

      <canvas
        ref={canvasRef}
        className="three-d-canvas"
        style={{
          opacity: canvasOpacity,
          display: isInHero ? "block" : "none", // Completely hide when not in hero
        }}
      />
    </div>
  );
}

export default ThreeDModel;
