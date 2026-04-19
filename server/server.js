require("dotenv").config();
const express = require("express");
const cors = require("cors");
const puppeteer = require("puppeteer");
const OpenAI = require("openai");

// const client = new OpenAI({
//     apiKey: process.env.OPENAI_API_KEY,
// });

const app = express();
app.use(cors());
app.use(express.json());

app.post("/analyze", async (req, res) => {
    const { url } = req.body;

    try {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();

        await page.goto(url, { waitUntil: "networkidle2" });

        const data = await page.evaluate(() => {
            const elements = document.querySelectorAll("*");

            let colors = new Set();
            let fonts = new Set();

            elements.forEach(el => {
                const style = window.getComputedStyle(el);

                // if (style.color) colors.add(style.color);
                // if (style.backgroundColor) colors.add(style.backgroundColor);
                if (style.color && style.color !== "rgba(0, 0, 0, 0)") {
                    colors.add(style.color);
                }
                if (style.backgroundColor && style.backgroundColor !== "rgba(0, 0, 0, 0)") {
                    colors.add(style.backgroundColor);
                }
                if (style.fontFamily) fonts.add(style.fontFamily);
            });

            return {
                colors: Array.from(colors),
                fonts: Array.from(fonts)
            };
        });

        await browser.close();

        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// app.post("/generate", async (req, res) => {
//     const { styles, prompt } = req.body;
//     console.log("API KEY:", process.env.OPENAI_API_KEY);

//     try {
//         const response = await client.chat.completions.create({
//             model: "gpt-4.1-mini",
//             messages: [
//                 {
//                     role: "system",
//                     content:
//                         "You are a creative designer. Generate design ideas using given styles.",
//                 },
//                 {
//                     role: "user",
//                     content: `
// Styles:
// Colors: ${styles.colors.join(", ")}
// Fonts: ${styles.fonts.join(", ")}

// Task:
// Create 3 creative design ideas for: ${prompt}
// `,
//                 },
//             ],
//         });

//         res.json({ result: response.choices[0].message.content });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });


// app.post("/generate", async (req, res) => {
//     const { styles, prompt } = req.body;

//     try {
//         const response = await client.chat.completions.create({
//             model: "gpt-4o-mini",  // ✅ safer model
//             messages: [
//                 {
//                     role: "user",
//                     content: `Using these styles:
// Colors: ${styles.colors.join(", ")}
// Fonts: ${styles.fonts.join(", ")}

// Generate 3 creative ${prompt} ideas.`,
//                 },
//             ],
//         });

//         res.json({ result: response.choices[0].message.content });

//     } catch (err) {
//         console.error("OpenAI Error:", err.message);
//         res.status(500).json({ error: err.message });
//     }
// });

const axios = require("axios");

// app.post("/generate", async (req, res) => {
//     const { styles, prompt } = req.body;

//     try {
//         const fullPrompt = `
// Create a high-quality poster:
// Theme: ${prompt}
// Colors: ${styles.colors.join(", ")}
// Fonts: ${styles.fonts.join(", ")}
// Style: cinematic, modern UI
// `;

//         const response = await axios.post(
//             "https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5",
//             {
//                 inputs: fullPrompt,
//             },
//             {
//                 headers: {
//                     Authorization: `Bearer ${process.env.HF_API_KEY}`,
//                 },
//                 responseType: "arraybuffer", // IMPORTANT
//             }
//         );
//         console.log("HF KEY:", process.env.HF_API_KEY);

//         const base64Image = Buffer.from(response.data, "binary").toString("base64");

//         res.json({
//             image: `data:image/png;base64,${base64Image}`,
//         });

//     } catch (err) {
//         console.error(err.message);
//         res.status(500).json({ error: "Image generation failed" });
//     }
// });


// app.post("/generate", async (req, res) => {
//     const { styles, prompt } = req.body;

//     try {
//         const fullPrompt = `
// A high quality poster for: ${prompt}.
// Use colors: ${styles.colors.slice(0, 5).join(", ")}.
// Modern, clean, cinematic design.
// `;

//         const response = await axios.post(
//             "https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5",
//             {
//                 inputs: fullPrompt,
//             },
//             {
//                 headers: {
//                     Authorization: `Bearer ${process.env.HF_API_KEY}`,
//                 },
//                 responseType: "arraybuffer",
//             }
//         );

//         const base64Image = Buffer.from(response.data, "binary").toString("base64");

//         res.json({
//             image: `data:image/png;base64,${base64Image}`,
//         });

//     } catch (err) {
//         console.error("HF ERROR:", err.response?.data || err.message);
//         res.status(500).json({ error: "Image generation failed" });
//     }
// });

app.post("/generate", async (req, res) => {
  const { styles, prompt } = req.body;

  try {
    const fullPrompt = `
${prompt} poster, modern design,
colors ${styles.colors.slice(0, 3).join(", ")},
clean layout, high quality
`;

    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(fullPrompt)}`;

    res.json({
      image: imageUrl
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Image generation failed" });
  }
});

app.listen(5000, () => console.log("Server running on 5000"));