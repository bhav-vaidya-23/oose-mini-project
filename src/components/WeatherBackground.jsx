import { useEffect, useRef, useState } from "react";
import "./WeatherBackground.css";

const VIDEO_PATHS = {
  sunny: "/sunny.mp4",
  heatwave: "/heatwave.mp4",
  cloudy: "/cloudy.mp4",
  rain: "/rain.mp4",
};

const FADE_DURATION_MS = 700;

function getCondition(current) {
  const reportedCondition = String(current.condition || current.weatherCondition || "").toLowerCase();
  if (reportedCondition.includes("rain") || reportedCondition.includes("storm")) return "rain";
  if (reportedCondition.includes("cloud") || reportedCondition.includes("overcast")) return "cloudy";
  if (reportedCondition.includes("clear") || reportedCondition.includes("sun")) return "sunny";

  if ((Number(current.rainfall) || 0) >= 5) return "rain";
  if ((Number(current.cloudCover) || 0) >= 45) return "cloudy";
  return "sunny";
}

function getVideo(current, prediction) {
  const condition = getCondition(current);
  const riskScore = Number(prediction.riskScore) || 0;
  const severity = String(prediction.severity || "").toLowerCase();
  const highRisk = riskScore >= 60 || severity.includes("high") || severity.includes("extreme");

  if (highRisk) return VIDEO_PATHS.heatwave;
  if (condition === "cloudy") return VIDEO_PATHS.cloudy;
  if (condition === "rain") return VIDEO_PATHS.rain;
  return VIDEO_PATHS.sunny;
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function WeatherBackground({ current, prediction }) {
  const videoPath = getVideo(current, prediction);
  const videoRefs = useRef([]);
  const activeSlot = useRef(-1);
  const activePath = useRef(null);
  const fadeTimer = useRef(null);
  const [reducedMotion, setReducedMotion] = useState(prefersReducedMotion);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = (event) => setReducedMotion(event.matches);
    mediaQuery.addEventListener("change", updatePreference);
    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    window.clearTimeout(fadeTimer.current);

    if (reducedMotion) {
      videoRefs.current.forEach((video) => {
        if (!video) return;
        video.pause();
        video.removeAttribute("src");
        video.classList.remove("is-active");
        video.load();
      });
      activeSlot.current = -1;
      activePath.current = null;
      return undefined;
    }

    if (activePath.current === videoPath) return undefined;

    const nextSlot = activeSlot.current === 0 ? 1 : 0;
    const nextVideo = videoRefs.current[nextSlot];
    const previousSlot = activeSlot.current;
    const previousVideo = previousSlot < 0 ? null : videoRefs.current[previousSlot];
    let isStaleRequest = false;
    const handleCanPlay = () => {
      if (isStaleRequest) return;
      nextVideo.play().then(() => {
        if (isStaleRequest) return;
        nextVideo.classList.add("is-active");
        previousVideo?.classList.remove("is-active");
        activeSlot.current = nextSlot;
        activePath.current = videoPath;

        if (previousVideo) {
          fadeTimer.current = window.setTimeout(() => {
            previousVideo.pause();
            previousVideo.removeAttribute("src");
            previousVideo.load();
          }, FADE_DURATION_MS);
        }
      }, () => {});
    };

    nextVideo.addEventListener("canplay", handleCanPlay);
    nextVideo.src = videoPath;
    nextVideo.load();

    return () => {
      isStaleRequest = true;
      nextVideo.removeEventListener("canplay", handleCanPlay);
    };
  }, [videoPath, reducedMotion]);

  return (
    <div
      className={`weather-background weather-background--${videoPath.slice(1, -4)}`}
      aria-hidden="true"
    >
      {[0, 1].map((slot) => (
        <video
          key={slot}
          ref={(video) => { videoRefs.current[slot] = video; }}
          className="weather-background__video"
          autoPlay={!reducedMotion}
          muted
          loop
          playsInline
          preload="none"
        />
      ))}
      <span className="weather-background__readability-overlay" />
    </div>
  );
}
