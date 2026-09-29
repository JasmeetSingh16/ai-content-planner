/* ------------------------------------------------------------------ */
/* Types, sample briefs and the example plan shown in the hero and     */
/* the empty state. The example is a real output for a fictional       */
/* bakery brief.                                                       */
/* ------------------------------------------------------------------ */

export type PlanItem = {
  day: number;
  theme: string;
  platform: string;
};

export type PostItem = {
  day: number;
  theme: string;
  platform: string;
  copy: string;
};

export const tones = ["Professional", "Friendly", "Bold", "Luxury", "Playful", "Educational", "Inspirational"];

export const sampleBriefs: { label: string; description: string; tone: string; days: number }[] = [
  {
    label: "Neighbourhood bakery",
    description:
      "A neighbourhood bakery in Pune selling sourdough and custom cakes, targeting young families. We bake fresh every morning and take cake orders on WhatsApp.",
    tone: "Friendly",
    days: 7,
  },
  {
    label: "Accounting software",
    description:
      "Cloud accounting software for small Indian businesses with GST filing built in. For finance managers and founders who still reconcile invoices in spreadsheets. 14-day free trial.",
    tone: "Professional",
    days: 5,
  },
  {
    label: "Yoga studio",
    description:
      "A yoga studio offering beginner classes, prenatal yoga and weekend workshops. Our audience is working professionals who want to start a calm, consistent routine.",
    tone: "Inspirational",
    days: 10,
  },
];

export const examplePosts: PostItem[] = [
  {
    "day": 1,
    "theme": "Product value",
    "platform": "Instagram",
    "copy": "Craving something that feels like home? 🏠\n\nOur sourdough bread is baked fresh every day, giving families a warm, comforting bite that’s perfect for breakfast, lunch or a cozy snack. 🍞\n\nAnd when it’s time to celebrate, our custom cakes turn any occasion into a sweet memory. 🍰\n\nDrop by our neighbourhood bakery in Pune and taste the love in every loaf and every layer. 👨‍👩‍👧‍👦"
  },
  {
    "day": 2,
    "theme": "Educational",
    "platform": "LinkedIn",
    "copy": "Ever wondered what makes our sourdough so beloved?\n\nSourdough is a bread that relies on natural fermentation, giving it a distinct tang and a chewy crust that families love to share.\n\nPlanning a family celebration? Our custom cakes are crafted to bring smiles and create memorable moments.\n\nDrop by our bakery and discover the flavors that bring young families together."
  },
  {
    "day": 3,
    "theme": "Tips and advice",
    "platform": "Twitter/X",
    "copy": "Kids love baking! Let them stir the sourdough dough—simple, safe, and a fun way to see the dough rise. Try it next family kitchen adventure! 🍞✨ #Sourdough #FamilyFun #BakingTips"
  },
  {
    "day": 4,
    "theme": "Behind-the-scenes",
    "platform": "Instagram",
    "copy": "Ever wonder what magic happens behind our ovens? 👩‍🍳✨\n\nAt our neighbourhood bakery in Pune, the team spends the morning kneading, proofing, and shaping sourdough with love—just the way families in the area adore it. And when it comes to custom cakes, we’re all about that personal touch, turning your ideas into sweet, family‑friendly celebrations.\n\nDrop by today and see the dough rise, the batter swirl, and the smiles grow. We’re ready to make your next family gathering extra special! 🍞🎂"
  },
  {
    "day": 5,
    "theme": "Engagement",
    "platform": "Twitter/X",
    "copy": "Craving a fresh loaf that’s as fun as a family game night? Pune’s neighbourhood bakery has you covered with sourdough baked to perfection, plus custom cakes that bring smiles to every little one. Drop by and let us help you celebrate the everyday moments! 🎂🥖"
  }
];

export const examplePlan: PlanItem[] = examplePosts.map(({ day, theme, platform }) => ({ day, theme, platform }));

/* Short badge + colour class for each platform the API can return. */
export function platformInfo(platform: string) {
  const p = platform.toLowerCase();
  if (p.includes("instagram")) return { short: "IG", tone: "ig" };
  if (p.includes("linkedin")) return { short: "in", tone: "li" };
  if (p.includes("twitter") || p === "x" || p.includes("/x")) return { short: "X", tone: "x" };
  return { short: platform.slice(0, 2), tone: "other" };
}
