"use client";

import { useEffect, useState } from "react";

const CircularPercentage = ({
  percentage,
  color,
  color2,
}: {
  percentage: number;
  color: string;
  color2: string;
}) => {
  const [animatedPercentage, setAnimatedPercentage] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    let animationFrameId: number;

    const animate = () => {
      if (animatedPercentage < percentage) {
        setAnimatedPercentage((prevPercentage) =>
          Math.min(prevPercentage + 1, percentage)
        );
        animationFrameId = requestAnimationFrame(animate);
      } else if (animatedPercentage > percentage) {
        setAnimatedPercentage((prevPercentage) =>
          Math.max(prevPercentage - 1, percentage)
        );
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setIsAnimating(false); // Hentikan animasi saat mencapai nilai persentase yang diinginkan
      }
    };

    if (isAnimating) {
      animationFrameId = requestAnimationFrame(animate); // Mulai animasi jika sedang berjalan
    }

    return () => cancelAnimationFrame(animationFrameId);
  }, [animatedPercentage, percentage, isAnimating]);

  useEffect(() => {
    if (percentage !== animatedPercentage) {
      setIsAnimating(true); // Mulai animasi jika persentase berubah
    }
  }, [percentage, animatedPercentage]);

  const radius = 40;
  const angle = (animatedPercentage / 100) * 360;
  const x = Math.cos(((angle - 90) * Math.PI) / 180) * radius;
  const y = Math.sin(((angle - 90) * Math.PI) / 180) * radius;
  const isLargeArc = angle > 180 ? 1 : 0;
  const pathData = `M 0 -${radius} A ${radius} ${radius} 0 ${isLargeArc} 1 ${x} ${y}`;

  return (
    <svg width="100" height="100" viewBox="-50 -50 100 100">
      <circle
        cx="0"
        cy="0"
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth="10"
        className={color2}
      />
      <path
        d={pathData}
        fill="none"
        stroke="currentColor"
        strokeWidth="10"
        strokeLinecap="round"
        className={color}
      />
      <text
        x="0"
        y="5"
        textAnchor="middle"
        fontSize="20"
        fill="currentColor"
        className={color}
      >
        {animatedPercentage}%
      </text>
    </svg>
  );
};

const CircularPercentageTwo = ({
  percentage,
  color,
  color2,
}: {
  percentage: number;
  color: string;
  color2: string;
}) => {
  const [animatedPercentage, setAnimatedPercentage] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    let animationFrameId: number;

    const animate = () => {
      if (animatedPercentage < percentage) {
        setAnimatedPercentage((prevPercentage) =>
          Math.min(prevPercentage + 1, percentage)
        );
        animationFrameId = requestAnimationFrame(animate);
      } else if (animatedPercentage > percentage) {
        setAnimatedPercentage((prevPercentage) =>
          Math.max(prevPercentage - 1, percentage)
        );
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setIsAnimating(false); // Hentikan animasi saat mencapai nilai persentase yang diinginkan
      }
    };

    if (isAnimating) {
      animationFrameId = requestAnimationFrame(animate); // Mulai animasi jika sedang berjalan
    }

    return () => cancelAnimationFrame(animationFrameId);
  }, [animatedPercentage, percentage, isAnimating]);

  useEffect(() => {
    if (percentage !== animatedPercentage) {
      setIsAnimating(true); // Mulai animasi jika persentase berubah
    }
  }, [percentage, animatedPercentage]);

  const radius = 30;
  const angle = (animatedPercentage / 100) * 360;
  const x = Math.cos(((angle - 90) * Math.PI) / 180) * radius;
  const y = Math.sin(((angle - 90) * Math.PI) / 180) * radius;
  const isLargeArc = angle > 180 ? 1 : 0;
  const pathData = `M 0 -${radius} A ${radius} ${radius} 0 ${isLargeArc} 1 ${x} ${y}`;

  return (
    <svg width="100" height="100" viewBox="-50 -50 100 100">
      <circle
        cx="0"
        cy="0"
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth="8"
        className={color2}
      />
      <path
        d={pathData}
        fill="none"
        stroke="currentColor"
        strokeWidth="8"
        strokeLinecap="round"
        className={color}
      />
      <text
        x="0"
        y="5"
        textAnchor="middle"
        fontSize="13"
        fill="currentColor"
        className={color}
      >
        {animatedPercentage}%
      </text>
    </svg>
  );
};

export { CircularPercentage, CircularPercentageTwo };
