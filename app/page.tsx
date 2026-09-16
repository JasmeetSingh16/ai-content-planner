"use client";

import { useState } from "react";

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

export default function Home() {
  const [description, setDescription] = useState("");
  const [tone, setTone] = useState("Professional");
  const [days, setDays] = useState(5);

  const [plan, setPlan] = useState<PlanItem[]>([]);
  const [posts, setPosts] = useState<PostItem[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function createPlan() {
    if (!description.trim()) {
      setError("Please describe your product or service.");
      return;
    }

    setLoading(true);
    setError("");
    setPlan([]);
    setPosts([]);

    try {
      const response = await fetch(
        "/ai-content-planner/api/plan",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            description,
            tone,
            days,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Something went wrong."
        );
      }

      setPlan(data.plan || []);
      setPosts(data.posts || []);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f8fc] text-slate-900">
      <Background />
      <Header />

      {/* HERO */}
      <section className="mx-auto max-w-6xl px-6 pb-8 pt-16 text-center">
        <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700">
          <span>✦</span>
          Turn ideas into content
        </div>

        <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-[-0.04em] text-slate-950 sm:text-5xl">
          Turn one idea into a{" "}
          <span className="text-indigo-600">
            complete content strategy.
          </span>
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-500 sm:text-lg">
          Describe your product or service and let AI
          create a structured content calendar and
          platform-specific social posts.
        </p>
      </section>

      {/* FORM */}
      <section className="mx-auto max-w-4xl px-6 pb-20">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_20px_70px_-25px_rgba(15,23,42,0.18)]">

          {/* STEP 01 */}
          <div className="border-b border-slate-200 p-7 sm:p-9">
            <SectionHeader
              step="01"
              title="Describe your product or service"
              description="Tell the AI what you want to create content for. Include the product, service, audience or anything else that may help."
            />

            <textarea
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              rows={6}
              placeholder="Example: We sell an AI-powered project management platform for small businesses..."
              className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-6 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
            />
          </div>

          {/* STEP 02 */}
          <div className="border-b border-slate-200 p-7 sm:p-9">
            <SectionHeader
              step="02"
              title="Define your content preferences"
              description="Choose the tone and length of your content plan."
            />

            <div className="grid gap-6 sm:grid-cols-2">

              {/* TONE */}
              <div>
                <label
                  htmlFor="tone"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Brand tone
                </label>

                <select
                  id="tone"
                  value={tone}
                  onChange={(event) =>
                    setTone(event.target.value)
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                >
                  <option>Professional</option>
                  <option>Friendly</option>
                  <option>Bold</option>
                  <option>Luxury</option>
                  <option>Playful</option>
                  <option>Educational</option>
                  <option>Inspirational</option>
                </select>
              </div>

              {/* DAYS */}
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <label
                    htmlFor="days"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Content days
                  </label>

                  <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700">
                    {days} days
                  </span>
                </div>

                <input
                  id="days"
                  type="range"
                  min="3"
                  max="14"
                  value={days}
                  onChange={(event) =>
                    setDays(Number(event.target.value))
                  }
                  className="w-full cursor-pointer accent-indigo-600"
                />

                <div className="mt-2 flex justify-between text-xs text-slate-400">
                  <span>3 days</span>
                  <span>14 days</span>
                </div>
              </div>
            </div>
          </div>

          {/* STEP 03 */}
          <div className="p-7 sm:p-9">
            <SectionHeader
              step="03"
              title="Generate your content plan"
              description="The AI will create your content strategy first, then turn each idea into a platform-specific post."
            />

            {error && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </div>
            )}

            <button
              type="button"
              onClick={createPlan}
              disabled={loading}
              className="flex w-full items-center justify-center gap-3 rounded-xl bg-slate-950 px-5 py-4 text-sm font-bold text-white shadow-lg shadow-slate-950/10 transition hover:-translate-y-0.5 hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Creating content plan...
                </>
              ) : (
                <>
                  <span>✦</span>
                  Create Content Plan with AI
                  <span>→</span>
                </>
              )}
            </button>

            <p className="mt-4 text-center text-xs text-slate-400">
              AI-generated content should be reviewed before
              publishing.
            </p>
          </div>
        </div>
      </section>

      {/* LOADING */}
      {loading && (
        <section className="mx-auto max-w-6xl px-6 pb-20">
          <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-8">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-white">
                <span className="h-3 w-3 animate-pulse rounded-full bg-indigo-400" />
              </div>

              <div>
                <p className="font-bold text-slate-900">
                  AI Agent is working...
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Building your content strategy and writing
                  your social posts.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CONTENT RESULTS */}
      {!loading &&
        (plan.length > 0 || posts.length > 0) && (
          <section className="mx-auto max-w-6xl px-6 pb-20">

            {/* STRATEGY */}
            {plan.length > 0 && (
              <section>
                <div className="mb-8">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-indigo-600">
                    AI Strategy
                  </p>

                  <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
                    Your Content Calendar
                  </h2>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                    The AI created this strategy before
                    generating the individual social posts.
                  </p>
                </div>

                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {plan.map((item) => (
                    <article
                      key={item.day}
                      className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-md"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-xs font-bold tracking-[0.14em] text-indigo-600">
                          DAY{" "}
                          {String(item.day).padStart(2, "0")}
                        </span>

                        <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                          {item.platform}
                        </span>
                      </div>

                      <h3 className="mt-6 text-xl font-bold tracking-tight text-slate-900">
                        {item.theme}
                      </h3>

                      <div className="mt-6 flex items-center gap-2 text-sm font-medium text-emerald-600">
                        <span>✓</span>
                        Strategy planned
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {/* GENERATED POSTS */}
            {posts.length > 0 && (
              <section className="mt-16">
                <div className="mb-8">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-indigo-600">
                    AI Generated Content
                  </p>

                  <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
                    Your Social Posts
                  </h2>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                    The AI transformed each strategy into
                    platform-specific content.
                  </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  {posts.map((post) => (
                    <article
                      key={post.day}
                      className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition hover:border-indigo-200 hover:shadow-md"
                    >
                      {/* POST HEADER */}
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-xs font-bold tracking-[0.14em] text-indigo-600">
                          DAY{" "}
                          {String(post.day).padStart(2, "0")}
                        </span>

                        <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                          {post.platform}
                        </span>
                      </div>

                      {/* THEME */}
                      <h3 className="mt-5 text-xl font-bold tracking-tight text-slate-900">
                        {post.theme}
                      </h3>

                      {/* COPY */}
                      <div className="mt-5 rounded-2xl bg-slate-50 p-6">
                        <p className="whitespace-pre-wrap text-sm leading-7 text-slate-700">
                          {post.copy}
                        </p>
                      </div>

                      {/* STATUS */}
                      <div className="mt-5 flex items-center gap-2 text-sm font-medium text-emerald-600">
                        <span>✓</span>
                        Post generated
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {/* FOOTER NOTE */}
            <p className="mx-auto mt-10 max-w-2xl text-center text-xs leading-5 text-slate-400">
              This content is AI-generated based on the
              information provided. Review and adapt the
              content to your brand before publishing.
            </p>
          </section>
        )}
    </main>
  );
}

/* -------------------------------- */
/* SECTION HEADER */
/* -------------------------------- */

function SectionHeader({
  step,
  title,
  description,
}: {
  step: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-7">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-indigo-600">
        Step {step}
      </p>

      <h2 className="mt-2 text-xl font-bold tracking-tight text-slate-900">
        {title}
      </h2>

      <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
        {description}
      </p>
    </div>
  );
}

/* -------------------------------- */
/* HEADER */
/* -------------------------------- */

function Header() {
  return (
    <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-sm font-bold text-white">
            AI
          </div>

          <div>
            <p className="text-sm font-bold tracking-tight text-slate-900">
              Content Planner
            </p>

            <p className="text-[11px] text-slate-500">
              AI Content Planning
            </p>
          </div>
        </div>

        <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 sm:flex">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          AI content engine
        </div>
      </div>
    </header>
  );
}

/* -------------------------------- */
/* BACKGROUND */
/* -------------------------------- */

function Background() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute left-1/2 top-0 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-indigo-100/50 blur-3xl" />

      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(#0f172a 1px, transparent 1px), linear-gradient(90deg, #0f172a 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
    </div>
  );
}