import { useState, useEffect } from "react";
import { EVENT_DATE } from "../lib/config";

type CountdownState =
  | { status: "counting-days"; days: number }
  | { status: "counting-hours"; hours: number; minutes: number }
  | { status: "celebrating" };

function computeCountdown(): CountdownState {
  const now = Date.now();
  const eventMs = EVENT_DATE.getTime();
  const diffMs = eventMs - now;

  if (diffMs <= 0) {
    return { status: "celebrating" };
  }

  const totalHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (totalHours > 24) {
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    return { status: "counting-days", days };
  }

  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  return { status: "counting-hours", hours, minutes };
}

export default function Countdown() {
  const [countdown, setCountdown] = useState<CountdownState>(() =>
    computeCountdown()
  );

  useEffect(() => {
    // Update every 60 seconds
    const interval = setInterval(() => {
      setCountdown(computeCountdown());
    }, 60_000);

    return () => clearInterval(interval);
  }, []);

  let text: string;

  if (countdown.status === "celebrating") {
    text = "¡Hoy es el cumple de Dino!";
  } else if (countdown.status === "counting-days") {
    text = `Faltan ${countdown.days} días`;
  } else {
    text = `Faltan ${countdown.hours} horas y ${countdown.minutes} minutos`;
  }

  return (
    <div className="w-full text-center animate-pulse">
      <div
        className="inline-block px-4 py-1 rounded-full text-center"
        style={{
          background: 'linear-gradient(180deg, #F4C430 0%, #E0A810 100%)',
          color: '#1A1A1A',
          fontFamily: "'Fredoka', sans-serif",
          boxShadow: '0 2px 0 #B8900A',
        }}
      >
        <p className="font-bold text-base md:text-xl leading-tight whitespace-nowrap mx-2">
          {text}
        </p>
      </div>
    </div>
  );
}
