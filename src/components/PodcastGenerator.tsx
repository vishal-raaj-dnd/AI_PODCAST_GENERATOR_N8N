import { useState } from "react";
import { Mic, Headphones, AlertCircle } from "lucide-react";
import LoadingDots from "./LoadingDots";

type Status = "idle" | "loading" | "complete" | "error";

const WEBHOOK_URL = "https://workflow.ccbp.in/webhook-test/a557d9b7-30a0-48ce-9727-a44b86b845e9";

const PodcastGenerator = () => {
  const [topic, setTopic] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    
    setStatus("loading");
    setAudioUrl(null);
    
    try {
      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: topic.trim() }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to generate podcast");
      }
      
      const data = await response.json();
      
      if (data.audioFile) {
        setAudioUrl(data.audioFile);
        setStatus("complete");
        setTopic(""); // Clear input for next topic
      } else {
        throw new Error("No audio file received");
      }
    } catch (error) {
      console.error("Error generating podcast:", error);
      setStatus("error");
    }
  };

  const renderPlayerContent = () => {
    switch (status) {
      case "loading":
        return (
          <div className="flex flex-col items-center gap-3">
            <p className="text-lg font-medium">Creating podcast... please wait!</p>
            <LoadingDots />
          </div>
        );
      case "complete":
        return (
          <div className="flex flex-col items-center gap-4 w-full">
            <div className="flex items-center gap-2">
              <Headphones className="w-8 h-8 text-primary" />
              <p className="text-lg font-semibold text-primary">🎉 Podcast is ready! Click play to listen</p>
            </div>
            {audioUrl && (
              <audio 
                controls 
                className="w-full max-w-md rounded-lg"
                src={audioUrl}
              >
                Your browser does not support the audio element.
              </audio>
            )}
          </div>
        );
      case "error":
        return (
          <div className="flex flex-col items-center gap-3">
            <AlertCircle className="w-10 h-10 text-destructive" />
            <p className="text-lg font-medium text-destructive">Oops! Something went wrong. Please try again</p>
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
