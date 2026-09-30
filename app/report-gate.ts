/* ------------------------------------------------------------------ */
/* What the free preview shows before the "Get your full report" form. */
/* Used by the API route (to build the preview it sends) and the page  */
/* (when the report isn't sealed and is only blurred).                 */
/* ------------------------------------------------------------------ */

import type { PlanItem, PostItem } from "./content-data";

export type ContentReport = { plan: PlanItem[]; posts: PostItem[] };

/** Posts written out in full in the preview. */
export const PREVIEW_POSTS = 2;

/** The whole calendar (themes + platforms), with the first two posts written out. */
export function previewOf(report: ContentReport): ContentReport {
  return { plan: report.plan, posts: report.posts.slice(0, PREVIEW_POSTS) };
}

export function inputOf({ description, tone, days }: { description: string; tone: string; days: number }): string {
  return `${days} days, ${tone} tone: ${description}`;
}

export function summaryOf({ plan, posts }: ContentReport): string {
  const days = plan.length ? plan : posts;
  const mix = days.reduce<Record<string, number>>((acc, d) => {
    acc[d.platform] = (acc[d.platform] || 0) + 1;
    return acc;
  }, {});
  const platforms = Object.entries(mix)
    .map(([platform, count]) => `${platform} ${count}`)
    .join(", ");
  return `${days.length}-day content plan (${platforms}); ${posts.length} posts written`;
}
