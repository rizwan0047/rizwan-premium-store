export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed."
    });
  }

  try {
    const { messages } = req.body || {};

    if (!Array.isArray(messages)) {
      return res.status(400).json({
        error: "Invalid messages."
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: "GEMINI_API_KEY is not configured."
      });
    }

    const systemInstruction = `
You are RIZWAN AI, the premium shopping concierge
for the RIZWAN technology store.

Your personality:
- intelligent
- calm
- concise
- premium
- helpful
- never pushy

Your job:
- help customers choose products
- explain products
- compare products
- suggest products based on budget and use case
- answer general questions about the store

Important:
Only claim product facts that are actually provided
by the store context.

Current RIZWAN products:

1. Aether X1 Headphones
Category: Audio
Price: $299
Features: Adaptive noise cancelling, spatial audio,
all-day comfort.

2. Titanium Chronos
Category: Wearables
Price: $429
Features: Precision titanium smartwatch,
modern performance.

3. Arc Ultra Laptop
Category: Computing
Price: $1499
Features: Ultra-thin performance, high-resolution display.

4. Nova Studio Camera
Category: Creative
Price: $899
Features: Professional image quality,
compact engineered body.

5. Pulse Mechanical Keyboard
Category: Computing
Price: $179
Features: Mechanical switches, aluminum chassis.

6. Halo Minimal Speaker
Category: Audio
Price: $249
Features: Room-filling sound, minimalist design.

7. Orbit Smart Glasses
Category: Wearables
Price: $349
Features: Connected eyewear for information,
communication and style.

8. Flux Creator Monitor
Category: Creative
Price: $699
Features: Color-accurate 4K display for creators.

Do not invent shipping, warranty, availability,
technical specifications, or company policies.
`;

    const contents = messages.map((message) => ({
      role: message.role === "assistant" ? "model" : "user",
      parts: [
        {
          text: String(message.content || "")
        }
      ]
    }));

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey
        },

        body: JSON.stringify({
          systemInstruction: {
            parts: [
              {
                text: systemInstruction
              }
            ]
          },

          contents
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini error:", data);

      return res.status(response.status).json({
        error: "Gemini request failed.",
        details: data
      });
    }

    const reply =
      data.candidates?.[0]?.content?.parts
        ?.map((part) => part.text || "")
        .join("")
        .trim();

    if (!reply) {
      console.error("Unexpected Gemini response:", data);

      return res.status(500).json({
        error: "Gemini returned an empty response."
      });
    }

    return res.status(200).json({
      reply
    });

  } catch (error) {
    console.error("Chat API error:", error);

    return res.status(500).json({
      error: "Server error."
    });
  }
}