document.getElementById("analyzeBtn").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  const url = tab.url;

  // Redirect to your React app with URL as query param
  const redirectUrl = `https://styleages.vercel.app//?url=${encodeURIComponent(url)}`;

  chrome.tabs.create({ url: redirectUrl });
});