import { part1 } from "./part1.js";
import { part2 } from "./part2.js";
import { part3 } from "./part3.js";
import { startModule } from "./start.js";
export { bankDbSetup } from "./setup.js";
export { quizzes } from "./quizzes.js";

// The course is organised as six tracks, easiest first.
export const parts = [
  {
    title: "Start Here",
    titleBn: "এখান থেকে শুরু",
    goal: "Install the tools and run your first query.",
    goalBn: "টুল ইনস্টল করে প্রথম query চালান।",
  },
  {
    title: "Beginner · Read Data",
    titleBn: "বিগিনার · ডেটা পড়া",
    goal: "SELECT, filter, sort, join, group — the 80% you use every day.",
    goalBn: "SELECT, ফিল্টার, সাজানো, join, group — প্রতিদিনের ৮০% কাজ।",
  },
  {
    title: "Intermediate · Shape & Change Data",
    titleBn: "ইন্টারমিডিয়েট · ডেটা সাজানো ও বদলানো",
    goal: "Subqueries, CTEs, window functions, views, INSERT/UPDATE/DELETE/MERGE.",
    goalBn: "Subquery, CTE, window function, view, INSERT/UPDATE/DELETE/MERGE।",
  },
  {
    title: "Advanced · Safe, Reusable T-SQL",
    titleBn: "অ্যাডভান্সড · নিরাপদ ও পুনঃব্যবহারযোগ্য T-SQL",
    goal: "Transactions, locking, procedures, triggers, set-based thinking, errors, JSON.",
    goalBn:
      "Transaction, locking, procedure, trigger, set-based চিন্তা, এরর, JSON।",
  },
  {
    title: "Optimization · Make It Fast",
    titleBn: "অপটিমাইজেশন · দ্রুত করা",
    goal: "Indexes, statistics, execution plans, parameter sniffing, real case studies.",
    goalBn:
      "Index, statistics, execution plan, parameter sniffing, বাস্তব কেস স্টাডি।",
  },
  {
    title: "Pro · Design & Interviews",
    titleBn: "প্রো · ডিজাইন ও ইন্টারভিউ",
    goal: "Normalization, anti-patterns, and the questions interviewers ask.",
    goalBn: "Normalization, anti-pattern, আর ইন্টারভিউয়ের প্রশ্ন।",
  },
];

export const chapters = [
  startModule,
  ...[...part1, ...part2, ...part3].map((c) => ({
    ...c,
    part: Math.max(1, c.part),
  })), // old parts 0 + 1 = Beginner track
];
