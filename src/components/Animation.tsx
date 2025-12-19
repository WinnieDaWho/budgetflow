import Lottie from "lottie-react";
import { useEffect, useState } from "react";

const animationCache: Record<string, any> = {};

export default function Animation({ url, className }: { url: string; className?: string }) {
  const [animationData, setAnimationData] = useState<any>(null);

  useEffect(() => {
    // 1. Check Cache
    if (animationCache[url]) {
      setAnimationData(animationCache[url]);
      return;
    }

    // 2. Fetch safely (Local or Remote)
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("File not found");
        return res.json();
      })
      .then((data) => {
        animationCache[url] = data;
        setAnimationData(data);
      })
      .catch((err) => {
        console.warn(`Animation missing: ${url}`); // Log warning, don't crash
      });
  }, [url]);

  // 3. Show a simple grey box if loading or failed (Prevents Black Screen)
  if (!animationData) return <div className={`bg-white/5 animate-pulse rounded-2xl ${className}`} />;

  return <Lottie animationData={animationData} loop={true} className={className} />;
}