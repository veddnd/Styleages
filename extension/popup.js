document.getElementById("analyzeBtn").addEventListener("click", async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    const results = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
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
                colors: Array.from(colors).slice(0, 20),
                fonts: Array.from(fonts)
            };
        }
    });

    const styles = results[0].result;

    console.log("Extracted styles:", styles); // 🔍 DEBUG

    // 🔥 Save in localStorage of NEW TAB (IMPORTANT FIX)
    chrome.tabs.create({
        url: "https://styleages.vercel.app",
    }, (newTab) => {
        chrome.scripting.executeScript({
            target: { tabId: newTab.id },
            func: (data) => {
                localStorage.setItem("styles", JSON.stringify(data));
            },
            args: [styles]
        });
    });
});