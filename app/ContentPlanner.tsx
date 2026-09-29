"use client";

import { ArrowRight, CalendarDays, RotateCcw, Sparkles, TriangleAlert } from "lucide-react";
import { useRef, useState } from "react";
import { EmptyPreview, WorkspaceSection } from "../components/agent/AgentTemplate";
import { CopyButton, LoadingSteps } from "../components/agent/AgentUi";
import {
  examplePlan,
  examplePosts,
  platformInfo,
  sampleBriefs,
  tones,
  type PlanItem,
  type PostItem,
} from "./content-data";

const LOADING_STEPS = ["Reading your brief", "Choosing themes & platforms", "Planning the calendar", "Writing each post"];

export default function ContentPlanner() {
  const [description, setDescription] = useState("");
  const [tone, setTone] = useState("Professional");
  const [days, setDays] = useState(5);

  const [plan, setPlan] = useState<PlanItem[]>([]);
  const [posts, setPosts] = useState<PostItem[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sampleIndex, setSampleIndex] = useState(-1);

  const formRef = useRef<HTMLDivElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const briefRef = useRef<HTMLTextAreaElement>(null);

  function fillSample() {
    const next = (sampleIndex + 1) % sampleBriefs.length;
    const s = sampleBriefs[next];
    setSampleIndex(next);
    setDescription(s.description);
    setTone(s.tone);
    setDays(s.days);
    setError("");
  }

  async function createPlan() {
    if (!description.trim()) {
      setError("Please describe your product or service.");
      briefRef.current?.focus();
      return;
    }

    setLoading(true);
    setError("");
    setPlan([]);
    setPosts([]);
    outputRef.current?.scrollIntoView({ block: "start" });

    try {
      const response = await fetch("/ai-content-planner/api/plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description,
          tone,
          days,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      setPlan(data.plan || []);
      setPosts(data.posts || []);
    } catch (err) {
      console.error(err);

      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      formRef.current?.scrollIntoView({ block: "start" });
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setPlan([]);
    setPosts([]);
    setError("");
    formRef.current?.scrollIntoView({ block: "start" });
  }

  const hasResult = !loading && (plan.length > 0 || posts.length > 0);

  return (
    <WorkspaceSection
      title="Plan your content"
      text="Describe what you sell and who it's for. The planner picks a theme and platform for each day, then writes every post."
      actions={
        <button type="button" className="jk-btn jk-btn--soft" onClick={fillSample} disabled={loading}>
          <Sparkles size={16} aria-hidden="true" />
          {sampleIndex < 0 ? "Try sample data" : "Try another sample"}
        </button>
      }
    >
      <div ref={formRef} className="jk-card cp-form">
        <div className="cp-brief">
          <div className="jk-field">
            <label htmlFor="brief" className="jk-label">
              Your product or service
              {sampleIndex >= 0 && <span className="cp-sample-tag">Sample: {sampleBriefs[sampleIndex].label}</span>}
            </label>
            <textarea
              id="brief"
              ref={briefRef}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={7}
              aria-invalid={error && !description.trim() ? true : undefined}
              aria-describedby="brief-hint"
              placeholder="e.g. We sell an AI-powered project management platform for small agencies. Our customers are founders who juggle client work in spreadsheets…"
              className="jk-textarea"
            />
            <p id="brief-hint" className="jk-hint">
              Include who it&apos;s for and anything that makes it different. The planner only uses facts you give it.
            </p>
          </div>
        </div>

        <div className="cp-settings">
          <fieldset className="jk-field">
            <legend className="jk-label mb-2">Brand tone</legend>
            <div className="cp-tones">
              {tones.map((t) => (
                <label key={t} className={`cp-tone${tone === t ? " is-on" : ""}`}>
                  <input
                    type="radio"
                    name="tone"
                    value={t}
                    checked={tone === t}
                    onChange={() => setTone(t)}
                    className="jk-sr"
                  />
                  {t}
                </label>
              ))}
            </div>
          </fieldset>

          <div className="jk-field">
            <div className="flex items-center justify-between">
              <label htmlFor="days" className="jk-label">
                Days to plan
              </label>
              <span className="cp-days">{days} days</span>
            </div>
            <input
              id="days"
              type="range"
              min="3"
              max="14"
              value={days}
              onChange={(event) => setDays(Number(event.target.value))}
              className="cp-range"
            />
            <div className="flex justify-between text-xs text-[var(--jk-muted)]">
              <span>3</span>
              <span>14</span>
            </div>
          </div>

          {error && (
            <div className="jk-error" role="alert">
              <TriangleAlert size={18} aria-hidden="true" className="mt-px shrink-0" />
              {error}
            </div>
          )}

          <button
            type="button"
            onClick={createPlan}
            disabled={loading}
            className="jk-btn jk-btn--primary jk-btn--lg jk-btn--block"
          >
            {loading ? "Planning…" : "Create content plan"}
            {!loading && <ArrowRight size={18} aria-hidden="true" />}
          </button>
          <p className="jk-fineprint text-center">AI-generated content should be reviewed before publishing.</p>
        </div>
      </div>

      <p className="jk-sr" role="status">
        {hasResult ? "Content plan ready." : ""}
      </p>

      <div ref={outputRef} className="cp-output">
        {loading ? (
          <div className="jk-card">
            <LoadingSteps steps={LOADING_STEPS} interval={Math.max(2500, days * 1400)} />
          </div>
        ) : hasResult ? (
          <ContentCalendar plan={plan} posts={posts} onReset={reset} />
        ) : (
          <EmptyPreview
            title="Your calendar appears here"
            text="A theme and platform for each day, with every post written and ready to copy. Here's an example."
          >
            <ContentCalendar plan={examplePlan} posts={examplePosts} />
          </EmptyPreview>
        )}
      </div>
    </WorkspaceSection>
  );
}

/* ------------------------------------------------------------------ */
/* CALENDAR + POST PANEL                                               */
/* ------------------------------------------------------------------ */

function ContentCalendar({
  plan,
  posts,
  onReset,
}: {
  plan: PlanItem[];
  posts: PostItem[];
  onReset?: () => void;
}) {
  const days = plan.length ? plan : posts.map(({ day, theme, platform }) => ({ day, theme, platform }));
  const [selected, setSelected] = useState(days[0]?.day ?? 1);
  const post = posts.find((p) => p.day === selected);
  const planItem = days.find((d) => d.day === selected);

  const mix = days.reduce<Record<string, number>>((acc, d) => {
    acc[d.platform] = (acc[d.platform] || 0) + 1;
    return acc;
  }, {});

  const allText = posts.map((p) => `Day ${p.day} — ${p.platform} — ${p.theme}\n\n${p.copy}`).join("\n\n---\n\n");

  return (
    <article aria-label="Content calendar">
      <header className="cp-report-head">
        <div>
          <p className="jk-eyebrow">Content calendar</p>
          <h3 className="cp-report-title">
            {days.length} days · {posts.length} posts written
          </h3>
        </div>
        {onReset && (
          <div className="flex flex-wrap gap-2">
            {posts.length > 0 && <CopyButton text={allText} label="Copy all posts" />}
            <button type="button" className="jk-copy" onClick={onReset}>
              <RotateCcw size={15} aria-hidden="true" />
              Plan something else
            </button>
          </div>
        )}
      </header>

      {/* Platform mix */}
      <div className="cp-mix" aria-label="Platform mix">
        <div className="cp-mix-bar">
          {Object.entries(mix).map(([platform, count]) => (
            <span
              key={platform}
              className={`cp-mix-seg cp-plat--${platformInfo(platform).tone}`}
              style={{ flexGrow: count }}
            />
          ))}
        </div>
        <ul className="cp-mix-legend">
          {Object.entries(mix).map(([platform, count]) => (
            <li key={platform}>
              <span className={`cp-plat-badge cp-plat--${platformInfo(platform).tone}`}>
                {platformInfo(platform).short}
              </span>
              {platform} <strong>{count}</strong>
            </li>
          ))}
        </ul>
      </div>

      <div className="cp-layout">
        <ol className="cp-grid" aria-label="Days">
          {days.map((d) => {
            const info = platformInfo(d.platform);
            const on = d.day === selected;
            return (
              <li key={d.day}>
                <button
                  type="button"
                  className={`cp-day${on ? " is-on" : ""}`}
                  aria-pressed={on}
                  onClick={() => setSelected(d.day)}
                >
                  <span className="cp-day-top">
                    <span className="cp-day-num">Day {String(d.day).padStart(2, "0")}</span>
                    <span className={`cp-plat-badge cp-plat--${info.tone}`} title={d.platform}>
                      {info.short}
                    </span>
                  </span>
                  <span className="cp-day-theme">{d.theme}</span>
                </button>
              </li>
            );
          })}
        </ol>

        <section className="jk-card cp-post" aria-live="polite" aria-label={`Day ${selected} post`}>
          <div className="flex items-center justify-between gap-3">
            <p className="flex items-center gap-2 text-sm font-semibold text-[var(--jk-ink)]">
              <CalendarDays size={16} aria-hidden="true" className="text-[var(--agent-accent)]" />
              Day {selected}
              {planItem && <span className="text-[var(--jk-muted)]">· {planItem.platform}</span>}
            </p>
            {post && <CopyButton text={post.copy} label="Copy post" />}
          </div>
          <h4 className="mt-3 text-xl font-bold tracking-tight text-[var(--jk-ink)]">{planItem?.theme}</h4>
          {post ? (
            <p className="cp-copy">{post.copy}</p>
          ) : (
            <p className="mt-4 text-sm text-[var(--jk-muted)]">No post was written for this day.</p>
          )}
        </section>
      </div>

      <p className="jk-fineprint mx-auto mt-6 max-w-2xl text-center">
        This content is AI-generated from the information provided. Review and adapt it to your brand before
        publishing.
      </p>
    </article>
  );
}
