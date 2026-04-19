document.getElementById("analyzeBtn").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  const url = tab.url;

  // Redirect to your React app with URL as query param
  const redirectUrl = `http://localhost:3000/?url=${encodeURIComponent(url)}`;

  chrome.tabs.create({ url: redirectUrl });
});