import { GoogleGenerativeAI } from "@google/generative-ai";

export const handleChat = async (req, res) => {
  try {
    console.log("Gemini Key Loaded:", process.env.GEMINI_API_KEY);
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "dummy_key");
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const { message, userData, history } = req.body;

    if (!message) {
      return res.status(400).json({ reply: "Message required" });
    }

    console.log("User message:", message);
    
    let historyContext = "";
    if (history && Array.isArray(history) && history.length > 0) {
      historyContext = "\n\nPast Conversation History:\n" + history.map(h => `${h.role === 'user' ? 'User' : 'AI'}: ${h.text}`).join('\n');
    }

    const prompt = `You are SmartShield AI assistant.
Give short, clear, helpful answers.
If premium is high -> explain reason.
If user has no plan -> suggest plan.
Always give actionable advice.

Context for this user:
- Name: ${userData?.name || 'Worker'}
- Role: ${userData?.role || 'user'}
- Trust Score: ${userData?.trustScore || 'N/A'}
- Active Coverage: ₹${userData?.coverage || 0}
- Weekly Premium: ₹${userData?.premium || 0}
- Wallet Balance: ₹${userData?.wallet?.balance || 0}
- Location: ${userData?.location?.lat || 'Unknown'}, ${userData?.location?.lng || 'Unknown'}${historyContext}

User Question: ${message}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    res.json({ reply: text });
  } catch (error) {
    console.error("FULL GEMINI ERROR:", error);

    let errorMsg = "Hmm, I'm experiencing technical difficulties. Let me regain focus and try again.";
    const errMsgStr = error.toString().toLowerCase();

    if (errMsgStr.includes("api key not valid") || errMsgStr.includes("api key invalid") || errMsgStr.includes("api key")) {
      errorMsg = "AI configuration error: Invalid API Key.";
    } else if (errMsgStr.includes("quota exceeded") || errMsgStr.includes("429")) {
      errorMsg = "AI Service is currently at capacity (Quota Exceeded). Please wait a moment.";
    } else if (errMsgStr.includes("model not found") || (errMsgStr.includes("model") && errMsgStr.includes("not found"))) {
      errorMsg = "AI Engine error: Model not found.";
    } else if (error.message) {
      errorMsg = "AI Error: " + error.message;
    }

    res.status(500).json({
      reply: errorMsg
    });
  }
};
