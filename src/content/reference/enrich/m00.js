// Module 00 Git: easy story, plain theory, steps, mistakes, 2028 tip, hands-on practice.
import { sh } from "./helpers";

export default {
  "git init": {
    s: ["Starting a diary: you buy a new notebook and write your name on the first page. Nothing is written yet, but now there is a place to record every day. git init gives your project folder that notebook: a hidden .git folder where history will be kept.", "ডায়েরি শুরু করার মতো: নতুন খাতা কিনে প্রথম পাতায় নাম লেখেন। এখনো কিছু লেখা হয়নি, কিন্তু প্রতিদিন লেখার জায়গা তৈরি হলো। git init আপনার project folder-কে সেই খাতা দেয়: একটি লুকানো .git folder, যেখানে ইতিহাস জমা থাকবে।"],
    t: ["git init turns a normal folder into a Git repository. It creates .git, which stores commits, branches and settings. Your files are not changed and nothing is saved until you add and commit. Run it once per project, at the project's top folder.", "git init একটি সাধারণ folder-কে Git repository বানায়। এটি .git তৈরি করে, যেখানে commit, branch ও setting থাকে। আপনার file বদলায় না, আর add ও commit না করা পর্যন্ত কিছু সংরক্ষিত হয় না। প্রতি project-এ একবার, project-এর সবচেয়ে উপরের folder-এ চালান।"],
    p: [["Open a terminal in your project's top folder.", "Project-এর সবচেয়ে উপরের folder-এ terminal খুলুন।"], ["Run git init -b main.", "git init -b main চালান।"], ["Create .gitignore for bin/, obj/ and secrets.", "bin/, obj/ ও secret-এর জন্য .gitignore বানান।"], ["Add files and make the first commit.", "File add করে প্রথম commit করুন।"]],
    m: ["Running git init inside a subfolder of an existing repository (nested repos); running it in your home folder so Git tracks everything; forgetting .gitignore so bin/ and obj/ get committed.", "আগের repository-র ভিতরের subfolder-এ git init (nested repo); home folder-এ চালিয়ে Git-কে সবকিছু track করানো; .gitignore ভুলে যাওয়ায় bin/ ও obj/ commit হয়ে যাওয়া।"],
    f: ["AI coding agents work best in a Git repository because every change they make is visible in git diff and can be undone. Start every project, even small experiments, with git init.", "AI coding agent Git repository-তে সবচেয়ে ভালো কাজ করে, কারণ তাদের প্রতিটি পরিবর্তন git diff-এ দেখা যায় ও ফেরানো যায়। ছোট পরীক্ষাসহ প্রতিটি project git init দিয়ে শুরু করুন।"],
    x: [sh("Start a repository the right way · সঠিকভাবে repository শুরু", `mkdir hello-git && cd hello-git
git init -b main
printf 'bin/\\nobj/\\n.env\\n' > .gitignore
echo "# Hello Git" > README.md
git add .
git commit -m "Initial commit"
git log --oneline`, `Initialized empty Git repository in /home/you/practice/hello-git/.git/
[main (root-commit) 1a2b3c4] Initial commit
 2 files changed, 4 insertions(+)
 create mode 100644 .gitignore
 create mode 100644 README.md
1a2b3c4 (HEAD -> main) Initial commit`)],
  },
  "git clone": {
    s: ["Photocopying a whole book from the library, including the list of every edition ever printed. You get your own complete copy to read and write in, and you remember which library it came from.", "Library থেকে পুরো বই photocopy করার মতো, সাথে ছাপা প্রতিটি সংস্করণের তালিকাও। আপনি নিজের সম্পূর্ণ কপি পান পড়া ও লেখার জন্য, আর মনে রাখেন কোন library থেকে এসেছে।"],
    t: ["git clone downloads a full repository: all files, all commits and all branches. It sets a remote called origin pointing to where it came from, and checks out the default branch. After cloning you can work offline and later push or pull.", "git clone পুরো repository নামায়: সব file, সব commit, সব branch। যেখান থেকে এল সেদিকে origin নামের remote ঠিক করে এবং default branch checkout করে। Clone-এর পর offline কাজ করে পরে push বা pull করা যায়।"],
    p: [["Copy the HTTPS or SSH URL from GitHub.", "GitHub থেকে HTTPS বা SSH URL copy করুন।"], ["Run git clone <url> in your practice folder.", "Practice folder-এ git clone <url> চালান।"], ["cd into the new folder and run git remote -v.", "নতুন folder-এ cd করে git remote -v চালান।"], ["Build and run the project to confirm it works.", "Project build করে চালিয়ে দেখুন কাজ করে।"]],
    m: ["Cloning inside another repository; cloning with a password in the URL (it gets saved in .git/config); using --depth 1 and later being surprised that old history is missing.", "অন্য repository-র ভিতরে clone; URL-এ password দিয়ে clone (তা .git/config-এ থেকে যায়); --depth 1 ব্যবহার করে পরে পুরনো ইতিহাস নেই দেখে অবাক হওয়া।"],
    f: ["Use SSH keys or GitHub CLI login instead of passwords; personal access tokens and SSO are the norm in companies. A fresh clone is also how CI and AI agents get your code, so keep the README's setup steps accurate.", "Password-এর বদলে SSH key বা GitHub CLI login ব্যবহার করুন; কোম্পানিতে personal access token ও SSO-ই প্রচলিত। CI ও AI agent-ও নতুন clone দিয়েই code পায়, তাই README-র setup ধাপ সঠিক রাখুন।"],
    x: [sh("Clone and inspect where it came from · clone করে উৎস দেখা", `git clone https://github.com/dotnet/samples.git --depth 1
cd samples
git remote -v
git branch --show-current
git log --oneline -1`, `Cloning into 'samples'...
remote: Enumerating objects: 9876, done.
Receiving objects: 100% (9876/9876), 41.20 MiB | 8.10 MiB/s, done.
origin  https://github.com/dotnet/samples.git (fetch)
origin  https://github.com/dotnet/samples.git (push)
main
f00dbab (grafted, HEAD -> main, origin/main) Update samples`)],
  },
  "git status": {
    s: ["Before leaving home you check: phone? keys? wallet? git status is that quick check for your project: which files changed, which are ready to save, and which Git does not know about yet.", "বাসা থেকে বের হওয়ার আগে দেখেন: ফোন? চাবি? মানিব্যাগ? git status আপনার project-এর সেই দ্রুত পরীক্ষা: কোন file বদলেছে, কোনগুলো সংরক্ষণের জন্য প্রস্তুত, আর কোনগুলো Git এখনো চেনে না।"],
    t: ["Git compares three places: the last commit (HEAD), the staging area (what you selected for the next commit) and your working folder. status shows the differences: staged changes, unstaged changes and untracked files, plus your branch and how far it is ahead or behind the remote.", "Git তিনটি জায়গা তুলনা করে: শেষ commit (HEAD), staging area (পরের commit-এর জন্য বাছাই করা) আর আপনার working folder। status পার্থক্য দেখায়: staged পরিবর্তন, unstaged পরিবর্তন, untracked file, সাথে branch ও remote-এর চেয়ে কত আগে বা পিছে।"],
    p: [["Run git status before and after every Git command while learning.", "শেখার সময় প্রতিটি Git command-এর আগে ও পরে git status চালান।"], ["Use git status -s for a short view.", "ছোট দৃশ্যের জন্য git status -s ব্যবহার করুন।"], ["Read the hints Git prints; they tell you the next command.", "Git-এর দেখানো hint পড়ুন; পরের command বলে দেয়।"], ["Add unwanted files to .gitignore.", "অপ্রয়োজনীয় file .gitignore-এ দিন।"]],
    m: ["Committing without checking status and including random files; ignoring 'Your branch is behind' and then getting push errors; thinking an untracked file is saved in Git.", "status না দেখে commit করে এলোমেলো file ঢোকানো; 'Your branch is behind' উপেক্ষা করে পরে push error পাওয়া; untracked file Git-এ সংরক্ষিত ভাবা।"],
    f: ["After an AI assistant edits your code, git status is the first command to run: it shows exactly which files were touched, including ones you did not expect.", "AI assistant code বদলানোর পর প্রথম command হলো git status: ঠিক কোন file ছোঁয়া হয়েছে দেখায়, অপ্রত্যাশিতগুলোসহ।"],
    x: [sh("Read the three states in short format · তিন অবস্থা পড়া", `echo "v2" >> README.md          # change a tracked file
echo "notes" > notes.txt       # new untracked file
git add README.md               # stage one change
echo "more" >> README.md        # change it again after staging
git status -s`, `MM README.md
?? notes.txt
# Left column = staged, right column = not yet staged, ?? = untracked`)],
  },
  "git add": {
    s: ["Packing a parcel: you choose which items go into the box before sealing it. git add puts chosen changes into the box (the staging area); git commit seals and labels it.", "পার্সেল প্যাক করার মতো: সিল করার আগে কোন জিনিস বাক্সে যাবে বেছে নেন। git add বাছাই করা পরিবর্তন বাক্সে (staging area) রাখে; git commit সিল করে লেবেল দেয়।"],
    t: ["git add copies the current content of files into the staging area. Only staged content goes into the next commit. You can stage whole files, all changes (git add .), or parts of a file (git add -p), which lets you make small, focused commits.", "git add file-এর বর্তমান লেখা staging area-তে কপি করে। শুধু staged লেখাই পরের commit-এ যায়। পুরো file, সব পরিবর্তন (git add .) বা file-এর অংশ (git add -p) stage করা যায়, ফলে ছোট ও নির্দিষ্ট commit বানানো যায়।"],
    p: [["Check git status to see what changed.", "কী বদলেছে দেখতে git status দেখুন।"], ["Stage related changes: git add path/to/file.", "সম্পর্কিত পরিবর্তন stage করুন: git add path/to/file।"], ["Use git add -p to pick individual hunks.", "আলাদা অংশ বাছতে git add -p ব্যবহার করুন।"], ["Confirm with git diff --staged before committing.", "Commit-এর আগে git diff --staged দিয়ে নিশ্চিত হন।"]],
    m: ["Always using git add . and committing secrets or debug files; editing a file after add and forgetting to add again; staging generated files like bin/ and obj/.", "সবসময় git add . দিয়ে secret বা debug file commit করা; add-এর পরে file বদলে আবার add করতে ভুলে যাওয়া; bin/ ও obj/-এর মতো তৈরি হওয়া file stage করা।"],
    f: ["git add -p is the best habit for reviewing AI-generated changes: you accept each hunk consciously instead of accepting everything at once.", "AI-তৈরি পরিবর্তন review-এর সেরা অভ্যাস git add -p: সব একসাথে না মেনে প্রতিটি অংশ সচেতনভাবে গ্রহণ করেন।"],
    x: [sh("Stage only what you mean · যা চান শুধু তাই stage", `echo 'Console.WriteLine("feature");' >> Program.cs
echo 'Console.WriteLine("debug!!");' >> Program.cs
git add -p Program.cs     # answer y for the feature hunk, n for debug
git diff --staged --stat
git status -s`, `(1/1) Stage this hunk [y,n,q,a,d,s,e,?]? s   # split into smaller hunks
...
 Program.cs | 1 +
 1 file changed, 1 insertion(+)
MM Program.cs`)],
  },
  "git commit": {
    s: ["Taking a dated photo of your room after cleaning. Later you can always look at that photo and see exactly how the room looked that day. A commit is a dated photo of your staged files, with a note explaining why.", "পরিষ্কারের পর ঘরের তারিখসহ ছবি তোলার মতো। পরে সেই ছবি দেখে ঠিক সেদিন ঘর কেমন ছিল জানা যায়। Commit হলো staged file-এর তারিখসহ ছবি, সাথে কেন তা বোঝানো একটি নোট।"],
    t: ["A commit saves a snapshot of the staging area with author, date, message and a link to the previous commit. Its id (hash) is unique. Good commits are small and focused, and their messages explain why the change was made, not only what changed.", "Commit staging area-র snapshot রাখে, সাথে লেখক, তারিখ, message ও আগের commit-এর link। এর id (hash) অনন্য। ভালো commit ছোট ও নির্দিষ্ট, আর message শুধু কী বদলাল নয়, কেন বদলাল তা বোঝায়।"],
    p: [["Stage one logical change.", "একটি যৌক্তিক পরিবর্তন stage করুন।"], ["Write a short summary line (under ~60 characters) in the imperative: 'Add login validation'.", "আদেশসূচক ছোট সারাংশ লাইন লিখুন (~৬০ অক্ষরের কম): 'Add login validation'।"], ["Add a body explaining why, if needed.", "দরকারে কেন তা ব্যাখ্যা করে body লিখুন।"], ["Check with git log --oneline.", "git log --oneline দিয়ে দেখুন।"]],
    m: ["Messages like 'fix' or 'update'; one huge commit with many unrelated changes; committing code that does not build; committing passwords (removing them later does not erase history).", "'fix' বা 'update'-এর মতো message; অনেক অসম্পর্কিত পরিবর্তনের একটি বিশাল commit; build হয় না এমন code commit; password commit করা (পরে মুছলেও ইতিহাস থেকে যায় না)।"],
    f: ["Many teams use Conventional Commits (feat:, fix:, docs:) so tools can generate changelogs and versions automatically. AI tools can draft messages, but you should edit them to explain the real reason.", "অনেক দল Conventional Commits (feat:, fix:, docs:) ব্যবহার করে, যাতে tool স্বয়ংক্রিয়ভাবে changelog ও version বানায়। AI message-এর খসড়া দিতে পারে, কিন্তু আসল কারণ বোঝাতে আপনাকে তা সম্পাদনা করতে হবে।"],
    x: [sh("A clear commit with summary and body · সারাংশ ও body-সহ commit", `git add src/Orders/DiscountService.cs tests/DiscountTests.cs
git commit -m "feat: add 10% discount for orders >= 5000 BDT" \\
           -m "Marketing campaign for Eid. Boundary 5000 is included; see spec docs/specs/discount.md."
git log -1 --format='%h %an%n%s%n%n%b'`, `[main 7c9e2d1] feat: add 10% discount for orders >= 5000 BDT
 2 files changed, 41 insertions(+)
7c9e2d1 Asha Rahman
feat: add 10% discount for orders >= 5000 BDT

Marketing campaign for Eid. Boundary 5000 is included; see spec docs/specs/discount.md.`)],
  },
  "git log": {
    s: ["A shop's sales register lists every sale with date, seller and note, newest at the top. When something is missing, the owner reads the register. git log is your project's register.", "দোকানের বিক্রির খাতায় প্রতিটি বিক্রি তারিখ, বিক্রেতা ও নোটসহ লেখা, নতুনটা উপরে। কিছু হারালে মালিক খাতা পড়েন। git log আপনার project-এর খাতা।"],
    t: ["git log walks back from the current commit through parents and prints history. Useful forms: --oneline for a compact list, --graph to see branches and merges, -p to see changes, --author and --since to filter, and -- path to see the history of one file.", "git log বর্তমান commit থেকে parent ধরে পিছনে যায় এবং ইতিহাস দেখায়। দরকারি রূপ: ছোট তালিকায় --oneline, branch ও merge দেখতে --graph, পরিবর্তন দেখতে -p, filter করতে --author ও --since, আর একটি file-এর ইতিহাস দেখতে -- path।"],
    p: [["Run git log --oneline --graph --all to see the big picture.", "বড় চিত্র দেখতে git log --oneline --graph --all চালান।"], ["Filter with --author=\"Asha\" or --since=\"2 weeks ago\".", "--author=\"Asha\" বা --since=\"2 weeks ago\" দিয়ে filter করুন।"], ["See one file's history: git log -p -- Program.cs.", "একটি file-এর ইতিহাস: git log -p -- Program.cs।"], ["Search messages: git log --grep=\"login\".", "Message-এ খুঁজুন: git log --grep=\"login\"।"]],
    m: ["Getting stuck in the pager (press q to quit); forgetting --all so other branches are hidden; reading only messages when the bug is in the code (use -p or -S).", "Pager-এ আটকে যাওয়া (বের হতে q চাপুন); --all ভুলে অন্য branch লুকানো থাকা; bug code-এ থাকলেও শুধু message পড়া (-p বা -S ব্যবহার করুন)।"],
    f: ["git log -S \"text\" finds the commit that added or removed a string. Combined with good commit messages, history becomes the documentation that both people and AI tools use to understand why code exists.", "git log -S \"text\" সেই commit খুঁজে দেয় যা একটি লেখা যোগ বা মুছেছিল। ভালো commit message-এর সাথে ইতিহাস হয়ে ওঠে documentation, যা মানুষ ও AI tool code কেন আছে বুঝতে ব্যবহার করে।"],
    x: [sh("Find who changed a line and why · কে কেন বদলাল খোঁজা", `# 1) the big picture  2) which commit touched a word  3) my recent work
git log --oneline --graph --all -5
git log -S "MaxRetries" --oneline        # commits that added/removed this text
git log --since="1 week ago" --author="Asha" --format="%h %ad %s" --date=short`, `* 7c9e2d1 (HEAD -> main) feat: add discount
* 4b1f0a3 fix: retry payment 3 times
| * 9d8e7f6 (feature/search) wip: search page
|/
* 1a2b3c4 Initial commit
4b1f0a3 fix: retry payment 3 times
7c9e2d1 2026-11-10 feat: add discount`)],
  },
  "git diff": {
    s: ["Two versions of an exam answer side by side, with crossed-out lines in red and new lines in green. git diff shows exactly that for your code.", "পরীক্ষার উত্তরের দুটি সংস্করণ পাশাপাশি, কাটা লাইন লাল আর নতুন লাইন সবুজে। git diff আপনার code-এর জন্য ঠিক তাই দেখায়।"],
    t: ["git diff compares two versions. With no arguments it shows unstaged changes (working folder vs staging). --staged shows what will be committed. You can also compare branches (main..feature) or commits. Lines starting with - were removed, + were added.", "git diff দুটি সংস্করণ তুলনা করে। Argument ছাড়া unstaged পরিবর্তন দেখায় (working folder বনাম staging)। --staged দেখায় কী commit হবে। Branch (main..feature) বা commit-ও তুলনা করা যায়। - দিয়ে শুরু লাইন মুছে গেছে, + দিয়ে যোগ হয়েছে।"],
    p: [["Run git diff to review unstaged changes.", "Unstaged পরিবর্তন দেখতে git diff চালান।"], ["Run git diff --staged right before committing.", "Commit-এর ঠিক আগে git diff --staged চালান।"], ["Compare branches: git diff main...feature --stat.", "Branch তুলনা: git diff main...feature --stat।"], ["Use --word-diff for text documents.", "Text document-এ --word-diff ব্যবহার করুন।"]],
    m: ["Running git diff after staging and seeing nothing (use --staged); reviewing only --stat and not the real lines; whitespace-only changes hiding real ones (use -w).", "Stage করার পর git diff চালিয়ে কিছু না দেখা (--staged দিন); শুধু --stat দেখে আসল লাইন না পড়া; শুধু whitespace পরিবর্তনে আসল পরিবর্তন লুকিয়ে যাওয়া (-w দিন)।"],
    f: ["Reading diffs is a core skill for reviewing pull requests and AI-generated changes. Practise spotting risky lines: changed conditions, removed checks, new dependencies, secrets.", "Pull request ও AI-তৈরি পরিবর্তন review-এর মূল দক্ষতা diff পড়া। ঝুঁকির লাইন খোঁজা অনুশীলন করুন: বদলানো শর্ত, মুছে ফেলা যাচাই, নতুন dependency, secret।"],
    x: [sh("Read a diff line by line · diff লাইন ধরে পড়া", `# Show staged changes with 1 line of context
# Lines starting with - were removed, + were added
git add src/Orders/DiscountService.cs
git diff --staged -U1 src/Orders/DiscountService.cs`, `diff --git a/src/Orders/DiscountService.cs b/src/Orders/DiscountService.cs
@@ -10,3 +10,3 @@ public decimal Apply(decimal total)
-    if (total > 5000) return total * 0.9m;
+    if (total >= 5000) return total * 0.9m;
     return total;
# One character changed the business rule: 5000 itself now gets the discount.`)],
  },
  "git push": {
    s: ["You have written letters at home; push is walking to the post office and putting them in the shared mailbox so the whole team can read them.", "বাসায় চিঠি লিখেছেন; push হলো ডাকঘরে গিয়ে সবার জন্য রাখা ডাকবাক্সে চিঠি ফেলা, যাতে পুরো দল পড়তে পারে।"],
    t: ["git push sends your local commits to a remote (usually origin on GitHub) and moves the remote branch forward. If someone else pushed first, Git refuses because the histories have diverged; you must pull or rebase first. The first push of a new branch needs -u to set up tracking.", "git push আপনার local commit remote-এ (সাধারণত GitHub-এর origin) পাঠায় এবং remote branch এগিয়ে নেয়। অন্য কেউ আগে push করলে ইতিহাস আলাদা হওয়ায় Git প্রত্যাখ্যান করে; আগে pull বা rebase করতে হয়। নতুন branch-এর প্রথম push-এ tracking ঠিক করতে -u লাগে।"],
    p: [["Commit your work locally.", "Local-এ কাজ commit করুন।"], ["First push of a branch: git push -u origin feature/x.", "Branch-এর প্রথম push: git push -u origin feature/x।"], ["Later pushes: just git push.", "পরের push: শুধু git push।"], ["If rejected, run git pull --rebase, fix conflicts, then push again.", "প্রত্যাখ্যাত হলে git pull --rebase চালিয়ে conflict ঠিক করে আবার push করুন।"]],
    m: ["git push --force on a shared branch, deleting teammates' work (use --force-with-lease if you must); pushing directly to main; pushing secrets (assume they are leaked; rotate them).", "শেয়ার করা branch-এ git push --force দিয়ে সহকর্মীর কাজ মুছে ফেলা (দরকার হলে --force-with-lease); সরাসরি main-এ push; secret push করা (ফাঁস হয়েছে ধরে নিয়ে বদলে ফেলুন)।"],
    f: ["Modern teams protect main: pushes go to branches, and merging requires CI to pass and a review. Secret scanning blocks pushes containing keys. Expect this workflow everywhere.", "আধুনিক দল main রক্ষা করে: push যায় branch-এ, merge-এ CI পাস ও review লাগে। Secret scanning key-সহ push আটকায়। সব জায়গায় এই ধারা আশা করুন।"],
    x: [sh("Push a new branch and handle a rejection · নতুন branch push ও প্রত্যাখ্যান সামলানো", `git switch -c feature/discount
git commit -am "feat: discount"
git push -u origin feature/discount
# ...later, someone else pushed to the same branch...
git push
git pull --rebase && git push`, `branch 'feature/discount' set up to track 'origin/feature/discount'.
 * [new branch]      feature/discount -> feature/discount
 ! [rejected]        feature/discount -> feature/discount (fetch first)
error: failed to push some refs
Successfully rebased and updated refs/heads/feature/discount.
   3f2a9c1..8e7d6c5  feature/discount -> feature/discount`)],
  },
  "git pull": {
    s: ["Before you start writing in the shared class notebook, you read what classmates added since yesterday. git pull brings their new pages into your copy.", "Class-এর শেয়ার করা খাতায় লেখা শুরুর আগে গতকাল থেকে সহপাঠীরা কী যোগ করেছে পড়েন। git pull তাদের নতুন পাতা আপনার কপিতে আনে।"],
    t: ["git pull = git fetch (download new commits) + integrate them into your current branch, either by merge (default) or rebase (--rebase). If you and others changed the same lines, you get a conflict to resolve manually.", "git pull = git fetch (নতুন commit নামানো) + বর্তমান branch-এ মেলানো, merge (default) বা rebase (--rebase) দিয়ে। আপনি ও অন্যরা একই লাইন বদলালে conflict আসে, যা হাতে মেটাতে হয়।"],
    p: [["Commit or stash your local changes first.", "আগে local পরিবর্তন commit বা stash করুন।"], ["Run git pull --rebase for a clean, linear history.", "পরিষ্কার, সরল ইতিহাসের জন্য git pull --rebase চালান।"], ["If there is a conflict, edit the files, git add them, then git rebase --continue.", "Conflict হলে file সম্পাদনা করে git add করুন, তারপর git rebase --continue।"], ["Run the tests after pulling.", "Pull-এর পর test চালান।"]],
    m: ["Pulling with uncommitted changes and getting confused by errors; creating many 'Merge branch main' commits; resolving conflicts by deleting the other person's code without understanding it.", "Commit না করা পরিবর্তনসহ pull করে error-এ বিভ্রান্ত হওয়া; অনেক 'Merge branch main' commit তৈরি; না বুঝে অন্যের code মুছে conflict মেটানো।"],
    f: ["Set git config --global pull.rebase true once to keep history clean. When resolving conflicts, AI tools can explain both sides, but run the tests to confirm the merged result.", "ইতিহাস পরিষ্কার রাখতে একবার git config --global pull.rebase true দিন। Conflict মেটাতে AI দুই পক্ষ ব্যাখ্যা করতে পারে, কিন্তু মেলানো ফল নিশ্চিত করতে test চালান।"],
    x: [sh("Pull with rebase and resolve a conflict · rebase-সহ pull ও conflict", `git pull --rebase
# CONFLICT in Program.cs -> open it and choose the right code
cat Program.cs
# edit to keep the correct line, then:
git add Program.cs
git rebase --continue`, `CONFLICT (content): Merge conflict in Program.cs
<<<<<<< HEAD
Console.WriteLine("Hello, Dhaka!");
=======
Console.WriteLine("Hello, Bangladesh!");
>>>>>>> 4b1f0a3 (your commit)
Successfully rebased and updated refs/heads/main.`)],
  },
  "git fetch": {
    s: ["Checking the notice board without changing your own schedule. You see what is new; you decide later whether to adopt it.", "নিজের সময়সূচি না বদলে notice board দেখার মতো। নতুন কী দেখেন; গ্রহণ করবেন কি না পরে ঠিক করেন।"],
    t: ["git fetch downloads new commits and branches from the remote and updates remote-tracking branches like origin/main, but does not touch your files or your current branch. It is always safe. Afterwards you can compare (git log main..origin/main) and choose to merge or rebase.", "git fetch remote থেকে নতুন commit ও branch নামিয়ে origin/main-এর মতো remote-tracking branch আপডেট করে, কিন্তু আপনার file বা বর্তমান branch ছোঁয় না। এটি সবসময় নিরাপদ। পরে তুলনা করে (git log main..origin/main) merge বা rebase বেছে নিতে পারেন।"],
    p: [["Run git fetch --prune to update and remove deleted remote branches.", "আপডেট ও মুছে যাওয়া remote branch সরাতে git fetch --prune চালান।"], ["See what is new: git log --oneline main..origin/main.", "নতুন কী দেখুন: git log --oneline main..origin/main।"], ["Review changes: git diff main origin/main --stat.", "পরিবর্তন দেখুন: git diff main origin/main --stat।"], ["Integrate when ready: git rebase origin/main.", "প্রস্তুত হলে মেলান: git rebase origin/main।"]],
    m: ["Thinking fetch updated your files; comparing with stale origin/main because you never fetched; forgetting --prune so old branches pile up.", "Fetch file আপডেট করেছে ভাবা; কখনো fetch না করায় পুরনো origin/main-এর সাথে তুলনা; --prune ভুলে পুরনো branch জমে যাওয়া।"],
    f: ["fetch + review + rebase gives you control, which matters when many people and bots push changes all day. CI systems use fetch the same way.", "fetch + review + rebase নিয়ন্ত্রণ দেয়, যা জরুরি যখন সারাদিন অনেক মানুষ ও bot পরিবর্তন push করে। CI system-ও একইভাবে fetch ব্যবহার করে।"],
    x: [sh("Look before you integrate · মেলানোর আগে দেখা", `git fetch --prune
git status -sb
git log --oneline main..origin/main
git diff --stat main origin/main`, `From github.com:team/shop
   1a2b3c4..9f8e7d6  main       -> origin/main
 - [deleted]         (none)     -> origin/old-experiment
## main...origin/main [behind 2]
9f8e7d6 fix: rounding in invoice total
5c4b3a2 docs: update setup steps
 README.md               | 6 +++---
 src/Billing/Invoice.cs  | 2 +-`)],
  },
  "git branch": {
    s: ["A road that splits: you can explore a side road (a new feature) while the main road stays clear for everyone. Later the side road can rejoin the main road.", "ভাগ হওয়া রাস্তার মতো: পাশের রাস্তায় (নতুন feature) ঘুরে দেখতে পারেন, প্রধান রাস্তা সবার জন্য খালি থাকে। পরে পাশের রাস্তা আবার প্রধান রাস্তায় মেশে।"],
    t: ["A branch is just a movable label pointing to a commit. Creating one is instant and cheap. Your new commits move the current branch forward. git branch lists, creates, renames and deletes branches; -vv shows tracking and ahead/behind information.", "Branch হলো একটি commit-এর দিকে নির্দেশ করা চলমান label। বানানো তাৎক্ষণিক ও সস্তা। নতুন commit বর্তমান branch-কে এগিয়ে নেয়। git branch তালিকা, তৈরি, নাম বদল ও মোছার কাজ করে; -vv tracking ও আগে/পিছে তথ্য দেখায়।"],
    p: [["List branches: git branch -vv.", "Branch-এর তালিকা: git branch -vv।"], ["Create a feature branch with a clear name: feature/login-otp.", "স্পষ্ট নামে feature branch বানান: feature/login-otp।"], ["Delete merged branches: git branch -d feature/login-otp.", "Merge হওয়া branch মুছুন: git branch -d feature/login-otp।"], ["Rename: git branch -m old-name new-name.", "নাম বদলান: git branch -m old-name new-name।"]],
    m: ["Creating a branch but forgetting to switch to it; long-lived branches that drift far from main; using -D (force delete) on unmerged work you still need.", "Branch বানিয়ে switch করতে ভুলে যাওয়া; main থেকে অনেক দূরে সরে যাওয়া দীর্ঘজীবী branch; দরকারি unmerged কাজে -D (জোর করে মোছা) দেওয়া।"],
    f: ["Short-lived branches (hours to a few days) with small pull requests are the modern norm, often called trunk-based development. AI agents also work best on their own short branches.", "ছোট pull request-সহ স্বল্পায়ু branch (কয়েক ঘণ্টা থেকে কয়েক দিন) আধুনিক রীতি, প্রায়ই trunk-based development বলা হয়। AI agent-ও নিজের ছোট branch-এ সবচেয়ে ভালো কাজ করে।"],
    x: [sh("Create, list and clean up branches · branch তৈরি, তালিকা, পরিষ্কার", `git branch feature/login-otp
git branch -vv
git branch --merged main
git branch -d feature/old-banner`, `  feature/login-otp  7c9e2d1 feat: add discount
* main               7c9e2d1 [origin/main] feat: add discount
  feature/old-banner 1a2b3c4 Initial commit
  feature/old-banner
  feature/login-otp
* main
Deleted branch feature/old-banner (was 1a2b3c4).`)],
  },
  "git switch": {
    s: ["Moving from one classroom to another: your bag (uncommitted work) comes with you, and the room's board shows that class's notes. git switch moves you between branches.", "এক classroom থেকে অন্যটায় যাওয়ার মতো: আপনার ব্যাগ (commit না করা কাজ) সাথে যায়, আর ঘরের বোর্ডে সেই class-এর নোট। git switch আপনাকে branch-এর মধ্যে সরায়।"],
    t: ["git switch changes the current branch and updates your files to match it. git switch -c name creates and switches in one step. If you have uncommitted changes that would be overwritten, Git stops you; commit or stash first. git switch - goes back to the previous branch.", "git switch বর্তমান branch বদলায় এবং file সেই অনুযায়ী আপডেট করে। git switch -c name এক ধাপে বানায় ও switch করে। Commit না করা পরিবর্তন মুছে যাওয়ার ঝুঁকি থাকলে Git থামায়; আগে commit বা stash করুন। git switch - আগের branch-এ ফেরে।"],
    p: [["Make sure git status is clean or stash your work.", "git status পরিষ্কার নিশ্চিত করুন বা কাজ stash করুন।"], ["Create and move: git switch -c feature/cart.", "বানিয়ে সরুন: git switch -c feature/cart।"], ["Jump back: git switch -.", "ফিরে যান: git switch -।"], ["Track a remote branch: git switch feature/x (after fetch).", "Remote branch track করুন: git switch feature/x (fetch-এর পরে)।"]],
    m: ["Using old checkout commands and accidentally restoring files; switching with uncommitted changes and carrying them to the wrong branch; forgetting to fetch before switching to a teammate's branch.", "পুরনো checkout command ব্যবহার করে ভুলবশত file ফেরানো; commit না করা পরিবর্তনসহ switch করে ভুল branch-এ নিয়ে যাওয়া; সহকর্মীর branch-এ যাওয়ার আগে fetch ভুলে যাওয়া।"],
    f: ["For working on two branches at once (for example while an AI agent works on another), learn git worktree: it gives each branch its own folder.", "একসাথে দুটি branch-এ কাজ করতে (যেমন একটি AI agent অন্যটায় কাজ করছে) git worktree শিখুন: প্রতিটি branch-কে নিজস্ব folder দেয়।"],
    x: [sh("Switch safely between branches · নিরাপদে branch বদল", `git switch -c feature/cart
echo "cart" > Cart.cs && git add Cart.cs && git commit -qm "feat: cart"
git switch main
ls Cart.cs
git switch -
ls Cart.cs`, `Switched to a new branch 'feature/cart'
Switched to branch 'main'
ls: cannot access 'Cart.cs': No such file or directory
Switched to branch 'feature/cart'
Cart.cs`)],
  },
  "git checkout": {
    s: ["An old Swiss-army knife: one tool that opens bottles, cuts rope and fixes screws. Handy, but easy to use the wrong blade. git checkout does many jobs; newer git switch and git restore split them into safer tools.", "পুরনো Swiss-army ছুরি: একটি tool বোতল খোলে, দড়ি কাটে, স্ক্রু ঠিক করে। কাজের, কিন্তু ভুল ফলা ব্যবহারের ঝুঁকি। git checkout অনেক কাজ করে; নতুন git switch ও git restore সেগুলোকে নিরাপদ tool-এ ভাগ করেছে।"],
    t: ["git checkout <branch> switches branches; git checkout -b creates one; git checkout <commit> moves to an old commit in 'detached HEAD' state (look around, do not commit there without creating a branch); git checkout -- file discards changes to a file. Prefer switch for branches and restore for files.", "git checkout <branch> branch বদলায়; git checkout -b বানায়; git checkout <commit> পুরনো commit-এ 'detached HEAD' অবস্থায় নেয় (দেখুন, branch না বানিয়ে সেখানে commit করবেন না); git checkout -- file একটি file-এর পরিবর্তন বাতিল করে। Branch-এ switch আর file-এ restore ব্যবহার করুন।"],
    p: [["View an old version: git checkout <hash>.", "পুরনো সংস্করণ দেখুন: git checkout <hash>।"], ["If you want to keep work from there, create a branch: git switch -c fix/from-old.", "সেখান থেকে কাজ রাখতে চাইলে branch বানান: git switch -c fix/from-old।"], ["Return: git switch main.", "ফিরুন: git switch main।"], ["Discard file changes with git restore file (modern form).", "File-এর পরিবর্তন বাতিল করুন git restore file দিয়ে (আধুনিক রূপ)।"]],
    m: ["Committing in detached HEAD and losing the commits after switching away; running git checkout . and wiping all uncommitted work; confusing a file name with a branch name.", "Detached HEAD-এ commit করে অন্যত্র গেলে commit হারানো; git checkout . চালিয়ে সব commit না করা কাজ মুছে ফেলা; file-এর নাম ও branch-এর নাম গুলিয়ে ফেলা।"],
    f: ["You will still see checkout in older docs, scripts and CI files, so recognise it, but teach yourself the clearer switch/restore commands.", "পুরনো docs, script ও CI file-এ এখনো checkout দেখবেন, তাই চিনে রাখুন, কিন্তু নিজে আরও স্পষ্ট switch/restore শিখুন।"],
    x: [sh("Visit an old commit without losing anything · কিছু না হারিয়ে পুরনো commit দেখা", `git log --oneline -3
git checkout 1a2b3c4
git status | head -1
git switch -c investigate/old-bug
git switch main`, `7c9e2d1 feat: add discount
4b1f0a3 fix: retry payment
1a2b3c4 Initial commit
Note: switching to '1a2b3c4'. You are in 'detached HEAD' state...
HEAD detached at 1a2b3c4
Switched to a new branch 'investigate/old-bug'
Switched to branch 'main'`)],
  },
  "git merge": {
    s: ["Two cooks prepared parts of a meal in separate pots. Merging is pouring both into one serving dish. If both added salt, you taste and decide (a conflict).", "দুই রাঁধুনি আলাদা হাঁড়িতে খাবারের অংশ রান্না করেছেন। Merge হলো দুটো এক থালায় ঢালা। দুজনই লবণ দিলে চেখে সিদ্ধান্ত নিতে হয় (conflict)।"],
    t: ["git merge feature brings the feature branch's commits into the current branch. If main has not moved, Git just moves the label forward (fast-forward). Otherwise it creates a merge commit with two parents. Conflicts happen when both sides changed the same lines; you edit the file, remove the markers, add and commit.", "git merge feature, feature branch-এর commit বর্তমান branch-এ আনে। main না সরলে Git শুধু label এগিয়ে দেয় (fast-forward)। নাহলে দুই parent-সহ merge commit তৈরি করে। দুই পক্ষ একই লাইন বদলালে conflict হয়; file সম্পাদনা করে marker সরিয়ে add ও commit করুন।"],
    p: [["Switch to the receiving branch: git switch main and git pull.", "গ্রহণকারী branch-এ যান: git switch main ও git pull।"], ["Merge: git merge --no-ff feature/cart.", "Merge করুন: git merge --no-ff feature/cart।"], ["Resolve conflicts, then git add and git commit.", "Conflict মেটান, তারপর git add ও git commit।"], ["Run tests before pushing.", "Push-এর আগে test চালান।"]],
    m: ["Merging without pulling main first; leaving <<<<<<< markers in the code; resolving conflicts by keeping 'mine' everywhere; merging untested branches.", "আগে main pull না করে merge; code-এ <<<<<<< marker রেখে দেওয়া; সব জায়গায় 'আমার'টা রেখে conflict মেটানো; test না করা branch merge।"],
    f: ["In teams, merges usually happen through pull requests on GitHub with required checks. Learn the three merge buttons (merge commit, squash, rebase) and what history each creates.", "দলে merge সাধারণত GitHub-এর pull request দিয়ে, বাধ্যতামূলক check-সহ হয়। তিনটি merge বোতাম (merge commit, squash, rebase) আর প্রতিটি কী ইতিহাস বানায় শিখুন।"],
    x: [sh("Merge a feature and see the graph · feature merge ও graph", `# Always merge into an up-to-date main
# --no-ff keeps a merge commit so the feature stays visible
git switch main && git pull -q
git merge --no-ff feature/cart -m "Merge feature/cart"
git log --oneline --graph -4`, `Merge made by the 'ort' strategy.
 Cart.cs | 1 +
 1 file changed, 1 insertion(+)
*   b7a6c5d (HEAD -> main) Merge feature/cart
|\\
| * 2e3f4a5 (feature/cart) feat: cart
|/
* 7c9e2d1 feat: add discount`)],
  },
  "git tag": {
    s: ["Putting a bookmark with a label like 'Chapter 5 – exam' in your textbook. The page never moves, and you can find it instantly. A tag marks a commit, usually a release like v1.2.0.", "পাঠ্যবইয়ে 'Chapter 5 – exam' লেখা bookmark রাখার মতো। পাতা কখনো সরে না, মুহূর্তে খুঁজে পাওয়া যায়। Tag একটি commit চিহ্নিত করে, সাধারণত v1.2.0-এর মতো release।"],
    t: ["A tag is a fixed name for a commit. Annotated tags (-a) store author, date and message and are best for releases. Tags are not pushed automatically: use git push origin v1.2.0 or --tags. Use semantic versioning: MAJOR.MINOR.PATCH.", "Tag হলো একটি commit-এর স্থির নাম। Annotated tag (-a) লেখক, তারিখ ও message রাখে এবং release-এর জন্য সেরা। Tag নিজে থেকে push হয় না: git push origin v1.2.0 বা --tags দিন। Semantic versioning ব্যবহার করুন: MAJOR.MINOR.PATCH।"],
    p: [["Make sure main is tested and up to date.", "main test করা ও হালনাগাদ নিশ্চিত করুন।"], ["Create: git tag -a v1.2.0 -m \"Release 1.2.0\".", "বানান: git tag -a v1.2.0 -m \"Release 1.2.0\"।"], ["Push: git push origin v1.2.0.", "Push করুন: git push origin v1.2.0।"], ["List and inspect: git tag -l \"v1.*\" and git show v1.2.0.", "তালিকা ও বিস্তারিত: git tag -l \"v1.*\" ও git show v1.2.0।"]],
    m: ["Forgetting to push tags; moving or deleting a published tag (others may have built from it); random names like 'final2' instead of versions.", "Tag push করতে ভুলে যাওয়া; প্রকাশিত tag সরানো বা মোছা (অন্যরা তা থেকে build করে থাকতে পারে); version-এর বদলে 'final2'-এর মতো এলোমেলো নাম।"],
    f: ["Pushing a tag often triggers a CI release pipeline that builds, signs and publishes packages or containers. Tags are the bridge between code and deployments.", "Tag push করলে প্রায়ই CI release pipeline চালু হয়, যা package বা container build, sign ও publish করে। Tag হলো code ও deployment-এর সেতু।"],
    x: [sh("Tag a release and push it · release tag ও push", `git tag -a v1.2.0 -m "Release 1.2.0: discount + cart"
git tag -l "v1.*"
git push origin v1.2.0
git show v1.2.0 --stat | head -6`, `v1.1.0
v1.2.0
 * [new tag]         v1.2.0 -> v1.2.0
tag v1.2.0
Tagger: Asha Rahman <asha@example.com>
Date:   Tue Nov 10 10:00:00 2026 +0600

Release 1.2.0: discount + cart`)],
  },
  "git rebase": {
    s: ["You wrote three pages of notes yesterday, but the teacher updated the first chapter today. Rebase is rewriting your three pages on top of the updated chapter, so your notes read as if you started today.", "গতকাল তিন পাতা নোট লিখেছেন, কিন্তু শিক্ষক আজ প্রথম অধ্যায় আপডেট করেছেন। Rebase হলো আপডেট হওয়া অধ্যায়ের উপর আপনার তিন পাতা আবার লেখা, যেন আজই শুরু করেছেন।"],
    t: ["git rebase main replays your branch's commits one by one on top of the latest main, creating new commits with new ids. The result is a straight, readable history. Because ids change, never rebase commits that others already pulled, unless the team agrees. Interactive rebase (-i) lets you squash, reorder or edit commits.", "git rebase main আপনার branch-এর commit একে একে সর্বশেষ main-এর উপর আবার চালায়, নতুন id-সহ নতুন commit বানায়। ফল সরল ও পড়ার মতো ইতিহাস। id বদলায় বলে অন্যরা pull করেছে এমন commit rebase করবেন না, দল একমত না হলে। Interactive rebase (-i) দিয়ে commit squash, ক্রম বদল বা সম্পাদনা করা যায়।"],
    p: [["Update: git fetch origin.", "আপডেট: git fetch origin।"], ["On your feature branch: git rebase origin/main.", "Feature branch-এ: git rebase origin/main।"], ["Resolve conflicts per commit, git add, git rebase --continue (or --abort).", "প্রতি commit-এ conflict মেটান, git add, git rebase --continue (বা --abort)।"], ["Push with git push --force-with-lease (your own branch only).", "git push --force-with-lease দিয়ে push করুন (শুধু নিজের branch)।"]],
    m: ["Rebasing main or another shared branch; using --force instead of --force-with-lease; panicking mid-rebase (git rebase --abort returns you to the start).", "main বা অন্য শেয়ার করা branch rebase; --force-with-lease-এর বদলে --force; rebase-এর মাঝে ঘাবড়ে যাওয়া (git rebase --abort শুরুতে ফেরায়)।"],
    f: ["git reflog keeps a safety record of where branches pointed, so even a bad rebase can be undone. Knowing reflog makes you calm and confident with history editing.", "git reflog branch কোথায় ছিল তার নিরাপত্তা-রেকর্ড রাখে, তাই খারাপ rebase-ও ফেরানো যায়। Reflog জানলে ইতিহাস সম্পাদনায় শান্ত ও আত্মবিশ্বাসী থাকবেন।"],
    x: [sh("Update a feature branch on latest main · সর্বশেষ main-এর উপর branch", `git switch feature/cart
git fetch origin
git rebase origin/main
git log --oneline --graph -3
git push --force-with-lease`, `Successfully rebased and updated refs/heads/feature/cart.
* 8a9b0c1 (HEAD -> feature/cart) feat: cart
* 9f8e7d6 (origin/main, main) fix: rounding in invoice total
* 5c4b3a2 docs: update setup steps
 + 2e3f4a5...8a9b0c1 feature/cart -> feature/cart (forced update)`)],
  },
  "git stash": {
    s: ["You are cooking when a guest arrives. You cover the half-made curry and put it aside, serve tea, then come back and continue. git stash covers your half-done work so you can switch tasks.", "রান্নার মাঝে অতিথি এলেন। অর্ধেক রাঁধা তরকারি ঢেকে সরিয়ে রাখেন, চা দেন, তারপর ফিরে এসে আবার শুরু করেন। git stash আপনার অর্ধেক কাজ ঢেকে রাখে যাতে কাজ বদলানো যায়।"],
    t: ["git stash saves uncommitted changes onto a stack and cleans your working folder. git stash pop brings the latest back and removes it from the stack; apply keeps it. Use -u to include untracked files and give stashes a message so you remember them.", "git stash commit না করা পরিবর্তন একটি stack-এ রেখে working folder পরিষ্কার করে। git stash pop সর্বশেষটি ফেরায় ও stack থেকে সরায়; apply রেখে দেয়। Untracked file নিতে -u দিন, আর মনে রাখতে stash-এ message দিন।"],
    p: [["Save: git stash push -u -m \"half-done cart page\".", "রাখুন: git stash push -u -m \"half-done cart page\"।"], ["Do the urgent work on another branch and commit it.", "জরুরি কাজ অন্য branch-এ করে commit করুন।"], ["Return and list: git stash list.", "ফিরে তালিকা দেখুন: git stash list।"], ["Restore: git stash pop.", "ফেরান: git stash pop।"]],
    m: ["Stashing many times without messages and forgetting what is inside; forgetting -u so new files are left behind; using stash as long-term storage instead of committing to a branch.", "Message ছাড়া অনেকবার stash করে ভিতরে কী আছে ভুলে যাওয়া; -u ভুলে নতুন file পিছনে পড়ে থাকা; branch-এ commit না করে stash-কে দীর্ঘমেয়াদি ভাণ্ডার বানানো।"],
    f: ["Stash is for minutes or hours. For anything longer, commit to a 'wip' branch; it is safer, visible, and backed up when pushed.", "Stash কয়েক মিনিট বা ঘণ্টার জন্য। এর বেশি হলে 'wip' branch-এ commit করুন; বেশি নিরাপদ, দৃশ্যমান, আর push করলে backup থাকে।"],
    x: [sh("Pause work for an urgent fix · জরুরি fix-এর জন্য কাজ থামানো", `git stash push -u -m "half-done cart page"
git stash list
git switch -c hotfix/login && echo fix >> Login.cs && git commit -qam "fix: login"
git switch feature/cart
git stash pop`, `Saved working directory and index state On feature/cart: half-done cart page
stash@{0}: On feature/cart: half-done cart page
Switched to a new branch 'hotfix/login'
Switched to branch 'feature/cart'
On branch feature/cart
Changes not staged for commit:
	modified:   Cart.cs
Dropped refs/stash@{0} (3d4e5f6...)`)],
  },
  "git reset": {
    s: ["Moving the bookmark in your book back a few pages. With --soft you keep your new notes in hand; with --mixed you keep notes but unpick them from the binder; with --hard you throw the notes away.", "বইয়ের bookmark কয়েক পাতা পিছনে সরানোর মতো। --soft-এ নতুন নোট হাতে থাকে; --mixed-এ নোট থাকে কিন্তু বাঁধাই থেকে খোলা; --hard-এ নোট ফেলে দেন।"],
    t: ["git reset moves the current branch to another commit. --soft keeps changes staged, --mixed (default) keeps changes unstaged, --hard deletes them from your folder. git reset file unstages a file without losing edits. Because it rewrites history, use it only on local commits not yet pushed.", "git reset বর্তমান branch-কে অন্য commit-এ সরায়। --soft পরিবর্তন staged রাখে, --mixed (default) unstaged রাখে, --hard folder থেকে মুছে দেয়। git reset file কোনো file unstage করে, সম্পাদনা না হারিয়ে। ইতিহাস বদলায় বলে শুধু push না করা local commit-এ ব্যবহার করুন।"],
    p: [["Undo the last local commit but keep work: git reset --soft HEAD~1.", "শেষ local commit বাতিল, কাজ রেখে: git reset --soft HEAD~1।"], ["Unstage a file: git reset Program.cs (or git restore --staged).", "File unstage: git reset Program.cs (বা git restore --staged)।"], ["Before --hard, check git status and git stash if unsure.", "--hard-এর আগে git status দেখুন, অনিশ্চিত হলে git stash করুন।"], ["If you made a mistake, find the old commit in git reflog and reset back.", "ভুল হলে git reflog-এ পুরনো commit খুঁজে reset করে ফিরুন।"]],
    m: ["git reset --hard with uncommitted work you needed; resetting commits already pushed and then force-pushing over teammates; confusing reset (moves branch) with revert (adds an undo commit).", "দরকারি commit না করা কাজসহ git reset --hard; push হওয়া commit reset করে সহকর্মীদের উপর force-push; reset (branch সরায়) ও revert (বাতিলের commit যোগ করে) গুলিয়ে ফেলা।"],
    f: ["When an AI agent makes a mess locally, git reset --hard to a known good commit (plus git clean -fd for new files) is the quickest clean slate. Just be sure nothing valuable is uncommitted.", "AI agent local-এ গোলমাল করলে ভালো জানা commit-এ git reset --hard (নতুন file-এর জন্য git clean -fd) দ্রুততম নতুন শুরু। শুধু নিশ্চিত হোন মূল্যবান কিছু commit ছাড়া নেই।"],
    x: [sh("Undo a commit but keep the changes · commit বাতিল, পরিবর্তন রেখে", `git log --oneline -2
git reset --soft HEAD~1
git status -s
git log --oneline -1
git reflog -3`, `5e6f7a8 (HEAD -> main) wip: wrong message
7c9e2d1 feat: add discount
M  Cart.cs
7c9e2d1 (HEAD -> main) feat: add discount
7c9e2d1 HEAD@{0}: reset: moving to HEAD~1
5e6f7a8 HEAD@{1}: commit: wip: wrong message
7c9e2d1 HEAD@{2}: commit: feat: add discount`)],
  },
  "git revert": {
    s: ["You published a newspaper with a wrong price. You cannot pull back printed copies, so tomorrow you print a correction. git revert adds a new commit that cancels an old one, without erasing history.", "ভুল দামসহ পত্রিকা ছাপিয়েছেন। ছাপা কপি ফেরানো যায় না, তাই পরদিন সংশোধনী ছাপেন। git revert একটি নতুন commit যোগ করে যা পুরনোটিকে বাতিল করে, ইতিহাস না মুছে।"],
    t: ["git revert <commit> computes the opposite of that commit's changes and commits it. It is safe on shared branches because it does not rewrite history. Reverting a merge commit needs -m 1 to say which parent is the main line.", "git revert <commit> সেই commit-এর পরিবর্তনের উল্টোটা হিসাব করে commit করে। শেয়ার করা branch-এ নিরাপদ, কারণ ইতিহাস বদলায় না। Merge commit revert করতে কোন parent মূল লাইন তা বলতে -m 1 লাগে।"],
    p: [["Find the bad commit: git log --oneline.", "খারাপ commit খুঁজুন: git log --oneline।"], ["Run git revert <hash> and keep or edit the message.", "git revert <hash> চালিয়ে message রাখুন বা সম্পাদনা করুন।"], ["Run tests; resolve conflicts if later commits touched the same lines.", "Test চালান; পরের commit একই লাইন ছুঁলে conflict মেটান।"], ["Push and deploy the fix.", "Push করে fix deploy করুন।"]],
    m: ["Using reset on main after pushing instead of revert; reverting a merge without -m; reverting and forgetting the original feature must be re-applied later (revert the revert).", "Push-এর পরে main-এ revert-এর বদলে reset; -m ছাড়া merge revert; revert করে ভুলে যাওয়া যে পরে মূল feature আবার আনতে হবে (revert-এর revert)।"],
    f: ["In production incidents, 'revert first, investigate later' is a common, fast rollback. Feature flags are another option: turn the feature off without a deploy.", "Production সমস্যায় 'আগে revert, পরে তদন্ত' একটি প্রচলিত দ্রুত rollback। আরেকটি উপায় feature flag: deploy ছাড়াই feature বন্ধ করা।"],
    x: [sh("Safely undo a pushed commit · push হওয়া commit নিরাপদে বাতিল", `git log --oneline -3
git revert --no-edit 4b1f0a3
git log --oneline -2
git push`, `7c9e2d1 feat: add discount
4b1f0a3 fix: retry payment 3 times
1a2b3c4 Initial commit
[main 6d5c4b3] Revert "fix: retry payment 3 times"
 1 file changed, 2 insertions(+), 6 deletions(-)
6d5c4b3 (HEAD -> main) Revert "fix: retry payment 3 times"
7c9e2d1 feat: add discount
   7c9e2d1..6d5c4b3  main -> main`)],
  },
  "git cherry-pick": {
    s: ["Picking one ripe mango from a neighbour's tree (with permission) instead of moving the whole tree. cherry-pick copies one specific commit from another branch onto yours.", "পুরো গাছ না সরিয়ে (অনুমতি নিয়ে) প্রতিবেশীর গাছ থেকে একটি পাকা আম পাড়ার মতো। cherry-pick অন্য branch থেকে একটি নির্দিষ্ট commit আপনার branch-এ কপি করে।"],
    t: ["git cherry-pick <hash> applies the changes of that commit as a new commit on the current branch. It is useful for bringing a bug fix from main to a release branch. The new commit has a different id; -x adds a note pointing to the original.", "git cherry-pick <hash> সেই commit-এর পরিবর্তন বর্তমান branch-এ নতুন commit হিসেবে প্রয়োগ করে। main থেকে release branch-এ bug fix আনতে কাজের। নতুন commit-এর id ভিন্ন; -x মূল commit-এর উল্লেখ যোগ করে।"],
    p: [["Find the fix commit: git log --oneline main.", "Fix commit খুঁজুন: git log --oneline main।"], ["Switch to the target: git switch release/1.2.", "লক্ষ্যে যান: git switch release/1.2।"], ["Apply: git cherry-pick -x <hash>.", "প্রয়োগ: git cherry-pick -x <hash>।"], ["Resolve conflicts, test, push, and tag a patch release.", "Conflict মেটান, test করুন, push করে patch release tag দিন।"]],
    m: ["Cherry-picking many commits instead of merging a branch; picking a commit that depends on earlier commits that are not there; forgetting -x so nobody knows where it came from.", "Branch merge না করে অনেক commit cherry-pick; এমন commit বাছা যা অনুপস্থিত আগের commit-এর উপর নির্ভর করে; -x ভুলে যাওয়ায় কেউ জানে না কোথা থেকে এল।"],
    f: ["Hotfixes to supported versions are still common in enterprise software. Cherry-pick with -x plus a tag gives an auditable trail from bug report to patched release.", "Enterprise software-এ সমর্থিত version-এ hotfix এখনো প্রচলিত। -x-সহ cherry-pick ও একটি tag bug report থেকে patch release পর্যন্ত যাচাইযোগ্য চিহ্ন রাখে।"],
    x: [sh("Back-port a fix to a release branch · release branch-এ fix আনা", `git switch release/1.2
git cherry-pick -x 9f8e7d6
git log -1 --format='%h %s%n%b'
git tag -a v1.2.1 -m "Patch: invoice rounding"`, `[release/1.2 0a1b2c3] fix: rounding in invoice total
 1 file changed, 1 insertion(+), 1 deletion(-)
0a1b2c3 fix: rounding in invoice total
(cherry picked from commit 9f8e7d6...)`)],
  },
};
