import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// ✅ CORS FIX
app.use(cors());

app.use(express.json());

// ✅ TEST ROUTE
app.get("/", (req, res) => {
  res.json({ status: "Backend running 🚀" });
});

// ✅ CHAT ROUTE
app.post("/api/chat", async (req, res) => {
  try {
    const { messages, model, temperature, max_tokens } = req.body;

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: model || "llama-3.3-70b-versatile",
          messages,
          temperature,
          max_tokens,
        }),
      }
    );

    const data = await response.json();
    console.log("Groq Response:", data);

if (!response.ok) {
  return res.status(response.status).json(data);
}

    res.json({
      content: data?.choices?.[0]?.message?.content || "No response",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

const PORT = process.env.PORT || 5000;
// fixed service
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend running on port ${PORT}`);
});