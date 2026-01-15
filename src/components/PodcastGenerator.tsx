import { useState } from "react";
import { Mic, Headphones } from "lucide-react";
import LoadingDots from "./LoadingDots";

type Status = "idle" | "loading" | "complete";

const PodcastGenerator = () => {
  const [topic, setTopic] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  const handleGenerate = () => {
    if (!topic.trim()) return;
    
    setStatus("loading");
    
    // Simulate loading for 2-3 seconds
    const delay = 2000 + Math.random() * 1000;
    setTimeout(() => {
      setStatus("complete");
    }, delay);
  };

  const renderPlayerContent = () => {
    switch (status) {
      case "loading":
        return (
          <div className="flex flex-col items-center gap-3">
            <p className="text-lg font-medium">Generating your podcast...</p>
            <LoadingDots />
          </div>
        );
      case "complete":
        return (
          <div className="flex flex-col items-center gap-3">
            <Headphones className="w-10 h-10 text-primary" />
            <p className="text-xl font-semibold text-primary">Feature coming soon!</p>
            <p className="text-muted-foreground">We're working on bringing AI podcasts to you ✨</p>
          </div>
        );
      default:
        return (
          <div className="flex flex-col items-center gap-3">
            <Mic className="w-10 h-10 text-muted-foreground/50" />
            <p className="text-lg text-muted-foreground">Podcast will appear here</p>
          </div>
        );
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">
            🎙️ Podcast Generator
          </h1>
          <p className="text-muted-foreground">
            Turn any topic into an engaging podcast
          </p>
        </div>

        {/* Input Section */}
        <div className="flex flex-col gap-4">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Type podcast topic here..."
            className="podcast-input"
            disabled={status === "loading"}
          />
          
          <button
            onClick={handleGenerate}
            disabled={status === "loading" || !topic.trim()}
            className="generate-btn disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary"
          >
            <span>🔊</span>
            <span>Generate Podcast</span>
          </button>
        </div>

        {/* Audio Player Area */}
        <div className="audio-player-area min-h-[160px] flex items-center justify-center">
          {renderPlayerContent()}
        </div>
      </div>
    </div>
  );
};

export default PodcastGenerator;
