import { part1 } from "./part1.js";
import { part2 } from "./part2.js";
import { part3 } from "./part3.js";
export { bankDbSetup } from "./setup.js";

export const parts = [
  { title: "Foundations", titleBn: "ভিত্তি" },
  { title: "Core SQL", titleBn: "মূল SQL" },
  { title: "Intermediate SQL", titleBn: "মধ্যবর্তী SQL" },
  { title: "Advanced SQL", titleBn: "অ্যাডভান্সড SQL" },
  { title: "Query Optimization", titleBn: "Query Optimization" },
  { title: "Design and Practice", titleBn: "ডিজাইন ও অনুশীলন" },
];

export const chapters = [...part1, ...part2, ...part3];
