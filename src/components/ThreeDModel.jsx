import React, { useRef, useEffect, useState } from "react";
import "../styles/hero.css";

function ThreeDModel() {
  const canvasRef = useRef(null);
  const [images, setImages] = useState([]);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [canvasOpacity, setCanvasOpacity] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

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

  // Preload images - FULL QUALITY & FULL SIZE ON MOBILE
  useEffect(() => {
    const totalFrames = 79; // FULL frames on both mobile and desktop

    const loadedImages = new Array(totalFrames);

    const createPlaceholder = (width, height, frameNum) => {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");

      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, "#1a1a2e");
      gradient.addColorStop(1, "#16213e");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = "#66fcf1";
      ctx.font = "bold 24px Arial";
      ctx.textAlign = "center";
      ctx.fillText(`Loading... ${frameNum}`, width / 2, height / 2);

      const img = new Image();
      img.src = canvas.toDataURL();
      img.width = width;
      img.height = height;
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
          console.warn(`Failed to load frame ${index}, using placeholder`);
          // Use original size placeholders
          const placeholder = createPlaceholder(1200, 800, index);
          loadedImages[index - 1] = placeholder;
          setLoadingProgress(Math.floor((index / totalFrames) * 100));
          resolve(false);
        };

        // ALWAYS use original high-quality, full-size frames
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
        // Load all frames at once for full quality
        const loadPromises = [];
        for (let i = 1; i <= totalFrames; i++) {
          loadPromises.push(loadImage(i));
        }

        await Promise.all(loadPromises);
        setImages(loadedImages.filter((img) => img !== undefined));
        setIsLoading(false);
        setLoadingProgress(100);
      } catch (err) {
        setError("Failed to load images");
        setIsLoading(false);
        console.error("Error loading images:", err);
      }
    };

    loadAllImages();
  }, [isMobile]);

  // Setup canvas - FULL SIZE RENDERING ON MOBILE
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || images.length === 0) return;

    const ctx = canvas.getContext("2d");
    let animationFrameId;

    const setCanvasSize = () => {
      // Use FULL DPR for maximum quality on mobile
      const dpr = window.devicePixelRatio || 1;
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

      // FULL SIZE RENDERING - SAME FOR BOTH MOBILE AND DESKTOP
      // Use cover behavior to fill entire screen with model
      if (imgRatio > canvasRatio) {
        // Image is wider than screen - fit to height
        height = window.innerHeight;
        width = height * imgRatio;
        x = (window.innerWidth - width) / 2;
        y = 0;
      } else {
        // Image is taller than screen - fit to width
        width = window.innerWidth;
        height = width / imgRatio;
        x = 0;
        y = (window.innerHeight - height) / 2;
      }

      // MAXIMUM QUALITY on both mobile and desktop
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      ctx.drawImage(img, x, y, width, height);
    };

    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const heroSection = document.getElementById("hero");
      const aboutSection = document.getElementById("about");

      if (!heroSection || !aboutSection) return;

      const heroHeight = heroSection.offsetHeight;
      const heroTop = heroSection.offsetTop;
      const aboutTop = aboutSection.offsetTop;

      const fadeStart = heroTop + heroHeight * 0.5;
      const fadeEnd = aboutTop + 400;
      const fadeDistance = fadeEnd - fadeStart;

      let opacity = 1;
      if (scrollTop > fadeStart) {
        opacity = Math.max(0, 1 - (scrollTop - fadeStart) / fadeDistance);
        setCanvasOpacity(opacity);
      } else {
        setCanvasOpacity(1);
      }

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

        // Smooth rendering
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
        }
        animationFrameId = requestAnimationFrame(() => {
          renderFrame(frameIndex);
        });
      }

      canvas.style.opacity = opacity;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", setCanvasSize);

    // Initial render
    renderFrame(0);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", setCanvasSize);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [images]);

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
                ? "📱 Mobile - Full Size & Quality"
                : "💻 Desktop - Full Size & Quality"}
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
        style={{ opacity: canvasOpacity }}
      />
    </div>
  );
}

export default ThreeDModel;
