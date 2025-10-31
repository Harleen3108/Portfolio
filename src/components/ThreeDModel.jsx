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
  const [isLowEndDevice, setIsLowEndDevice] = useState(false);

  // Device detection
  useEffect(() => {
    const checkDevice = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);

      // Detect low-end devices
      const isLowEnd =
        mobile &&
        (navigator.hardwareConcurrency < 4 || 
         navigator.deviceMemory < 4 ||
         !window.matchMedia("(min-resolution: 2dppx)").matches);
      setIsLowEndDevice(isLowEnd);
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  // Easing function
  const easeInOutQuad = (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

  // Preload images with optimized paths
  useEffect(() => {
    let totalFrames;
    if (isLowEndDevice) {
      totalFrames = 20;
    } else if (isMobile) {
      totalFrames = 30;
    } else {
      totalFrames = 79;
    }

    const loadedImages = new Array(totalFrames);

    const createPlaceholder = (width, height, frameNum) => {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");

      ctx.fillStyle = "#0f1419";
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = "#66fcf1";
      ctx.font = "bold 20px Arial";
      ctx.textAlign = "center";
      ctx.fillText(`${frameNum}`, width / 2, height / 2);

      const img = new Image();
      img.src = canvas.toDataURL();
      return img;
    };

    const loadImage = (index) => {
      return new Promise((resolve) => {
        const img = new Image();

        img.onload = () => {
          loadedImages[index - 1] = img;
          setLoadingProgress(Math.floor((index / totalFrames) * 100));
          resolve(true);
        };

        img.onerror = () => {
          console.warn(`Failed to load frame ${index}, using placeholder`);
          const width = isMobile ? 640 : 1920;
          const height = isMobile ? 360 : 1080;
          loadedImages[index - 1] = createPlaceholder(width, height, index);
          setLoadingProgress(Math.floor((index / totalFrames) * 100));
          resolve(false);
        };

        // FIXED: Correct frame number calculation
        // Map reduced frames to original frame range (1-79)
        const originalFrameIndex = Math.floor((index / totalFrames) * 79) + 1;
        const frameNumber = String(originalFrameIndex).padStart(4, "0");

        // Use optimized paths
        let imagePath;
        if (isLowEndDevice) {
          imagePath = `/video-frames/mobile-low/frame_${frameNumber}.jpg`;
        } else if (isMobile) {
          imagePath = `/video-frames/mobile/frame_${frameNumber}.jpg`;
        } else {
          imagePath = `/video-frames/frame_${frameNumber}.jpg`;
        }

        img.src = imagePath;
      });
    };

    const loadAllImages = async () => {
      setIsLoading(true);
      setError(null);
      setLoadingProgress(0);

      try {
        const batchSize = isMobile ? 5 : 10;
        for (let i = 1; i <= totalFrames; i += batchSize) {
          const batchPromises = [];
          for (let j = i; j < Math.min(i + batchSize, totalFrames + 1); j++) {
            batchPromises.push(loadImage(j));
          }
          await Promise.all(batchPromises);

          if (isMobile) {
            await new Promise((resolve) => setTimeout(resolve, 50));
          }
        }

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
  }, [isMobile, isLowEndDevice]);

  // Canvas and scroll handling
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || images.length === 0) return;

    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let lastScrollTime = 0;
    const scrollThrottle = isMobile ? 32 : 16;

    const setCanvasSize = () => {
      // FIXED: Use proper DPR for quality
      const dpr = isMobile ? Math.min(2, window.devicePixelRatio || 1) : (window.devicePixelRatio || 1);
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
      if (images.length === 0) {
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
        return;
      }

      const actualFrameIndex = Math.min(
        Math.floor(frameIndex),
        images.length - 1
      );
      const img = images[actualFrameIndex] || images[0];

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      const canvasRatio = window.innerWidth / window.innerHeight;
      const imgRatio = img.width / img.height;

      let width, height, x, y;

      // FIXED: Better cover behavior for mobile
      if (imgRatio > canvasRatio) {
        // Image is wider - fit to height and crop sides
        height = window.innerHeight;
        width = height * imgRatio;
        x = (window.innerWidth - width) / 2;
        y = 0;
      } else {
        // Image is taller - fit to width and crop top/bottom
        width = window.innerWidth;
        height = width / imgRatio;
        x = 0;
        y = (window.innerHeight - height) / 2;
      }

      // FIXED: Better image smoothing settings
      if (isMobile) {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "low"; // Low quality for mobile performance
      } else {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
      }

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

      const fadeStart = heroTop + heroHeight * 0.3;
      const fadeEnd = aboutTop + 200;
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

    renderFrame(0);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", setCanvasSize);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [images, isMobile]);

  return (
    <div className="canvas-container">
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-content">
            <div className="loading-text">
              {isLowEndDevice
                ? "📱 Lite Mode"
                : isMobile
                ? "📱 Mobile Optimized"
                : "💻 Loading"}
              ... {loadingProgress}%
            </div>
            <div className="loading-bar">
              <div
                className="loading-progress"
                style={{
                  width: `${loadingProgress}%`,
                }}
              ></div>
            </div>
            {isLowEndDevice && (
              <div className="loading-info">
                Using performance mode for smooth experience
              </div>
            )}
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