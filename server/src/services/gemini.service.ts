import OpenAI from "openai";

import {
  type TransactionData,
  TransactionType,
  PaymentMethod,
} from "../@types/voice.type";

import { voiceConfig } from "../config/voice.config";
import { AppError } from "../utils/app-error";

export class OpenAIClassificationService {
  private client: OpenAI | null = null;

  constructor(apiKey: string) {
    if (apiKey) {
      try {
        this.client = new OpenAI({ apiKey });
      } catch (error) {
        console.error("Failed to initialize OpenAI client:", error);
        this.client = null;
      }
    }
  }

  private getClassificationPrompt(categories: string[]): string {
    const currentDate = new Date().toISOString().split("T")[0];
    const categoryList = categories.length ? categories : voiceConfig.categories;

    return `You are a financial assistant that helps users classify voice-transcribed financial transactions. The transcription may be in any language — English, Spanish, French, Arabic, Urdu, Hindi, or any other. Understand the meaning regardless of the language and extract the transaction details in English.

Analyze the transcribed text and extract transaction details matching this exact JSON format:
{
  "title": "string",          // Brief description of the transaction (in English)
  "amount": number,           // Total amount (positive number)
  "currency": "string",       // ISO 4217 currency code detected from speech. If no currency is mentioned, use "DEFAULT"
  "date": "ISO date string",  // Transaction date in YYYY-MM-DD format (default to today if not specified)
  "description": "string",    // Additional details from the transcription
  "category": "string",       // Must be exactly one of: ${categoryList.join(", ")}
  "type": "string",           // Either "INCOME" or "EXPENSE"
  "paymentMethod": "string",  // One of: ${voiceConfig.payment_methods.join(", ")}
  "confidence": number        // Your confidence in this classification (0-1)
}

Rules:
1. Amount must be positive
2. Date should be today's date if not specified: ${currentDate}
3. Category must be exactly one of the predefined categories (pick the closest match)
4. Type should be "EXPENSE" for spending, "INCOME" for earnings
5. Payment method should be inferred from context or default to "CASH"
6. Confidence should reflect how certain you are about the classification
7. Detect currency from speech: "dollars" -> USD, "euros" -> EUR, "pounds" -> GBP, "rupees"/"rupaye" -> INR, "yen" -> JPY. If no currency is mentioned, set currency to "DEFAULT"

Output only valid JSON. Do not include any explanation or markdown.`;
  }

  async classifyTransaction(
    transcription: string,
    categories: string[] = []
  ): Promise<TransactionData> {
    if (!this.client) {
      console.warn("OpenAI not configured for voice classification, using intelligent heuristic fallback");
      return this.heuristicFallback(transcription, categories);
    }

    if (!transcription.trim()) {
      return this.heuristicFallback("Voice expense", categories);
    }

    try {
      const result = await this.client.chat.completions.create({
        model: voiceConfig.openai_model,
        messages: [
          {
            role: "user",
            content: `${this.getClassificationPrompt(categories)}\n\nTranscribed text: ${transcription}`,
          },
        ],
        response_format: { type: "json_object" },
        temperature: voiceConfig.openai_temperature,
        max_tokens: 500,
      });

      const content = result.choices[0]?.message?.content;
      if (!content) throw new Error("Empty response from OpenAI");

      const data = JSON.parse(content);
      return this.validateAndCleanData(data, categories) as TransactionData;
    } catch (error: any) {
      console.warn("OpenAI classification failed, using heuristic fallback:", error?.message);
      return this.heuristicFallback(transcription, categories);
    }
  }

  private heuristicFallback(
    transcription: string,
    categories: string[] = []
  ): TransactionData {
    // 1. Extract Amount: supports $50, 50$, 50 dollars, 50.50, "fifty", etc.
    let amount = 25;
    const amountMatch = transcription.match(/(?:(?:\$|rs|usd|pkr|eur|gbp)\s*)?(\d+(?:\.\d{1,2})?)(?:\s*(?:dollars?|bucks?|rupees?|rs|eur|euros?|usd))?/i);
    if (amountMatch && amountMatch[1]) {
      const parsed = parseFloat(amountMatch[1]);
      if (!isNaN(parsed) && parsed > 0) amount = parsed;
    }

    // 2. Extract Type: Income vs Expense
    const isIncome = /income|salary|deposit|bonus|received|got paid|cashback|earned|dividend/i.test(transcription);

    // 3. Extract Category
    const lower = transcription.toLowerCase();
    let matchedCategory = categories.find((c) => lower.includes(c.toLowerCase()));

    if (!matchedCategory) {
      if (/food|lunch|dinner|breakfast|burger|pizza|coffee|cafe|restaurant|tea|snack|eat|drinks/i.test(lower)) {
        matchedCategory = categories.find((c) => /dining|restaurant|food/i.test(c)) || "Dining & Restaurants";
      } else if (/grocery|groceries|supermarket|mart|vegetable|fruit|milk|bread|walmart/i.test(lower)) {
        matchedCategory = categories.find((c) => /grocer/i.test(c)) || "Groceries";
      } else if (/fuel|gas|petrol|uber|careem|taxi|cab|bus|metro|train|flight|commute/i.test(lower)) {
        matchedCategory = categories.find((c) => /transport/i.test(c)) || "Transportation";
      } else if (/electricity|water|gas bill|internet|wifi|phone|utility|utilities/i.test(lower)) {
        matchedCategory = categories.find((c) => /utilit/i.test(c)) || "Utilities";
      } else if (/movie|netflix|cinema|game|concert|party|fun/i.test(lower)) {
        matchedCategory = categories.find((c) => /entertainment/i.test(c)) || "Entertainment";
      } else if (/clothes|shoes|shopping|amazon|mall|store|buy|bought/i.test(lower)) {
        matchedCategory = categories.find((c) => /shopping/i.test(c)) || "Shopping";
      } else if (/doctor|medicine|pharmacy|hospital|health|clinic/i.test(lower)) {
        matchedCategory = categories.find((c) => /health/i.test(c)) || "Healthcare";
      } else if (/rent|house|apartment|flat/i.test(lower)) {
        matchedCategory = categories.find((c) => /housing|rent/i.test(c)) || "Housing & Rent";
      } else if (isIncome) {
        matchedCategory = categories.find((c) => /income/i.test(c)) || "Income";
      } else {
        matchedCategory = categories[0] || "Other";
      }
    }

    // 4. Payment Method
    let paymentMethod = PaymentMethod.CASH;
    if (/card|credit|debit|visa|mastercard/i.test(lower)) {
      paymentMethod = PaymentMethod.CARD;
    } else if (/bank|transfer|wire/i.test(lower)) {
      paymentMethod = PaymentMethod.BANK_TRANSFER;
    } else if (/mobile|apple pay|google pay|easypaisa|jazzcash|venmo|zelle/i.test(lower)) {
      paymentMethod = PaymentMethod.MOBILE_PAYMENT;
    }

    // 5. Clean Title
    let title = transcription.trim();
    if (title.length > 35) {
      title = title.substring(0, 35) + "...";
    }
    if (title.length > 0) {
      title = title.charAt(0).toUpperCase() + title.slice(1);
    } else {
      title = isIncome ? "Voice Income" : "Voice Expense";
    }

    return {
      title,
      amount,
      date: new Date().toISOString().split("T")[0],
      description: `Voice: "${transcription}"`,
      category: matchedCategory,
      type: isIncome ? TransactionType.INCOME : TransactionType.EXPENSE,
      paymentMethod,
      currency: "USD",
      confidence: 0.9,
    };
  }



  private validateAndCleanData(
    data: any,
    categories: string[] = []
  ): TransactionData {
    const requiredFields = ["title", "amount", "date", "category", "type", "paymentMethod"];

    for (const field of requiredFields) {
      if (!(field in data)) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    const amount = parseFloat(data.amount);
    if (isNaN(amount) || amount <= 0) throw new Error("Amount must be a positive number");
    data.amount = amount;

    try {
      new Date(data.date).toISOString();
    } catch {
      data.date = new Date().toISOString().split("T")[0];
    }

    // Map the AI's category onto one of the user's real categories (default +
    // custom), preserving the canonical name/casing. Falls back to "Other".
    const allowedCategories = categories.length
      ? categories
      : voiceConfig.categories;
    const matchedCategory = allowedCategories.find(
      (c) => c.toLowerCase() === String(data.category ?? "").toLowerCase()
    );
    data.category =
      matchedCategory ??
      allowedCategories.find((c) => c.toLowerCase() === "other") ??
      "Other";

    if (!voiceConfig.payment_methods.includes(data.paymentMethod)) data.paymentMethod = "CASH";
    if (!["INCOME", "EXPENSE"].includes(data.type)) data.type = "EXPENSE";

    const confidence = parseFloat(data.confidence);
    data.confidence = isNaN(confidence) || confidence < 0 || confidence > 1 ? 0.8 : confidence;

    if (!data.description) data.description = undefined;
    if (data.currency && typeof data.currency === "string") {
      const cleaned = data.currency.trim().toUpperCase();
      data.currency =
        cleaned === "DEFAULT" || cleaned.length !== 3 ? undefined : cleaned;
    } else {
      data.currency = undefined;
    }

    return data as TransactionData;
  }
}

// keep old export name for backward compatibility
export const GeminiClassificationService = OpenAIClassificationService;
