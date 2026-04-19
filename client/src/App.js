import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [url, setUrl] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const extractedUrl = params.get("url");

  if (extractedUrl) {
    setUrl(extractedUrl);
  }
}, []);

  // 🔍 Analyze Website
  const analyze = async () => {
    if (!url) return;

    setLoading(true);
    setError("");
    setData(null);
    setImage("");

    try {
      const res = await axios.post("http://localhost:5000/analyze", { url });
      setData(res.data);
    } catch (err) {
      setError("Failed to analyze. Try another URL.");
    }

    setLoading(false);
  };

  // 🎨 Generate Image
  const generate = async () => {
    if (!prompt || !data) return;

    setAiLoading(true);
    setImage("");

    try {
      const res = await axios.post("http://localhost:5000/generate", {
        styles: data,
        prompt,
      });

      setImage(res.data.image);
    } catch (err) {
      setError("Error generating image.");
    }

    setAiLoading(false);
  };
  

  return (
    <div className="container">
      <h1>Style Analyzer</h1>

      {/* URL Input */}
      <div className="input-box">
        <input
          type="text"
          placeholder="Enter website URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button onClick={analyze}>Analyze</button>
      </div>

      {/* Loading & Error */}
      {loading && <p>Analyzing website...</p>}
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
              {/* <img src={image} alt="Generated Poster" className="generated-img" /> */}
              <img
                src={image}
                alt="Generated Poster"
                className="generated-img"
                onError={() => console.log("Image failed to load:", image)}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;