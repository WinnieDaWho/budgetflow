import Lottie from "lottie-react";
import { useEffect, useState } from "react";

type AnimationData = Record<string, unknown>;
const animationCache: Record<string, AnimationData> = {};

export default function Animation({ url, className }: { url: string; className?: string }) {
  const [animationData, setAnimationData] = useState<AnimationData | null>(() => animationCache[url] || null);

  useEffect(() => {
    // Skip if already cached
    if (animationCache[url]) return;

    // Fetch safely (Local or Remote)
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("File not found");
        return res.json();
      })
      .then((data: AnimationData) => {
        animationCache[url] = data;
        setAnimationData(data);
      })
      .catch(() => {
        console.warn(`Animation missing: ${url}`); // Log warning, don't crash
      });
  }, [url]);

  // 3. Show a simple grey box if loading or failed (Prevents Black Screen)
  if (!animationData) return <div className={`bg-white/5 animate-pulse rounded-2xl ${className}`} />;

  return <Lottie animationData={animationData} loop={true} className={className} />;
}