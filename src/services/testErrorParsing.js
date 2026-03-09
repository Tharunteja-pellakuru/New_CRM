const parseRetryAfter = (error) => {
  const msg = error?.message || "";

  // Groq format: "Please try again in 5m43.008s"
  const groqMatch = msg.match(
    /try again in (?:(\d+)h)?(?:(\d+)m)?(?:([\d.]+)s)?/i,
  );
  if (groqMatch) {
    const hours = parseInt(groqMatch[1] || "0");
    const minutes = parseInt(groqMatch[2] || "0");
    const seconds = parseFloat(groqMatch[3] || "0");

    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
    const retryDelay = Math.ceil(totalSeconds) + 2;

    let timeStr = "";
    if (hours > 0) timeStr += `${hours}h `;
    if (minutes > 0) timeStr += `${minutes}m `;
    if (seconds > 0) timeStr += `${seconds}s`;
    const retryAfter = timeStr.trim();
    return { retryDelay, retryAfter };
  }

  // Gemini format: "retry in 10s"
  const geminiMatch = msg.match(/retry in ([\d.]+)s/i);
  if (geminiMatch) {
    const retryDelay = Math.ceil(parseFloat(geminiMatch[1])) + 2;
    const retryAfter = `${geminiMatch[1]}s`;
    return { retryDelay, retryAfter };
  }
  return null;
};

const testCases = [
  {
    name: "Groq m and s",
    msg: "Rate limit reached for model `llama-3.3-70b-versatile` ... Please try again in 5m43.008s. Need more tokens?",
    expectedDelay: 346, // (5*60 + 43.008) = 343.008 -> ceil=344 + 2 = 346
    expectedAfter: "5m 43.008s",
  },
  {
    name: "Groq h, m and s",
    msg: "Please try again in 1h2m3s",
    expectedDelay: 3725, // (3600 + 120 + 3) = 3723 + 2 = 3725
    expectedAfter: "1h 2m 3s",
  },
  {
    name: "Groq s only",
    msg: "Please try again in 45s",
    expectedDelay: 47,
    expectedAfter: "45s",
  },
  {
    name: "Gemini format",
    msg: "Quota reached, retry in 10.5s",
    expectedDelay: 13,
    expectedAfter: "10.5s",
  },
];

testCases.forEach((tc) => {
  const result = parseRetryAfter({ message: tc.msg });
  console.log(`Test: ${tc.name}`);
  console.log(`  Input: ${tc.msg}`);
  console.log(
    `  Result: delay=${result?.retryDelay}, after=${result?.retryAfter}`,
  );
  const delayOk = result?.retryDelay === tc.expectedDelay;
  const afterOk = result?.retryAfter === tc.expectedAfter;
  console.log(`  Status: ${delayOk && afterOk ? "PASS" : "FAIL"}`);
  if (!delayOk)
    console.log(
      `    Expected Delay: ${tc.expectedDelay}, Got: ${result?.retryDelay}`,
    );
  if (!afterOk)
    console.log(
      `    Expected After: ${tc.expectedAfter}, Got: ${result?.retryAfter}`,
    );
});
