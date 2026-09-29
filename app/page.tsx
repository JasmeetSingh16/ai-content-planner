import {
  CalendarDays,
  Megaphone,
  MessagesSquare,
  NotebookPen,
  PenLine,
  Rocket,
  ShieldCheck,
  Store,
  Users,
} from "lucide-react";
import { AgentHero, AgentPage, HowItWorks, RelatedAgents, UseCases } from "../components/agent/AgentTemplate";
import ContentPlanner from "./ContentPlanner";
import { platformInfo } from "./content-data";

const SLUG = "content-planner";

const heroWeek = [
  { day: "Mon", platform: "Instagram", theme: "Fresh-bake reel" },
  { day: "Tue", platform: "LinkedIn", theme: "Why sourdough" },
  { day: "Wed", platform: "Twitter/X", theme: "Weekend order tip" },
  { day: "Thu", platform: "Instagram", theme: "Behind the counter" },
  { day: "Fri", platform: "LinkedIn", theme: "Custom cake story" },
  { day: "Sat", platform: "Instagram", theme: "Family favourites" },
  { day: "Sun", platform: "Twitter/X", theme: "Ask us anything" },
];

function HeroPreview() {
  return (
    <div className="cp-hero-card" aria-hidden="true">
      <div className="jk-card overflow-hidden">
        <div className="flex items-center justify-between border-b border-[var(--jk-line)] px-5 py-4">
          <p className="text-sm font-semibold text-[var(--jk-ink)]">This week</p>
          <p className="text-[13px] text-[var(--jk-muted)]">7 posts · 3 platforms</p>
        </div>
        <ol className="cp-hero-week">
          {heroWeek.map((d, i) => {
            const info = platformInfo(d.platform);
            return (
              <li key={d.day} className={`cp-hero-day${i === 1 ? " is-on" : ""}`}>
                <span className="cp-hero-dow">{d.day}</span>
                <span className={`cp-plat-badge cp-plat--${info.tone}`}>{info.short}</span>
                <span className="cp-hero-theme">{d.theme}</span>
              </li>
            );
          })}
        </ol>
        <div className="border-t border-[var(--jk-line)] bg-[var(--jk-surface-2)] px-5 py-4">
          <p className="jk-label-sm">Tue · LinkedIn</p>
          <p className="mt-1 text-[14.5px] leading-6 text-[var(--jk-ink)]">
            Most &ldquo;sourdough&rdquo; in supermarkets isn&apos;t. Here&apos;s what 24 hours of slow fermentation
            actually changes…
          </p>
        </div>
      </div>
      <p className="cp-float">
        <PenLine size={15} aria-hidden="true" />
        Every post written
      </p>
    </div>
  );
}

export default function Home() {
  return (
    <AgentPage slug={SLUG}>
      <AgentHero
        slug={SLUG}
        headline={
          <>
            One brief in. <em>A week of posts</em> out.
          </>
        }
        lede="Describe what you sell and who it's for. The planner chooses a theme and platform for every day, then writes each post in your brand's tone — ready to review and schedule."
        chips={[
          { icon: CalendarDays, label: "Plans 3–14 days" },
          { icon: MessagesSquare, label: "Instagram, LinkedIn & X" },
          { icon: ShieldCheck, label: "Only uses facts you give it" },
        ]}
        preview={<HeroPreview />}
      />

      <ContentPlanner />

      <HowItWorks
        title={
          <>
            Strategy first, <em>then the words.</em>
          </>
        }
        text="The planner decides what each day is for before writing anything, so the week has a shape — not seven versions of the same post."
        steps={[
          {
            icon: NotebookPen,
            title: "Brief it once",
            text: "Tell it what you sell, who buys it and the tone you want. No invented prices, names or claims — it only uses what you write.",
          },
          {
            icon: CalendarDays,
            title: "It plans the calendar",
            text: "Each day gets a purpose — product value, education, behind-the-scenes, engagement — and the platform that suits it best.",
          },
          {
            icon: PenLine,
            title: "It writes every post",
            text: "Copy is written for each platform's format and length. Copy one post or the whole week and drop it into your scheduler.",
          },
        ]}
      />

      <UseCases
        title="Who plans with it"
        items={[
          {
            icon: Store,
            title: "Small businesses without a marketer",
            text: "Get a consistent week of posts in the time it takes to write one — then spend your energy on the business, not the blank page.",
            who: "For founders and shop owners",
          },
          {
            icon: Rocket,
            title: "Launch weeks",
            text: "Plan the run-up to a new product or offer so every day builds on the last.",
            who: "For product and growth teams",
          },
          {
            icon: Users,
            title: "Agencies onboarding a client",
            text: "Show a first content calendar on day one, then refine it with the client.",
            who: "For social media agencies",
          },
          {
            icon: Megaphone,
            title: "Always-on content",
            text: "We can connect the planner to your brand guide and scheduler so a new week is drafted every Friday for approval.",
            who: "Built by Jaseir for your stack",
          },
        ]}
      />

      <RelatedAgents slug={SLUG} zone={{ kind: "agent", slug: SLUG }} />
    </AgentPage>
  );
}
