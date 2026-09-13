import { useState, useEffect } from "react";
import { FaHeart, FaPlay, FaPause } from "react-icons/fa";
import "./index.css";

// Countdown Timer Component
function CountdownTimer() {
  const targetDate = new Date("2025-10-31T04:35:00Z");
  const [timeLeft, setTimeLeft] = useState({});

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const diff = targetDate - now;

      if (diff <= 0) {
        clearInterval(interval);
        setTimeLeft({ message: "🎉 The Big Day is Here! 🎉" });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (timeLeft.message) return <p className="countdown">{timeLeft.message}</p>;

  return (
    <div className="countdown">
      <div>{timeLeft.days}d</div>
      <div>{timeLeft.hours}h</div>
      <div>{timeLeft.minutes}m</div>
      <div>{timeLeft.seconds}s</div>
    </div>
  );
}

// 🎵 Music Player Component
function MusicPlayer() {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef(null);

  const togglePlay = () => {
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setPlaying(!playing);
  };

  return (
    <div className="music-player">
      <audio ref={audioRef} src="/music/weddingmusic.mp3" loop />
      <motion.button
        className="music-btn"
        onClick={togglePlay}
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.9 }}
      >
        {playing ? <FaPause size={24} color="#ff69b4" /> : <FaPlay size={24} color="#ff69b4" />}
      </motion.button>
    </div>
  );
}

// 💌 Guest Wishes Component
function GuestWishes() {
  const [wishes, setWishes] = useState([]);
  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newWish = {
      id: Date.now(),
      text: input.trim(),
    };

    setWishes([newWish, ...wishes]);
    setInput("");
  };

  return (
    <div className="wishes-section">
      <h2>💌 Send Your Wishes 💌</h2>

      <form onSubmit={handleSubmit} className="wish-form">
        <input
          type="text"
          placeholder="Type your wish here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>

      <div className="wish-list">
        {wishes.map((wish) => (
          <motion.div
            key={wish.id}
            className="wish"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {wish.text}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// 🌸 Main App
export default function App() {
  return (
    <div className="hero">
      <motion.h1
        className="title"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        💖 The Wedding of Rahul & Priya 💖
      </motion.h1>

      <p className="subtitle">Join us on October 31, 2025 — 10:05 AM IST</p>

      <CountdownTimer />

      <motion.div
        className="heart"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <FaHeart color="hotpink" size={60} />
      </motion.div>

      <GuestWishes />
      <MusicPlayer />
    </div>
  );
}
