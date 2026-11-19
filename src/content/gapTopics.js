// Interview-roadmap gap topics: Computer Networks (19), APIs & Microservices (20), Linux (21).
// Rows are rendered through the study pipeline in ./study.js.
import { networkRows } from "./gapNetworks";
import { microserviceRows } from "./gapMicroservices";
import { linuxRows } from "./gapLinux";
import { gapBangla } from "./gapBangla";

export const gapRows = [...networkRows, ...microserviceRows, ...linuxRows].map(
  (r) => ({
    ...r,
    cautionBn: gapBangla[r.topic]?.c,
    exerciseBn: gapBangla[r.topic]?.x,
    setupBn: gapBangla[r.topic]?.s,
  }),
);
export const gapModuleIds = [19, 20, 21];

export const gapContexts = {
  19: {
    need: [
      "Basic C# (variables, loops, async/await) and the idea that computers talk over a network",
      "সাধারণ C# (variable, loop, async/await) এবং কম্পিউটার network-এ কথা বলে — এই ধারণা",
    ],
    why: [
      "Every ASP.NET Core request, every HttpClient call and every SQL Server connection travels over a network. When an API is slow or 'cannot connect to SQL Server', the cause is usually DNS, a port, a firewall, routing or latency — not your C#. These lessons explain each piece in plain words and show it with System.Net code you can run, plus the SQL Server views that show the same thing from the database side.",
      "প্রতিটি ASP.NET Core request, HttpClient call ও SQL Server connection network দিয়ে যায়। API ধীর হলে বা 'SQL Server-এ connect হচ্ছে না' দেখালে কারণ সাধারণত DNS, port, firewall, routing বা latency — আপনার C# নয়। এখানে প্রতিটি অংশ সহজ ভাষায়, চালানো যায় এমন System.Net কোড ও SQL Server-এর দিক থেকে দেখানো হয়েছে।",
    ],
    analogy: [
      "The network is a postal system: IP addresses are house addresses, ports are flat numbers, DNS is the address book, routers are sorting offices and firewalls are security guards.",
      "Network একটি ডাক ব্যবস্থা: IP বাড়ির ঠিকানা, port ফ্ল্যাট নম্বর, DNS ঠিকানার বই, router বাছাই অফিস, firewall নিরাপত্তারক্ষী।",
    ],
    terms: [
      [
        "IP address",
        "Address of a device on a network",
        "network-এ device-এর ঠিকানা",
      ],
      [
        "Port",
        "Number that selects a program on a device (SQL Server 1433)",
        "device-এর কোন program, তার নম্বর",
      ],
      [
        "Protocol",
        "Agreed rules for talking (TCP, UDP, HTTP)",
        "কথা বলার নিয়ম",
      ],
      ["Latency", "Time for one round trip", "একবার আসা-যাওয়ার সময়"],
      [
        "Socket",
        "One end of a connection: IP + port",
        "connection-এর এক প্রান্ত",
      ],
    ],
  },
  20: {
    need: [
      "A minimal ASP.NET Core API, HTTP basics, and simple SQL Server tables",
      "ছোট ASP.NET Core API, HTTP-র মৌলিক ধারণা ও সাধারণ SQL Server table",
    ],
    why: [
      "These lessons fill the gaps between 'I can build one API' and 'I can design a system of services': how HTTP messages are built, how parameters and API keys work, how to draw service boundaries, how services talk (sync or async, REST or gRPC), find each other, own their data, keep reads fast (CQRS), keep history (event sourcing), stay consistent without one big transaction (sagas), and how a mesh and tracing make many services manageable. Each one has runnable C# and, where it matters, the SQL Server design behind it.",
      "এই অংশ 'একটি API বানাতে পারি' থেকে 'service-এর সিস্টেম ডিজাইন করতে পারি' পর্যন্ত ফাঁক পূরণ করে: HTTP বার্তা, parameter ও API key, service-এর সীমানা, sync/async ও REST/gRPC, service discovery, নিজের database, CQRS, event sourcing, saga, service mesh ও tracing। প্রতিটিতে চালানো যায় এমন C# এবং দরকার হলে SQL Server ডিজাইন আছে।",
    ],
    analogy: [
      "A microservice system is a shopping mall: each shop (service) has its own staff and stock room (database), customers find shops through the directory (service discovery), and shops coordinate deliveries by messages instead of sharing one cash box.",
      "Microservice সিস্টেম একটি শপিং মল: প্রতিটি দোকানের (service) নিজের কর্মী ও গুদাম (database), গ্রাহক তালিকা দেখে দোকান খোঁজে (service discovery), দোকানগুলো এক ক্যাশবাক্স ভাগ না করে বার্তা দিয়ে সমন্বয় করে।",
    ],
    terms: [
      [
        "Bounded context",
        "A business area with its own model and language",
        "নিজস্ব model ও ভাষার ব্যবসার অংশ",
      ],
      [
        "Event",
        "A fact that already happened (OrderPlaced)",
        "ঘটে যাওয়া একটি ঘটনা",
      ],
      [
        "Eventual consistency",
        "Copies agree after a short delay",
        "অল্প পরে সব কপি মিলে যায়",
      ],
      [
        "Compensation",
        "An action that undoes an earlier step",
        "আগের ধাপ উল্টানোর কাজ",
      ],
      [
        "Trace ID",
        "One ID that follows a request across services",
        "service জুড়ে request-এর একটি ID",
      ],
    ],
  },
  21: {
    need: [
      "The Linux Essentials module (ls, cd, chmod) and a published .NET app",
      "Linux Essentials module (ls, cd, chmod) ও একটি publish করা .NET app",
    ],
    why: [
      "Most ASP.NET Core APIs and many SQL Server instances run on Linux in production, in Docker or on a VM. These lessons cover what you need beyond the basic commands: where files live, reading logs with tail and less, users and groups, pipes, installing .NET and SQL tools with apt, environment variables for connection strings, scheduled jobs with cron, network checks with ss and ping, and running your API as a systemd service.",
      "Production-এ বেশিরভাগ ASP.NET Core API ও অনেক SQL Server Linux-এ চলে। মৌলিক command-এর বাইরে যা লাগে তা এখানে: ফাইল কোথায় থাকে, tail ও less দিয়ে log পড়া, user ও group, pipe, apt দিয়ে .NET ও SQL tool install, connection string-এর জন্য environment variable, cron job, ss ও ping দিয়ে network পরীক্ষা, এবং API-কে systemd service হিসেবে চালানো।",
    ],
    analogy: [
      "Running your app on Linux is like moving into a well-organised apartment block: you need to know which room is for what, who has which key, how to read the notice board, and how the caretaker keeps everything running.",
      "Linux-এ app চালানো সুসংগঠিত অ্যাপার্টমেন্টে ওঠার মতো: কোন ঘর কিসের, কার কাছে কোন চাবি, নোটিস বোর্ড কীভাবে পড়বেন, আর কেয়ারটেকার কীভাবে সব চালু রাখেন — জানতে হয়।",
    ],
    terms: [
      [
        "Service",
        "A long-running program managed by systemd",
        "systemd চালিত দীর্ঘ সময়ের program",
      ],
      [
        "stdout and stderr",
        "Normal output and error output streams",
        "সাধারণ ও error output",
      ],
      [
        "Environment variable",
        "Named setting a process inherits",
        "process যে নাম-দেওয়া setting পায়",
      ],
      [
        "Package",
        "Installable software with its dependencies",
        "dependency-সহ install করার software",
      ],
      [
        "Exit code",
        "Number a program returns: 0 means success",
        "program-এর ফেরত নম্বর, ০ মানে সফল",
      ],
    ],
  },
};

export const gapDocs = {
  19: [
    "Microsoft Learn: Networking in .NET",
    "https://learn.microsoft.com/dotnet/fundamentals/networking/overview",
  ],
  20: [
    "Microsoft Learn: .NET microservices architecture",
    "https://learn.microsoft.com/dotnet/architecture/microservices/",
  ],
  21: [
    "Microsoft Learn: Host ASP.NET Core on Linux with Nginx",
    "https://learn.microsoft.com/aspnet/core/host-and-deploy/linux-nginx",
  ],
};
