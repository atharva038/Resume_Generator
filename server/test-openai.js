import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

console.log("=".repeat(60));
console.log("🔍 OpenAI Configuration & Live Credit Diagnostic");
console.log("=".repeat(60));

const apiKey = process.env.OPENAI_API_KEY;
const adminKey = process.env.OPENAI_ADMIN_KEY;

console.log("✓ OPENAI_API_KEY:", apiKey ? `${apiKey.substring(0, 15)}... (len: ${apiKey.length})` : "MISSING");
console.log("✓ OPENAI_ADMIN_KEY:", adminKey ? `${adminKey.substring(0, 15)}... (len: ${adminKey.length})` : "MISSING");

// Test 1: Check chat completion with API Key
if (apiKey) {
  console.log("\n🧪 1. Testing Chat Completion with OPENAI_API_KEY (gpt-4o-mini & gpt-4o)...");
  try {
    const openai = new OpenAI({ apiKey });
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: "Hi" }],
      max_tokens: 5,
    });
    console.log("✅ Chat Completion Success! Model responded:", completion.choices[0].message.content);
    console.log("   Tokens used:", completion.usage?.total_tokens);
  } catch (error) {
    console.error("❌ Chat Completion Failed:");
    console.error("   Status:", error.status);
    console.error("   Code:", error.code);
    console.error("   Type:", error.type);
    console.error("   Message:", error.message);
  }
}

// Test 2: Check Organization Usage & Costs with Admin Key / API Key
const keyForOrg = adminKey || apiKey;
if (keyForOrg) {
  console.log("\n🧪 2. Checking Live Organization Costs / Quota...");
  try {
    const startTimeUnix = Math.floor(Date.now() / 1000 - 30 * 24 * 60 * 60);
    const costRes = await fetch(`https://api.openai.com/v1/organization/costs?start_time=${startTimeUnix}`, {
      headers: {
        Authorization: `Bearer ${keyForOrg}`,
        "Content-Type": "application/json",
      },
    });

    if (costRes.ok) {
      const costData = await costRes.json();
      let totalCostUsd = 0;
      let orgName = "Unknown";
      if (costData.data) {
        for (const bucket of costData.data) {
          if (bucket.results) {
            for (const r of bucket.results) {
              totalCostUsd += r.amount?.value || 0;
              if (r.organization_name) orgName = r.organization_name;
            }
          }
        }
      }
      console.log(`✅ Organization API Connected! Org: ${orgName}`);
      console.log(`   Total Usage Cost in last 30 days: $${totalCostUsd.toFixed(4)} USD`);
    } else {
      const errBody = await costRes.text();
      console.log(`⚠️ Organization Costs API status: ${costRes.status}`);
      console.log(`   Response: ${errBody}`);
    }
  } catch (err) {
    console.error("❌ Organization API fetch error:", err.message);
  }
}

console.log("\n" + "=".repeat(60));

