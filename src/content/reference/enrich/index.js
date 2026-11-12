// Adds beginner-friendly sections and extra runnable examples to every module.
// Each module file exports { [topic]: entry } where entry =
// { s: [storyEn, storyBn], t: [theoryEn, theoryBn], p: [[en, bn] x4],
//   m: [mistakesEn, mistakesBn], q?: [interviewEn, interviewBn],
//   f?: [futureTipEn, futureTipBn], x: [examples] }
const loaders = {
  0: () => import("./m00"),
  1: () => import("./m01"),
  2: () => import("./m02"),
  3: () => import("./m03"),
  4: () => import("./m04"),
  6: () => import("./m06"),
  8: () => import("./m08"),
  9: () => import("./m09"),
  10: () => import("./m10"),
  11: () => import("./m11"),
  12: () => import("./m12"),
  13: () => import("./m13"),
  14: () => import("./m14"),
  15: () => import("./m15"),
  16: () => import("./m16"),
};

const titles = {
  story: "Simple story first · আগে একটি সহজ গল্প",
  theory: "Theory in plain words · সহজ ভাষায় তত্ত্ব",
  steps: "Do it step by step · ধাপে ধাপে করুন",
  mistakes: "Common mistakes and fixes · সাধারণ ভুল ও সমাধান",
  future: "2028-ready engineer tip · ২০২৮-এর জন্য প্রস্তুত টিপস",
  interview: "Interview practice · ইন্টারভিউ অনুশীলন",
};

export async function enrichModule(lesson, chapter) {
  const load = loaders[lesson.module.id];
  if (!load) return chapter;
  let data;
  try {
    data = (await load()).default;
  } catch {
    return chapter;
  }
  const x = data[lesson.topic];
  if (!x) return chapter;
  const sections = [
    { id: "easy-story", toc: "Easy story", title: titles.story, en: x.s[0], bn: x.s[1] },
    { id: "simple-theory", toc: "Plain theory", title: titles.theory, en: x.t[0], bn: x.t[1] },
    {
      id: "do-steps",
      toc: "Steps",
      title: titles.steps,
      en: "Follow these steps in order. After each step, stop and check the result before moving on; that habit is what turns reading into real skill.",
      bn: "এই ধাপগুলো ক্রমানুসারে করুন। প্রতিটি ধাপের পর থেমে ফল মিলিয়ে নিন, তারপর এগোন; এই অভ্যাসই পড়াকে আসল দক্ষতায় বদলায়।",
      steps: x.p.map(([en, bn]) => ({ en, bn })),
    },
    { id: "common-mistakes", toc: "Mistakes", title: titles.mistakes, en: x.m[0], bn: x.m[1] },
  ];
  if (x.q) sections.push({ id: "interview-practice", toc: "Interview", title: titles.interview, en: x.q[0], bn: x.q[1] });
  if (x.f) sections.push({ id: "future-ready", toc: "2028 tip", title: titles.future, en: x.f[0], bn: x.f[1] });
  return {
    ...chapter,
    extraSections: [...(chapter.extraSections || []), ...sections],
    examples: [...(x.x || []), ...chapter.examples],
  };
}
