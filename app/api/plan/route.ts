import Groq from "groq-sdk";
import { NextResponse } from "next/server";
import { gateReport } from "../../../lib/report-gate";
import { inputOf, previewOf, summaryOf } from "../../report-gate";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

type PlanItem = {
  day: number;
  theme: string;
  platform: string;
};

type PostItem = {
  day: number;
  theme: string;
  platform: string;
  copy: string;
};

function cleanText(text: string) {
  return text
    .replaceAll("&#x20;", " ")
    .replaceAll("&#32;", " ")
    .replaceAll("&nbsp;", " ")
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replace(/\r/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function cleanAIResponse(text: string) {
  const fence = String.fromCharCode(96).repeat(3);

  return text
    .replace(fence + "json", "")
    .replace(fence, "")
    .trim();
}

async function askGroq(prompt: string) {
  const completion = await groq.chat.completions.create({
    model: "openai/gpt-oss-20b",
    temperature: 0.7,
    messages: [
      {
        role: "system",
        content:
          "You are an expert social media content strategist and copywriter. Use only information provided by the business and never invent business facts.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  const content = completion.choices[0]?.message?.content;

  if (!content) {
    throw new Error("Groq returned an empty response.");
  }

  return cleanAIResponse(content);
}

export async function POST(request: Request) {
  try {
    const { description, tone, days } = await request.json();

    if (!description || !tone || !days) {
      return NextResponse.json(
        {
          error: "Description, tone, and days are required.",
        },
        {
          status: 400,
        }
      );
    }

    const requestedDays = Number(days);

    if (
      !Number.isInteger(requestedDays) ||
      requestedDays < 1 ||
      requestedDays > 30
    ) {
      return NextResponse.json(
        {
          error: "Days must be a whole number between 1 and 30.",
        },
        {
          status: 400,
        }
      );
    }

    // ==========================================
    // STEP 1 — PLAN CONTENT STRATEGY
    // ==========================================

    const planningPrompt = `
You are an expert social media strategist.

Create a practical, engaging, and varied ${requestedDays}-day
social media content calendar for the business below.

BUSINESS / PRODUCT:
${description}

BRAND TONE:
${tone}

AVAILABLE PLATFORMS:
- Instagram
- LinkedIn
- Twitter/X

STRICT FACTUAL RULE:

You may ONLY use information explicitly provided in BUSINESS / PRODUCT.

Never assume or invent:

- Business name
- Location
- Address
- Pricing
- Discounts
- Promotions
- Offers
- Loyalty programs
- Memberships
- Opening hours
- Delivery
- Pickup
- Ingredients
- Sourcing practices
- Sustainability practices
- Certifications
- Awards
- Partnerships
- Customer stories
- Testimonials
- Reviews
- Statistics
- Business results
- Product specifications
- Events
- Special services

Do not create a content theme that depends on information
that was not provided.

CONTENT STRATEGY RULES:

1. Create exactly ${requestedDays} content items.
2. Day numbers must start at 1 and continue sequentially.
3. Every day must have a different content angle.
4. Choose the platform that best fits the topic.
5. Match every topic to the brand tone.
6. Use a natural variety of content types when supported
   by the business description:
   - Educational
   - Problem / pain point
   - Product or service value
   - Tips and advice
   - Brand experience
   - Behind-the-scenes
   - Engagement
   - Call to action
7. Keep every idea directly relevant to the actual business.
8. Do not create content about this application's development.
9. Do not create content about AI, APIs, prompts, developers,
   or content generation unless the business itself is an AI product.

Return ONLY valid JSON.

Required format:

[
  {
    "day": 1,
    "theme": "Product value",
    "platform": "Instagram"
  },
  {
    "day": 2,
    "theme": "Customer problem",
    "platform": "LinkedIn"
  }
]

IMPORTANT:

- Return exactly ${requestedDays} objects.
- Use only Instagram, LinkedIn, or Twitter/X.
- Every theme must be different.
- Do not include markdown.
- Do not include explanations.
- Do not include comments.
`;

    const planResponse = await askGroq(planningPrompt);

    let plan: PlanItem[];

    try {
      plan = JSON.parse(planResponse);
    } catch {
      throw new Error("Groq returned invalid planning JSON.");
    }

    if (!Array.isArray(plan) || plan.length !== requestedDays) {
      throw new Error("Groq returned an invalid number of content items.");
    }

    // ==========================================
    // STEP 2 — GENERATE READY-TO-PUBLISH POSTS
    // ==========================================

    const posts: PostItem[] = [];

    for (const item of plan) {
      const generationPrompt = `
You are an expert social media copywriter.

Write ONE READY-TO-PUBLISH social media post for the business below.

BUSINESS / PRODUCT:
${description}

BRAND TONE:
${tone}

DAY:
${item.day}

CONTENT THEME:
${item.theme}

PLATFORM:
${item.platform}

========================================
STRICT FACTUAL ACCURACY
========================================

You may ONLY state factual details explicitly provided in BUSINESS / PRODUCT.

Do not introduce any new factual detail, even if it is common,
likely, realistic, or generally true for this type of business.

You may use creative marketing language only when it does not introduce
a new factual claim.

For example, do NOT invent:
- how the product is made
- ingredients or preparation methods
- technical processes
- customer use cases
- customer behaviors
- locations
- business operations
- product specifications
- benefits that were not stated
- results or outcomes

When a detail is unknown, leave it out rather than guessing.

NEVER invent or assume:

- Business name
- Location
- Address
- Pricing
- Discounts
- Promotions
- Offers
- Loyalty programs
- Memberships
- Opening hours
- Delivery
- Pickup
- Ingredients
- Sourcing practices
- Farming practices
- Sustainability claims
- Certifications
- Awards
- Partnerships
- Customer names
- Testimonials
- Reviews
- Statistics
- Results
- Product specifications
- Special events
- Special offers

If information is not provided, DO NOT mention it.

Do not use placeholders such as:

[Business Name]
[Coffee Shop Name]
[Address]
[Link]
[Phone Number]

Use general wording instead.

========================================
WRITING RULES
========================================

1. Write ONLY the final social media post.
2. Make it sound like a real brand wrote it.
3. Make it useful, engaging, natural, and relevant.
4. Start with a strong hook.
5. Stay aligned with the content theme.
6. Include a CTA only when appropriate.
7. Do not ask the business owner questions.
8. Do not ask for approval or feedback.
9. Do not mention the AI agent.
10. Do not mention prompts.
11. Do not mention APIs.
12. Do not mention developers.
13. Do not mention the generation process.
14. Do not mention Groq or OpenAI unless the business itself
    is an AI product and this is directly relevant.
15. Do not explain your writing choices.
16. Do not invent facts.
17. Do not invent claims.
18. Do not add internal notes.
19. Do not add "Day 1", "Post 1", "Caption", or similar labels.

========================================
PLATFORM STYLE
========================================

INSTAGRAM:

- Strong opening hook
- Conversational
- Short paragraphs
- Easy to scan
- Emojis only when they fit the tone
- Natural CTA when appropriate

LINKEDIN:

- Professional but human
- Strong opening
- Useful insight or practical idea
- Short readable paragraphs
- Avoid excessive emojis
- Avoid generic AI wording

TWITTER/X:

- Short and punchy
- One clear idea
- Strong opening
- Minimal filler
- Easy to scan

========================================
FINAL CHECK
========================================

Before returning the post, verify:

- Every factual statement comes from BUSINESS / PRODUCT.
- No business details were invented.
- No placeholder was used.
- The post matches the selected platform.
- The post matches the brand tone.
- The post follows the content theme.
- The post is ready to publish.
- There are no internal instructions or notes.

Return ONLY the finished social media post.
`;

      const rawCopy = await askGroq(generationPrompt);
      const copy = cleanText(rawCopy);

      posts.push({
        day: item.day,
        theme: item.theme,
        platform: item.platform,
        copy,
      });
    }

    // ==========================================
    // RETURN RESULTS
    // ==========================================

    // Preview + sealed full plan (see lib/report-gate.ts).
    const report = { plan, posts };

    return NextResponse.json(
      gateReport({
        agent: "content-planner",
        input: inputOf({ description: String(description), tone: String(tone), days: requestedDays }),
        summary: summaryOf(report),
        full: report,
        preview: previewOf(report),
      })
    );
  } catch (error) {
    console.error("AGENT ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to generate content.",
      },
      {
        status: 500,
      }
    );
  }
}
