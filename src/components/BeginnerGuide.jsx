import React from "react";
import "./learning.css";
import CodeLab from "./CodeLab";
const lessons = [
  [
    "1. Your first program · প্রথম program",
    "A program is a sequence of instructions. Console.WriteLine sends a value to the terminal and finishes the line. A semicolon ends this statement.",
    "Program হলো কাজের নির্দেশের ধারা। Console.WriteLine terminal-এ লেখা দেখায়। শেষে ; চিহ্ন statement শেষ করে।",
    [
      [
        'Console.WriteLine("Hello, engineer!");',
        "Call a method with a string argument inside parentheses.",
        "বন্ধনীর ভেতর string দিয়ে method ডাকুন।",
      ],
    ],
  ],
  [
    "2. Variables and types · নাম দিয়ে মান রাখা",
    "A variable gives a value a name. A type describes the allowed values and operations. int stores a whole number, decimal suits exact decimal arithmetic, string stores text, and bool stores true/false.",
    "Variable মানের একটি নাম। Type বলে কী মান রাখা ও কী কাজ করা যাবে। int পূর্ণসংখ্যা, decimal দশমিক, string লেখা, bool সত্য বা মিথ্যা।",
    [
      [
        "int quantity = 3;",
        "Declare a whole-number variable and assign three.",
        "পূর্ণসংখ্যার নামে ৩ রাখুন।",
      ],
      [
        "decimal price = 20m;",
        "The m suffix selects decimal rather than double.",
        "m দিয়ে decimal বাছুন।",
      ],
      [
        'string product = "Tea";',
        "Double quotes delimit a string literal.",
        "দ্বৈত উদ্ধৃতিতে string লেখা।",
      ],
      [
        "bool available = true;",
        "Store a boolean value.",
        "সত্য বা মিথ্যা রাখুন।",
      ],
    ],
  ],
  [
    "3. Expressions and interpolation · হিসাব ও লেখা",
    "Operators combine values into expressions. * multiplies, + adds numbers, and == compares values. A $ string can include expressions inside braces. Assignment = and equality == are different.",
    "Operator দিয়ে মানে কাজ হয়। * গুণ, + যোগ, == তুলনা। $ string-এ { }-এর মধ্যে মান বসে। = দিয়ে মান রাখেন, == দিয়ে সমান কি না দেখেন।",
    [
      ["int quantity = 3;", "Start with three units.", "পরিমাণ ৩।"],
      [
        "decimal total = quantity * 20m;",
        "Multiply quantity by price to get 60.",
        "পরিমাণ ও দাম গুণ।",
      ],
      [
        'Console.WriteLine($"Total: {total}");',
        "Insert the computed total into readable text.",
        "হিসাবটি লেখার মধ্যে বসান।",
      ],
    ],
  ],
  [
    "4. Conditions · শর্ত অনুযায়ী কাজ",
    "An if statement runs its body when the condition is true. else handles the other case. Braces group statements into a block.",
    "শর্ত সত্য হলে if-এর কাজ, না হলে else-এর কাজ চলে। { } দিয়ে কাজের block তৈরি হয়।",
    [
      ["int quantity = 3;", "Set the input to check.", "যাচাইয়ের input।"],
      [
        'if (quantity > 0) { Console.WriteLine("Valid"); }',
        "Use > to test whether quantity is positive.",
        "ধনাত্মক হলে Valid।",
      ],
      [
        'else { Console.WriteLine("Invalid"); }',
        "Handle zero or negative input.",
        "শূন্য বা ঋণাত্মক হলে Invalid।",
      ],
    ],
  ],
  [
    "5. Loops and indices · বারবার কাজ",
    "A for loop has initialization, a condition checked before each iteration, and an update afterward. Arrays start at index zero, so a three-element array has indices 0, 1, 2.",
    "for loop-এ শুরু, প্রতিবারের শর্ত ও শেষে পরিবর্তন থাকে। Array-এ প্রথম index ০; তিনটি মানের index ০, ১, ২।",
    [
      [
        "int[] scores = { 10, 20, 30 };",
        "Create a fixed-length array.",
        "তিন ঘরের array।",
      ],
      [
        "for (int i = 0; i < scores.Length; i++) {",
        "Start at zero and stop before Length.",
        "শূন্য থেকে Length-এর আগে পর্যন্ত।",
      ],
      [
        "  Console.WriteLine(scores[i]);",
        "Read the current indexed value.",
        "বর্তমান index-এর মান দেখান।",
      ],
      [
        "}",
        "End this iteration; i increases and the condition is checked again.",
        "ধাপ শেষে i বাড়ে, শর্ত আবার দেখা হয়।",
      ],
    ],
  ],
  [
    "6. Methods and return values · কাজের নাম দেওয়া",
    "A method names a reusable operation. Parameters receive input; return sends the result to its caller. The declared return type limits what kind of result it can return.",
    "Method হলো আবার ব্যবহার করা যায় এমন নাম দেওয়া কাজ। Parameter input নেয়, return ফল ফেরত দেয়।",
    [
      [
        "int Add(int a, int b) {",
        "Declare a method accepting two integers and returning an integer.",
        "দুই int নিয়ে int ফেরত দেওয়ার method।",
      ],
      [
        "  return a + b;",
        "Compute a sum and finish the call.",
        "যোগফল দিয়ে call শেষ।",
      ],
      ["}", "End the method definition.", "method-এর গঠন শেষ।"],
      [
        "Console.WriteLine(Add(2, 3));",
        "Call the method, then print its result, 5.",
        "method ডেকে ফল ৫ দেখান।",
      ],
    ],
  ],
  [
    "7. Objects and null · object ও অনুপস্থিত মান",
    "A class or record defines a type; new constructs an object. A property exposes part of its data. null means no object reference. A nullable type allows the program to express absence explicitly.",
    "Class বা record গঠন বলে; new object তৈরি করে। Property দিয়ে তথ্য দেখা যায়। null মানে কোনো object-এর ঠিকানা নেই।",
    [
      [
        'var person = new Person("Ayesha");',
        "Construct one object; var infers its type.",
        "একটি object বানান; var type বুঝে নেয়।",
      ],
      [
        "Console.WriteLine(person.Name);",
        "Read the Name property using a dot.",
        "ডট দিয়ে Name পড়ুন।",
      ],
      [
        "record Person(string Name);",
        "Declare a value-oriented data type.",
        "তথ্যের record type।",
      ],
    ],
  ],
  [
    "8. Exceptions and async · ভুল ও অপেক্ষা",
    "An exception reports a failure that ordinary return values do not handle. Catch only failures you can meaningfully handle. await suspends an async operation until its task completes; it does not automatically create a new thread.",
    "Exception কাজের ব্যর্থতার সংকেত। যেটি সামলাতে পারেন সেটিই catch করুন। await ফল না আসা পর্যন্ত async কাজ স্থগিত রাখে; নিজে থেকে নতুন thread বানায় না।",
    [
      [
        "using var stop = new CancellationTokenSource(TimeSpan.FromSeconds(1));",
        "Create a cancellation deadline and dispose the source afterward.",
        "অপেক্ষার সীমা দিন ও শেষে পরিষ্কার করুন।",
      ],
      [
        "try { await Task.Delay(500, stop.Token); }",
        "Wait asynchronously for half a second, allowing cancellation.",
        "আধা সেকেন্ড async অপেক্ষা।",
      ],
      [
        'catch (OperationCanceledException) { Console.WriteLine("Cancelled"); }',
        "Handle the specific cancellation case.",
        "নির্দিষ্ট বাতিলের ঘটনা সামলান।",
      ],
    ],
  ],
];
export default function BeginnerGuide({ lang }) {
  return (
    <section className="beginner-guide">
      <div className="path-heading">
        <div>
          <h2>C# from absolute zero · একদম শূন্য থেকে</h2>
          <p>
            Start here if variables, methods, and brackets feel unfamiliar.
            Every code line is explained.
          </p>
        </div>
      </div>
      <div className="setup-guide">
        <h3>Set up once · একবারের প্রস্তুতি</h3>
        <p>
          Install a supported .NET SDK from Microsoft. In a new folder, run{" "}
          <code>dotnet new console</code>. Replace Program.cs with one complete
          example below, then run <code>dotnet run</code>. Try one example at a
          time.
        </p>
        <p lang="bn">
          Microsoft থেকে .NET SDK নিন। নতুন folder-এ{" "}
          <code>dotnet new console</code> দিন। Program.cs-এ একটি উদাহরণ বসিয়ে{" "}
          <code>dotnet run</code> দিন। একবারে একটি উদাহরণ চালান।
        </p>
        <a
          href="https://learn.microsoft.com/dotnet/core/install/"
          target="_blank"
          rel="noreferrer"
        >
          Official setup guide ↗
        </a>
      </div>
      {lessons.map(([topic, en, bn, lines], i) => (
        <section className="guide-section" key={topic}>
          <h2>{topic}</h2>
          {lang !== "বাংলা" && <p>{en}</p>}
          {lang !== "English" && <p className="bn-text">{bn}</p>}
          <CodeLab
            lesson={{
              id: "guide-" + i,
              topic,
              lang: "csharp",
              module: { id: -1 },
              lines: lines.map(([text, en, bn]) => ({ text, en, bn })),
              code: lines.map((l) => l[0]).join("\n"),
            }}
            lang={lang}
          />
        </section>
      ))}
    </section>
  );
}
