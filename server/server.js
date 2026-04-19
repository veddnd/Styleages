require("dotenv").config();
const express = require("express");
const cors = require("cors");
const puppeteer = require("puppeteer");
const OpenAI = require("openai");

// const client = new OpenAI({
//     apiKey: process.env.OPENAI_API_KEY,
// });

const app = express();
app.use(cors({
    origin: "*"
}));
app.use(express.json());

// app.post("/analyze", async (req, res) => {
//     const { url } = req.body;

//     try {
//         const browser = await puppeteer.launch({ headless: true });
//         const page = await browser.newPage();

//         await page.goto(url, { waitUntil: "networkidle2" });

//         const data = await page.evaluate(() => {
//             const elements = document.querySelectorAll("*");

//             let colors = new Set();
//             let fonts = new Set();

//             elements.forEach(el => {
//                 const style = window.getComputedStyle(el);

//                 // if (style.color) colors.add(style.color);
//                 // if (style.backgroundColor) colors.add(style.backgroundColor);
//                 if (style.color && style.color !== "rgba(0, 0, 0, 0)") {
//                     colors.add(style.color);
//                 }
//                 if (style.backgroundColor && style.backgroundColor !== "rgba(0, 0, 0, 0)") {
//                     colors.add(style.backgroundColor);
//                 }
//                 if (style.fontFamily) fonts.add(style.fontFamily);
//             });

//             return {
//                 colors: Array.from(colors),
//                 fonts: Array.from(fonts)
//             };
//         });

//         await browser.close();

//         res.json(data);
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

app.post("/analyze", async (req, res) => {
    const { url } = req.body;

    let browser;

    try {
        browser = await puppeteer.launch({
            headless: "new",
            args: [
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-dev-shm-usage",
                "--disable-gpu"
            ]
        });

        const page = await browser.newPage();

        await page.setUserAgent(
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36"
        );

        await page.goto(url, {
            waitUntil: "domcontentloaded",
            timeout: 30000
        });

        const data = await page.evaluate(() => {
            const elements = document.querySelectorAll("*");

            let colors = new Set();
            let fonts = new Set();

            elements.forEach(el => {
                const style = window.getComputedStyle(el);

                if (style.color && style.color !== "rgba(0, 0, 0, 0)") {
                    colors.add(style.color);
                }

                if (style.backgroundColor && style.backgroundColor !== "rgba(0, 0, 0, 0)") {
                    colors.add(style.backgroundColor);
                }

                if (style.fontFamily) {
                    fonts.add(style.fontFamily);
                }
            });

            return {
                colors: Array.from(colors).slice(0, 20), // limit size
                fonts: Array.from(fonts)
            };
        });

        await browser.close();

        res.json(data);

    } catch (err) {
        console.error("SCRAPE ERROR:", err.message);

        if (browser) await browser.close();

        // fallback (VERY IMPORTANT for demo)
        res.json({
            colors: ["#000000", "#ffffff", "#ff0000"],
            fonts: ["Arial", "sans-serif"],
            note: "Fallback due to scraping restrictions"
        });
    }
});

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