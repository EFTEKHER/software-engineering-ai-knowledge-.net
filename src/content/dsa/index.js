import p1 from "./patterns1.js";
import p2 from "./patterns2.js";
import p3 from "./patterns3.js";

export const dsaPatterns = [...p1, ...p2, ...p3];
export const dsaLevels = [
  {
    name: "Noob",
    bn: "নতুন",
    range: "01–10",
    note: ["Core building blocks", "মূল ভিত্তি"],
  },
  {
    name: "Intermediate",
    bn: "মাঝারি",
    range: "11–20",
    note: ["Structures & recursion", "কাঠামো ও রিকার্শন"],
  },
  {
    name: "Professional",
    bn: "পেশাদার",
    range: "21–30",
    note: ["Advanced interview toolkit", "উন্নত ইন্টারভিউ টুলকিট"],
  },
];
