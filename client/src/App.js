import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  // ✅ Get styles from Chrome Extension
  useEffect(() => {
    const stored = localStorage.getItem("styles");

    if (stored) {
      setData(JSON.parse(stored));
    } else {
      setError("No styles found. Please use the Chrome extension.");
    }
  }, []);

  // 🎨 Generate Image
  const generate = async () => {
    if (!prompt || !data) return;

    setAiLoading(true);
    setImage("");
    setError("");

    try {
      const res = await axios.post(
        "https://styleages.onrender.com/generate", // 🔥 replace with your real backend URL
        {
          styles: data,
          prompt,
        }
      );

      setImage(res.data.image);
    } catch (err) {
      setError("Error generating image.");
    }

    setAiLoading(false);
  };

  return (
    <div className="container">
      <h1>Style Analyzer</h1>

      {/* Error */}
      {error && <p className="error">{error}</p>}

      {/* Results */}
      {data && (
        <div className="results">
          <h2>🎨 Color Palette</h2>
          <div className="colors">
            {data.colors.map((c, i) => (
              <div key={i} className="color-item">
                <div
                  className="color-box"
                  style={{ background: c }}
                ></div>
                <span>{c}</span>
              </div>
            ))}
          </div>

          <h2>🔤 Fonts Used</h2>
          <ul className="fonts">
            {data.fonts.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>

          {/* AI Image Section */}
          <h2>🎯 Generate Poster</h2>

          <input
            type="text"
            placeholder="e.g. Movie Night Poster"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />

          <button onClick={generate}>Generate</button>

          {aiLoading && <p>Generating image...</p>}

          {image && (
            <div className="ai-box">
              <h3>🖼 Generated Poster</h3>
              <img
                src={image}
                alt="Generated Poster"
                className="generated-img"
                onError={() =>
                  console.log("Image failed to load:", image)
                }
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;