const entries = {};
function put(id, en, bn, a, b, decisionEn, decisionBn) {
  entries[id] = {
    en,
    bn,
    decisionEn,
    decisionBn,
    examples: [
      {
        title: "Practical workflow · বাস্তব কাজের ধারা",
        language: "bash",
        code: a,
      },
      {
        title: "Inspect, verify, and recover · যাচাই ও সমস্যা সমাধান",
        language: "bash",
        code: b,
      },
    ],
  };
}
put(
  "0-0",
  "Initialization creates the repository metadata and an unborn branch. No tracked files, remote, or saved revision exists yet. The first commit gives the branch its first actual commit. You can initialize an existing source folder; Git does not erase the application. Ignore generated files before staging so your first snapshot contains source rather than build output.",
  "Init করলে .git-এর ভিতর ইতিহাস রাখার ব্যবস্থা হয়, কিন্তু তখনো commit নেই। পুরোনো project folder-এও init করা যায়; ফাইল মোছে না। প্রথমে কোন ফাইল বাদ দেবেন লিখুন, তারপর source stage করে প্রথম snapshot রাখুন।",
  `mkdir mastery-demo
cd mastery-demo
git init --initial-branch=main
printf 'bin/\nobj/\n' > .gitignore
printf 'Hello\n' > README.md
git add .gitignore README.md
git commit -m "Create project baseline"`,
  `git rev-parse --show-toplevel
git status --short
git log --oneline
git config --local user.name
git config --local user.email`,
  "If the first commit refuses an unknown identity, configure user.name and user.email for this repository. These are commit metadata, not GitHub login credentials. Avoid initializing a nested repository accidentally.",
  "Commit-এর নাম ও email ইতিহাসের পরিচয়, GitHub-এর login নয়। ভুল করে project-এর ভিতর আরেকটি repository বানালে আগে root path দেখুন।",
);
put(
  "0-1",
  "A clone receives objects and references from a remote, creates remote-tracking branches, and normally checks out the default branch. The new origin name is simply a local nickname for the source URL. A shallow clone saves history transfer but can limit merge-base calculations, blame, and version tooling. A fork is a hosting-side copy and is different from a local clone.",
  "Clone-এ ফাইলের সাথে commit-এর ইতিহাস ও branch-এর খবর আসে। origin হলো source URL-এর local ডাকনাম। Shallow clone-এ কম ইতিহাস আসে, তাই পুরোনো পরিবর্তন খোঁজা বা কিছু merge-এর কাজ সীমিত হতে পারে। Fork আর clone এক নয়।",
  `git clone https://github.com/dotnet/samples.git
cd samples
git remote -v
git branch -a
git log -5 --oneline`,
  `git clone --depth 1 https://github.com/dotnet/samples.git samples-shallow
cd samples-shallow
git rev-parse --is-shallow-repository
git fetch --unshallow
git log -5 --oneline`,
  "Choose a full clone for history investigation and a shallow clone for disposable CI work when tooling supports it. A clone never grants permission to push to the source repository.",
  "ইতিহাস নিয়ে কাজ করতে full clone নিন। CI-তে দরকার বুঝে shallow clone। Clone করতে পারা মানেই মূল repository-তে push করার অধিকার নয়।",
);
put(
  "0-2",
  "Status reports differences between three states: HEAD, the index, and the working directory. In short format the first column describes the index and the second describes the working tree. A file can be both staged and modified because the staged snapshot is older than its newest edit. Ignored files are hidden by default, while untracked files have never entered history.",
  "Status-এর দুই ঘর আলাদা: প্রথমটি staging-এর পরিবর্তন, দ্বিতীয়টি working tree-এর। একই file stage করার পরে আবার edit করলে দুই দিকেই পরিবর্তন থাকতে পারে। Ignored file লুকানো থাকে; untracked file এখনো ইতিহাসে ঢোকেনি।",
  `git status
printf 'first edit\n' >> README.md
git add README.md
printf 'second edit\n' >> README.md
git status --short`,
  `git diff -- README.md
git diff --staged -- README.md
git status --ignored --short
git check-ignore -v bin/output.dll`,
  "Use status before switching branches, committing, or resetting. The two diffs explain exactly which version would be committed and which edits would remain outside that commit.",
  "Commit বা reset-এর আগে status দেখুন। দুই ধরনের diff মেলালে কোন লেখা commit-এ যাবে আর কোনটি হাতে থাকবে তা পরিষ্কার হবে।",
);
put(
  "0-3",
  "The index stores the contents selected for the next snapshot, not a live pointer to your file. Adding a file again updates its staged contents. Interactive patch staging lets one physical file contribute to multiple logical commits. Paths after -- are treated as filenames, which avoids ambiguity with names that resemble options or revisions.",
  "Stage করার সময়কার লেখা index-এ থাকে; file-এর পরের edit নিজে থেকে ঢোকে না। একই file-এর আলাদা অংশ আলাদা commit-এ দিতে patch staging কাজে লাগে। -- দিলে পরের অংশকে file path হিসেবে ধরা হয়।",
  `git diff -- Program.cs
git add -- Program.cs
git diff --staged -- Program.cs
git status --short
git commit -m "Implement greeting"`,
  `git add -p -- Program.cs
git diff --staged
git restore --staged -- Program.cs
git status --short
git diff -- Program.cs`,
  "Unstaging with restore --staged changes the index but preserves the working file. Review staged data for secrets, generated output, and unrelated formatting before committing.",
  "Unstage করলে হাতে লেখা file থাকে, শুধু commit-এর তালিকা থেকে সরে। Secret বা অপ্রাসঙ্গিক পরিবর্তন জমা দিচ্ছেন কি না staged diff-এ দেখুন।",
);
put(
  "0-4",
  "A commit records a tree, parent commit references, author/committer information, and a message. Its identifier depends on its content and metadata. Commit messages should explain intent and the boundary of a change. Amending creates a replacement commit with a new identifier; it does not edit an existing immutable object in place.",
  "Commit-এ file-এর snapshot, আগের commit-এর link, পরিচয় ও বার্তা থাকে। বার্তায় কেন পরিবর্তনটি করেছেন লিখুন। Amend পুরোনো object সম্পাদনা করে না; নতুন পরিচয়ের replacement commit বানায়।",
  `git status --short
git add -- Program.cs
git diff --staged
git commit -m "Validate order quantity before saving"
git show --stat HEAD`,
  `git log -1 --format=fuller
git show HEAD -- Program.cs
git commit --amend --no-edit
git log -1 --oneline
git reflog -3`,
  "Amend an unpublished local change when correcting that same logical change. Rewriting a commit already used by teammates needs coordination because their histories still refer to the old identifier.",
  "নিজের unpublished commit ঠিক করতে amend সুবিধাজনক। দলের লোক ব্যবহার করে ফেললে hash বদলানো তাদের history-এর সাথে সংঘর্ষ করতে পারে।",
);
put(
  "0-5",
  "History is a graph, not merely a chronological list. Merge commits have multiple parents, and branch names can point into different parts of the graph. Path-limited history answers a narrower question than all-history output. Relative dates are convenient, but exact dates and full identifiers are better for incident evidence.",
  "ইতিহাস শুধু তারিখের তালিকা নয়, parent link-এর graph। Merge-এ একাধিক parent থাকে। একটি file-এর history আর পুরো project-এর history ভিন্ন প্রশ্নের উত্তর দেয়। Incident তদন্তে পূর্ণ hash ও সঠিক সময় রাখুন।",
  `git log --oneline --graph --decorate --all
git log -5 --format='%h %ad %s' --date=iso-strict
git log --author='Ayesha' --all
git log --since='2026-01-01' -- README.md`,
  `git show --format=fuller --stat HEAD
git log --follow -- README.md
git log --first-parent --oneline main
git reflog --date=iso -10`,
  "Use log for reachable committed history and reflog for recent local reference movement. Reflogs are local and expire; they are not a permanent backup of every deleted commit.",
  "Commit-এর graph দেখতে log, local branch কোথায় সরেছে দেখতে reflog। Reflog local ও মেয়াদযুক্ত, স্থায়ী backup নয়।",
);
put(
  "0-6",
  "A diff describes a transformation between two versions. Added and removed lines are evidence of text changes, not a complete explanation of behavioral effects. You can compare the working tree to the index, index to HEAD, two commits, or a branch against its merge base. Whitespace and rename detection settings change how a diff is presented.",
  "Diff দুই সংস্করণের পার্থক্য দেখায়। লাল-সবুজ লাইন দেখেই আচরণ ঠিক হয়েছে বলা যায় না। Working tree, staging, commit ও branch—কোন দুটির তুলনা করছেন তা আগে ঠিক করুন।",
  `git diff
git diff --staged
git diff HEAD -- Program.cs
git diff --stat main...feature/orders`,
  `git diff --check
git diff --word-diff -- README.md
git diff --name-status HEAD~1 HEAD
git show HEAD -- Program.cs`,
  "Three dots on git diff compare the merge base to the second revision; two explicit revisions compare their end states. Read the command meaning before drawing review conclusions.",
  "Diff-এর three-dot ও two-endpoint তুলনা এক নয়। Review-এ ভুল branch boundary ধরলে অপ্রাসঙ্গিক পরিবর্তন দেখাতে পারে।",
);
put(
  "0-7",
  "Push requests updates to remote references after transferring required objects. A normal branch push must be a fast-forward unless the server and command explicitly allow history replacement. Upstream tracking simplifies later push and pull commands but does not establish ownership or bypass branch protection. Tags are separate references with their own publication policy.",
  "Push আগে object পাঠায়, তারপর remote branch সরানোর অনুরোধ করে। সাধারণত অন্যের commit মুছে যায় এমন update প্রত্যাখ্যান হয়। Upstream শুধু default গন্তব্য সহজ করে; branch protection বা permission বদলায় না।",
  `git remote -v
git status --short
git fetch origin
git push --dry-run origin HEAD
git push -u origin feature/orders`,
  `git log --oneline --left-right HEAD...origin/feature/orders
git branch -vv
git push origin v1.0.0
git ls-remote --heads origin`,
  "Prefer normal pushes on shared branches. If rewriting your own reviewed branch is necessary, --force-with-lease is safer than unconditional --force, but it still requires understanding whose work may be replaced.",
  "Shared branch-এ স্বাভাবিক push করুন। Rewrite দরকার হলে lease অন্যের অদেখা কাজ কাটার ঝুঁকি কমায়, কিন্তু অনুমতি ও সমন্বয়ের বিকল্প নয়।",
);
put(
  "0-8",
  "Pull is fetch plus integration into the current branch. Integration can merge, rebase, or refuse divergence with --ff-only. A clean working tree makes conflicts easier to understand. Pulling the wrong remote branch into the current feature branch changes that feature history; the remote name in the command is not a request to switch branches.",
  "Pull হলো fetch-এর পরে বর্তমান branch-এ কাজ মেলানো। Merge, rebase বা শুধু fast-forward—নীতি বাছুন। কমান্ডে main লেখা মানে main-এ switch করা নয়; আপনি যে branch-এ আছেন সেখানেই মেশে।",
  `git switch main
git status --short
git fetch origin
git log --oneline --left-right main...origin/main
git pull --ff-only origin main`,
  `git switch feature/orders
git pull --rebase origin feature/orders
git status
git rebase --abort`,
  "Use --ff-only when automated updates should never create an implicit merge. Use rebase only when replaying your local work is consistent with the team history policy.",
  "Automation-এ অজান্তে merge না চাইলে --ff-only। দলের history policy বুঝে তবেই rebase দিয়ে local কাজ আবার বসান।",
);
put(
  "0-9",
  "Fetch updates remote-tracking references while preserving your checked-out branch and working files. That separation is useful before reviewing incoming changes or deciding a merge strategy. Remote-tracking names are local observations, not live network queries. Deleted remote branches may leave stale tracking refs unless you prune them.",
  "Fetch নতুন ইতিহাস এনে origin/main-এর মতো local খবর আপডেট করে, নিজের branch বা file মেশায় না। Origin/main সবসময় live remote নয়, শেষ fetch-এর খবর। Remote-এ মোছা branch-এর পুরোনো tracking নাম prune করতে হয়।",
  `git fetch origin
git log --oneline HEAD..origin/main
git diff HEAD origin/main --stat
git branch -r
git remote show origin`,
  `git fetch --prune origin
git remote prune origin --dry-run
git for-each-ref refs/remotes --format='%(refname:short)'
git ls-remote --heads origin`,
  "Fetch before an informed merge, rebase, or comparison. Pruning removes stale remote-tracking refs, not your local feature branches or their working files.",
  "Merge বা rebase-এর সিদ্ধান্তের আগে fetch করুন। Prune পুরোনো tracking নাম সরায়; local feature branch নিজে মোছে না।",
);
put(
  "0-10",
  "A branch is a small reference, so creating one is inexpensive and does not copy the entire project directory. Branch tips move when commits are created on them. Deleting a branch removes its name rather than immediately erasing all its commits; reachability from other references determines whether objects remain available.",
  "Branch পুরো folder-এর copy নয়, একটি commit-এর দিকে থাকা ছোট নাম। সেই branch-এ commit হলে নামের অবস্থান এগোয়। Branch মোছা আর সব commit সঙ্গে সঙ্গে মুছে যাওয়া এক নয়।",
  `git branch feature/catalog
git branch --show-current
git switch feature/catalog
git branch -vv
git log -1 --oneline`,
  `git switch main
git branch --merged main
git branch -d feature/catalog
git branch --no-merged main`,
  "Use -d for a checked merge safety condition and understand what -D overrides. Do not delete the only useful reference to unfinished work without a recovery plan.",
  "-d কিছু merge safety দেখে; -D তা অগ্রাহ্য করে। অসমাপ্ত কাজের একমাত্র নাম মুছলে পরে খুঁজতে সমস্যা হতে পারে।",
);
put(
  "0-11",
  "Switch has a focused purpose: change branches. Creating and switching in one operation avoids forgetting which branch receives the next commit. If no local branch exists, Git may infer one from a matching remote-tracking branch. Detached mode deliberately checks out a revision without attaching new commits to an ordinary branch name.",
  "Switch মূলত branch বদলায়। -c দিয়ে বানিয়ে সঙ্গে সঙ্গে সেখানে যান, যাতে পরের commit ভুল branch-এ না হয়। Detached mode-এ revision দেখা যায়, কিন্তু নতুন কাজ রাখতে branch নাম বানানো ভালো।",
  `git status --short
git switch -c feature/search
git branch --show-current
git status -sb`,
  `git switch -
git switch --detach HEAD~1
git log -1 --oneline
git switch -c investigation/snapshot`,
  "Treat a blocked switch as a signal to commit or stash intentionally, not a reason to discard edits. A branch created during detached investigation preserves the new work under a stable name.",
  "Switch আটকে গেলে কাজ commit বা stash করবেন কি না ঠিক করুন; অন্ধভাবে discard নয়। Detached অবস্থার নতুন কাজের জন্য branch বানান।",
);
put(
  "0-12",
  "Checkout historically combines branch switching and file restoration, so its meaning depends on arguments. A -- path separator is especially important when a name could be interpreted as either a branch or a file. Modern switch and restore commands make intent clearer, while checkout remains common in existing scripts and tutorials.",
  "Checkout branch বদলানো ও file ফেরানো দুই কাজেই ব্যবহৃত হয়। Argument অনুযায়ী অর্থ বদলায়, তাই -- দিয়ে file path আলাদা করুন। নতুন switch ও restore পড়তে বেশি পরিষ্কার হতে পারে।",
  `git checkout -b feature/legacy-flow
git branch --show-current
git status --short
git log -1 --oneline`,
  `git diff -- Program.cs
git checkout HEAD -- Program.cs
git diff -- Program.cs
git status --short`,
  "Restoring a path from HEAD replaces working content and stages the selected version with this checkout form. Review the diff first; use restore with explicit source/staged/worktree flags when clarity matters.",
  "HEAD থেকে file checkout করলে হাতে edit হারাতে পারে। আগে diff দেখুন; source, index ও worktree স্পষ্ট করতে restore-এর flag ব্যবহার করুন।",
);
put(
  "0-13",
  "Merging finds a common ancestor and combines both lines of development. If one tip is an ancestor of the other, a fast-forward may only move a reference. Otherwise Git typically creates a merge commit. Conflicts mark places requiring human judgment; choosing every incoming or current line blindly can preserve syntax while breaking business behavior.",
  "Merge দুই history-র মিলের পুরোনো commit খুঁজে পরিবর্তন মেলায়। এক branch সোজা এগিয়ে থাকলে fast-forward হয়, নইলে merge commit লাগতে পারে। Conflict মানুষের সিদ্ধান্ত চায়; শুধু সব এক দিক নেওয়া সঠিক সমাধান নয়।",
  `git switch main
git fetch origin
git merge --ff-only origin/main
git merge --no-ff feature/orders
git log --graph --oneline -8`,
  `git status
git diff --name-only --diff-filter=U
# Resolve marked sections, then run application tests.
git add -- Program.cs
git merge --continue
# If abandoning instead: git merge --abort`,
  "Use a merge commit when preserving integration structure matters. Run relevant tests after conflict resolution because Git can merge text automatically without understanding the program.",
  "দুই কাজ কীভাবে মিলল তার রেকর্ড দরকারে merge commit রাখুন। Text merge সফল হলেও program ঠিক কি না test করুন।",
);
put(
  "0-14",
  "A lightweight tag is a name for an object; an annotated tag stores a separate tag object with a message and identity. Tags usually label releases and should be treated as immutable once consumers depend on them. Creating a tag locally and distributing it are separate operations. A tag does not start a build unless hosting automation is configured to react to it.",
  "Lightweight tag শুধু নাম; annotated tag-এ বার্তা ও পরিচয়ও থাকে। প্রকাশিত release tag বদলালে অন্যের build বিভ্রান্ত হয়। Local tag বানানো, remote-এ পাঠানো ও automation চালা আলাদা বিষয়।",
  `git tag -a v1.1.0 -m "Release order validation"
git show v1.1.0 --stat
git tag --list 'v1.*'
git push origin v1.1.0`,
  `git ls-remote --tags origin
git describe --tags --always
git tag --points-at HEAD
git log -1 --format='%H' v1.1.0`,
  "Choose annotated or signed release tags when provenance matters. A signature only proves a key signed the object; it does not prove tests passed or the code is secure.",
  "পরিচয় দরকারে annotated বা signed tag ব্যবহার করুন। Signature মানে key দিয়ে সই, code নিরাপদ বা test পাস তার প্রমাণ নয়।",
);
put(
  "0-15",
  "Rebase selects commits not already on the new base and replays their changes in order. New parents mean new commit identifiers. Conflicts are resolved one replayed commit at a time, so the same file may need attention more than once. Rebase improves a chosen history shape but cannot retroactively remove coordination costs from already shared work.",
  "Rebase নিজের commit-এর পরিবর্তন নতুন base-এর উপর একে একে আবার বসায়। Parent বদলে hash বদলে যায়। একাধিক commit-এ একই file বদলালে বারবার conflict আসতে পারে। Shared কাজ rewrite করলে সমন্বয় জরুরি।",
  `git switch feature/orders
git fetch origin
git rebase origin/main
git log --graph --oneline -8
git diff origin/main...HEAD --stat`,
  `git status
# Edit conflicts in the current replayed commit.
git add -- Program.cs
git rebase --continue
# To cancel the entire replay: git rebase --abort
git reflog -8`,
  "Use interactive rebase for local cleanup when each resulting commit remains coherent. --skip drops the current patch; it is not a generic conflict-resolution button.",
  "Local commit গুছাতে interactive rebase করুন। --skip বর্তমান patch বাদ দেয়; যেকোনো conflict-এর সহজ সমাধান হিসেবে ব্যবহার করবেন না।",
);
put(
  "0-16",
  "A stash records temporary index/working-tree state. Applying keeps the stash entry; popping applies then removes it on success. Stash entries live in the local repository, so they are not a collaboration channel or remote backup. Including untracked or ignored files requires explicit flags with different scope.",
  "Stash অসমাপ্ত কাজ সাময়িক localভাবে রাখে। Apply করলে entry থাকে, pop সফল হলে সরে। এটি remote backup বা অন্যকে কাজ দেওয়ার মাধ্যম নয়। Untracked ও ignored file নেওয়ার flag আলাদা।",
  `git stash push -u -m "Pause checkout work"
git stash list
git switch main
git status --short
git switch feature/orders`,
  `git stash show --stat 'stash@{0}'
git stash show -p 'stash@{0}'
git stash apply 'stash@{0}'
git status --short
# Drop only after confirming the recovered work.
git stash drop 'stash@{0}'`,
  "Prefer apply followed by verification when losing the stash name would be inconvenient. Applying against a changed base can conflict; resolve the recovered work before deleting the safety copy.",
  "নিরাপত্তার জন্য apply করে কাজ মিলিয়ে তারপর drop করুন। Base বদলালে stash-এর কাজ মেলাতেও conflict হতে পারে।",
);
put(
  "0-17",
  "Reset can move the current branch tip and optionally replace index and working-tree state. Soft resets the reference only; mixed also resets the index; hard also replaces tracked worktree content. Resetting an unpushed commit is fundamentally different from publishing a rewritten shared branch. File-path reset forms operate on the index rather than moving the branch.",
  "Soft-এ branch সরে, staged কাজ থাকে। Mixed-এ staging-ও পুরোনো হয়, হাতে edit থাকে। Hard tracked file-ও বদলে দেয়। Unpublished commit গুছানো আর দলের প্রকাশিত branch rewrite করা আলাদা।",
  `git log -2 --oneline
git status --short
git reset --soft HEAD~1
git diff --staged --stat
git commit -m "Replace the last local change coherently"`,
  `git reflog -5
git status --short
git diff --staged
git diff
# Preserve a known commit before further history changes.
git branch recovery/checkpoint HEAD`,
  "Use revert for a published inverse change when history should stay intact. Do not reach for reset --hard as a generic fix for conflicts or a dirty working tree.",
  "প্রকাশিত ভুলের নতুন inverse commit চাইলে revert। Conflict বা নোংরা worktree দেখেই hard reset করবেন না।",
);
put(
  "0-18",
  "Revert computes the inverse patch of an existing commit and records that inverse as new history. Later commits can overlap with the same lines, so reverting can conflict. Reverting a merge also affects how later merges see that history; it is more than deleting a visible merge bubble. You can inspect an inverse patch before committing it.",
  "Revert আগের পরিবর্তনের বিপরীত patch দিয়ে নতুন commit বানায়। পরে একই line বদলালে conflict হতে পারে। Merge revert ভবিষ্যতের merge-এর আচরণেও প্রভাব ফেলে, শুধু একটি bubble মোছা নয়।",
  `git log --oneline -5
git revert --no-commit HEAD
git diff --staged
git status --short
git commit -m "Revert the faulty validation change"`,
  `git status
# After resolving an in-progress revert conflict:
git add -- Program.cs
git revert --continue
# To abandon an in-progress revert: git revert --abort
git log -3 --oneline`,
  "Choose revert when auditability and shared history matter. A later revert of the revert is another new change, and application/data side effects may need separate repair.",
  "Shared history ও audit দরকারে revert করুন। Code ফেরালেও বাইরে পাঠানো email বা database data আলাদা মেরামত লাগতে পারে।",
);
put(
  "0-19",
  "Cherry-pick extracts the change from one commit and applies it on the current branch. The new commit usually has a different parent and identifier. It is useful for small backports and hotfixes, but repeated cross-branch picks can make later integration harder. Check whether a selected patch depends on earlier commits before treating it as independent.",
  "একটি commit-এর patch বর্তমান branch-এ বসিয়ে নতুন commit বানায় cherry-pick। ছোট hotfix backport-এ সুবিধা, কিন্তু একই patch বারবার তুললে history বোঝা কঠিন হয়। আগের commit-এর উপর dependency আছে কি না দেখুন।",
  `git switch release/1.x
git show --stat a1b2c3d
# Replace the illustrative hash with a real commit.
git cherry-pick -x a1b2c3d
git show --stat HEAD`,
  `git status
# Resolve conflicts in the target branch context.
git add -- Program.cs
git cherry-pick --continue
# To abandon: git cherry-pick --abort
git log -3 --oneline`,
  "The -x trailer records the source commit for traceability. A successful textual application still needs tests against the older release dependencies and behavior.",
  "-x দিয়ে মূল commit-এর পরিচয় বার্তায় থাকে। পুরোনো release-এ patch বসেছে মানেই তার dependency ও আচরণ ঠিক, এমন নয়—test করুন।",
);
put(
  "1-0",
  "Long listings expose file type, permission bits, link count, owner, group, size, and modification time. A leading d means directory; a leading l means symbolic link. Hidden names begin with a dot. The displayed total reflects allocated blocks, not simply the sum of the printed logical byte sizes. Sorting by time helps find recently changed deployment files.",
  "ls -l-এর প্রতিটি ঘরের মানে আলাদা: ধরন, অনুমতি, মালিক, group, মাপ ও সময়। d directory, l link। Dot দিয়ে শুরু নাম লুকানো। তালিকার total আর file-এর logical byte-এর যোগ এক নাও হতে পারে।",
  `pwd
ls -la
ls -lah /tmp
ls -lt
ls -ld . ..`,
  `ls -l -- README.md
ls -l --time-style=long-iso
ls -la --color=never
stat README.md`,
  "Use ls -ld to inspect a directory itself rather than its contents. Do not parse ls output in automation when filenames may contain whitespace or newlines; use find with null-delimited output.",
  "Folder-এর নিজের permission দেখতে -ld। Script-এ filename-এর space বা newline থাকলে ls output parse না করে null-delimited find ব্যবহার করুন।",
);
put(
  "1-1",
  "The shell maintains its own current directory. Absolute paths begin at /; relative paths start from that directory. .. selects a parent, . means the current directory, and ~ is expanded by the shell. A path with spaces needs quotes. Changing directories does not alter a different process’s working directory.",
  "প্রতিটি shell-এর নিজের বর্তমান folder থাকে। / থেকে শুরু absolute, বর্তমান স্থান থেকে relative path। .. আগের ঘর, . বর্তমান ঘর। Space থাকলে quote দিন; অন্য terminal-এর folder এতে বদলায় না।",
  `pwd
mkdir -p /tmp/mastery-paths/one/two
cd /tmp/mastery-paths/one
pwd
cd two
cd ..`,
  `cd /tmp/mastery-paths
cd 'one/two'
cd -
pwd
cd /does-not-exist || printf 'Directory unavailable\n'`,
  "Use explicit working directories in scripts. A failed cd followed by a destructive relative command can target the wrong folder unless failure handling stops the script.",
  "Script-এ cd ব্যর্থ হলে পরের relative command ভুল folder-এ চলতে পারে। ব্যর্থতা সামলে তারপর পরের কাজ করুন।",
);
put(
  "1-2",
  "pwd prints an absolute representation of the shell’s location. Logical mode can preserve symbolic-link names, while physical mode resolves the actual directory chain. The difference matters when release paths are symlinked, such as current pointing to releases/2026-11. Record the real path when investigating which deployed files a process is using.",
  "Logical path-এ symbolic link-এর নাম থাকতে পারে, physical path আসল folder দেখায়। current link কোনো release-এ গেলে দুই ঠিকানা আলাদা হতে পারে। Deployment তদন্তে কোন আসল folder ব্যবহার হচ্ছে লিখে রাখুন।",
  `mkdir -p /tmp/mastery-pwd/releases/v1
ln -s /tmp/mastery-pwd/releases/v1 /tmp/mastery-pwd/current
cd /tmp/mastery-pwd/current
pwd -L
pwd -P`,
  `printf '%s\n' "$PWD"
realpath .
ls -ld /tmp/mastery-pwd/current
readlink /tmp/mastery-pwd/current`,
  "A script should deliberately choose logical or physical paths when constructing related filenames. Checking the path is evidence; it does not grant permission to read protected directories.",
  "Related filename বানানোর সময় logical না physical path দরকার, তা বাছুন। ঠিকানা জানা মানেই তার file পড়ার permission নয়।",
);
put(
  "1-3",
  "The -p option creates missing parents and succeeds when a requested directory already exists. Permissions are affected by the process umask unless a specific mode is requested. Concurrent creation of the same directory is normally safe with -p, but a file occupying a path component prevents the directory tree from being created.",
  "-p মাঝের folder না থাকলে বানায়, আগে থাকলেও সাধারণত error নয়। Permission-এ umask প্রভাব ফেলে। পথের কোনো অংশে folder-এর বদলে file থাকলে তৈরি হবে না।",
  `mkdir -p /tmp/mastery-tree/src/api
mkdir -p /tmp/mastery-tree/tests
mkdir -p /tmp/mastery-tree/src/api
find /tmp/mastery-tree -type d`,
  `umask
mkdir -m 700 /tmp/mastery-private-example
ls -ld /tmp/mastery-private-example
# Remove the empty private demo when finished.
rmdir /tmp/mastery-private-example`,
  "Use private modes for temporary credential material, but never use filesystem mode as a substitute for proper secret handling. Check ownership and the parent-directory execute permission when creation fails.",
  "Private file-এর জন্য সীমিত mode রাখুন। Folder বানাতে না পারলে parent-এর ownership ও execute permission-ও দেখুন।",
);
put(
  "1-4",
  "Recursive removal traverses directories and unlinks entries. Force suppresses certain prompts and missing-path errors; it does not undo permission restrictions or provide a recycle bin. Shell expansion happens before rm sees the paths. Quoting, absolute paths, and a verified temporary root are essential when demonstrating deletion.",
  "Recursive removal ভিতরের file-সহ সরায়, recycle bin-এ দেয় না। -f কিছু prompt ও missing-file error কমায়, permission কাটায় না। Shell আগে argument তৈরি করে, তাই path ও quote সঠিক হওয়া জরুরি।",
  `demo_dir=$(mktemp -d /tmp/mastery-delete.XXXXXX)
mkdir -p "$demo_dir/nested"
printf 'disposable\n' > "$demo_dir/nested/example.txt"
find "$demo_dir" -maxdepth 2 -print
rm -r -- "$demo_dir"
test ! -e "$demo_dir" && printf 'Demo removed\n'`,
  `demo_dir=$(mktemp -d /tmp/mastery-force.XXXXXX)
printf 'demo\n' > "$demo_dir/file.txt"
printf 'Will remove: %s\n' "$demo_dir"
rm -rf -- "$demo_dir"
# Never substitute a production path into this lesson.`,
  "Use rm -i interactively when a prompt is useful. In automation, enforce a validated allowlisted deletion root rather than trusting an arbitrary user-provided path.",
  "শেখার জন্য শুধু disposable folder। Automation-এ user-এর যেকোনো path নিয়ে delete না করে নির্দিষ্ট অনুমোদিত root যাচাই করুন।",
);
put(
  "1-5",
  "Recursive copying walks a source tree and writes new entries at the destination. Whether the destination already exists changes the resulting nesting. Metadata-preserving archival copying and ordinary recursive copying serve different needs. Symbolic links, ownership, sparse files, and timestamps require deliberate policy for backups or releases.",
  "Source folder আর destination আগে আছে কি না, তার উপর copy-র ভেতরের nesting বদলায়। শুধু file copy আর metadata-সহ archive copy আলাদা। Backup-এ link, owner, সময় ও permission রাখবেন কি না ঠিক করুন।",
  `mkdir -p /tmp/mastery-copy/src
printf 'hello\n' > /tmp/mastery-copy/src/readme.txt
cp -r /tmp/mastery-copy/src /tmp/mastery-copy/backup
find /tmp/mastery-copy -type f
cmp /tmp/mastery-copy/src/readme.txt /tmp/mastery-copy/backup/readme.txt`,
  `cp -a /tmp/mastery-copy/src /tmp/mastery-copy/archive
ls -l /tmp/mastery-copy/archive
stat /tmp/mastery-copy/src/readme.txt
stat /tmp/mastery-copy/archive/readme.txt`,
  "A filesystem copy alone is not an application-consistent database backup. Verify restored data, permissions, and integrity instead of assuming that command success proves a usable recovery point.",
  "Database চলার সময় folder copy-ই consistent backup নয়। Restore করে data ও permission ঠিক আছে কি না পরীক্ষা করুন।",
);
put(
  "1-6",
  "Moving within one filesystem usually renames directory entries without copying file data. Moving across filesystems may become copy-and-remove and has different failure behavior. Destination existence changes whether a source is renamed or placed inside another directory. Processes with an already-open file descriptor can continue accessing the renamed file.",
  "এক filesystem-এ move সাধারণত নামের তথ্য বদলায়; অন্য filesystem-এ copy করে পুরোনোটি সরাতে হতে পারে। Destination folder আছে কি না দেখে অর্থ বদলায়। খোলা file-এর process rename-এর পরও পুরোনো descriptor ব্যবহার করতে পারে।",
  `mkdir -p /tmp/mastery-move/archive
printf 'draft\n' > /tmp/mastery-move/draft.txt
mv /tmp/mastery-move/draft.txt /tmp/mastery-move/final.txt
mv /tmp/mastery-move/final.txt /tmp/mastery-move/archive/
find /tmp/mastery-move -type f`,
  `mv -i /tmp/mastery-move/archive/final.txt /tmp/mastery-move/final.txt
ls -l /tmp/mastery-move
stat /tmp/mastery-move/final.txt
# -i asks before overwriting an existing destination.`,
  "Use atomic same-filesystem renames for publishing a fully written temporary file when appropriate. Cross-filesystem moves do not automatically provide the same atomic visibility.",
  "সম্পূর্ণ লেখা temporary file একই filesystem-এ rename করে প্রকাশ করা কাজে লাগে। অন্য filesystem-এর move একই atomic নিশ্চয়তা দেয় না।",
);
put(
  "1-7",
  "cat reads bytes and writes them to standard output in order. The shell, not cat, interprets redirection operators. > truncates or creates a destination; >> appends. Concatenating a file into itself through output redirection can destroy or endlessly grow data depending on the pattern. For large content, use a pager rather than flooding a terminal.",
  "Cat file পড়ে stdout-এ দেয়। > ও >> shell সামলায়: প্রথমটি নতুন করে লিখে, দ্বিতীয়টি শেষে যোগ করে। একই file-এ ভুল redirection দিলে data নষ্ট হতে পারে। বড় file pager দিয়ে পড়া ভালো।",
  `printf 'first\n' > /tmp/mastery-a.txt
printf 'second\n' > /tmp/mastery-b.txt
cat /tmp/mastery-a.txt /tmp/mastery-b.txt
cat -n /tmp/mastery-a.txt
cat /tmp/mastery-a.txt /tmp/mastery-b.txt > /tmp/mastery-combined.txt`,
  `head -n 5 /tmp/mastery-combined.txt
tail -n 5 /tmp/mastery-combined.txt
wc -l /tmp/mastery-combined.txt
file /tmp/mastery-combined.txt`,
  "Use binary-safe tools for binary files, and do not print secrets merely to confirm they exist. File size, permissions, and a deliberate validation operation often provide safer evidence.",
  "Secret আছে কি না জানতে পুরো মান terminal-এ দেখাবেন না। Size, permission বা নির্দিষ্ট validation দিয়ে নিরাপদে পরীক্ষা করুন।",
);
put(
  "1-8",
  "grep matches patterns against lines; recursive mode extends the search through a tree. Regular expressions have metacharacters, while -F treats the pattern literally. Exit status 0 means a match, 1 means no match, and larger error statuses indicate failure. Excluding generated folders makes source investigations faster and less noisy.",
  "Grep line-এ pattern মেলায়। Regex-এর বিশেষ চিহ্ন আছে; -F দিলে হুবহু লেখা খোঁজে। Match পেলে exit ০, না পেলে ১; আসল error আলাদা। Generated folder বাদ দিলে ফল পরিষ্কার হয়।",
  `grep -rn --include='*.cs' 'TODO' src
grep -rnF 'Console.WriteLine' src
grep -rn --exclude-dir=bin --exclude-dir=obj 'password' src
grep -n '^using ' Program.cs`,
  `grep -nF 'missing-value' README.md
printf 'Last exit status: %s\n' "$?"
grep -rnlF 'DbContext' src
grep -nE 'ERROR|WARN' app.log`,
  "Do not treat a no-match exit status as a broken tool. Quote patterns so the shell does not expand them. Log searches can expose sensitive content; choose outputs and destinations carefully.",
  "No match মানেই tool নষ্ট নয়। Pattern quote করুন। Log-এ secret থাকতে পারে, তাই কোন অংশ কোথায় দেখাচ্ছেন খেয়াল রাখুন।",
);
put(
  "1-9",
  "find evaluates predicates on filesystem entries. Name matching, type checks, modification time, and depth limits can be combined without reading every file’s content. Actions run on matched paths. Filenames may contain spaces and newlines, so safe composition uses -exec with {} or null delimiters instead of splitting newline text.",
  "Find নাম, ধরন, সময় ও depth দিয়ে filesystem-এর entry বাছে। File-এর লেখা না পড়েও খোঁজে। Filename-এ space বা newline থাকতে পারে, তাই নিরাপদে -exec বা null delimiter ব্যবহার করুন।",
  `find . -type f -name '*.cs'
find . -maxdepth 2 -type d
find ./logs -type f -name '*.log' -mtime +7
find ./src -type f -name '*.cs' -exec wc -l {} +`,
  `find ./logs -type f -name '*.log' -print
# Review the printed candidates before any destructive action.
find ./src -type f -size +1M -print
find . -type l -print`,
  "Test selection using -print before replacing it with deletion or mutation. -mtime counts rounded day units; understand boundaries before using it for retention policies.",
  "Delete যোগ করার আগে -print দিয়ে বাছা path দেখুন। -mtime পূর্ণ দিনের হিসাব করে; retention-এর সীমা না বুঝে চালাবেন না।",
);
put(
  "1-10",
  "Permissions have separate owner, group, and other triplets. Read/write/execute mean different things for files and directories: directory execute permits traversal, while directory write allows changing entries subject to other rules. Numeric modes encode these bits; symbolic modes describe a change relative to the existing mode.",
  "মালিক, group ও অন্যদের আলাদা rwx থাকে। Folder-এর x ভেতরে যেতে দেয়; w entry বদলাতে দেয়। ৬৪০-এর মতো সংখ্যা bits-এর হিসাব, symbolic mode নির্দিষ্ট permission যোগ বা বাদ দেয়।",
  `printf 'demo\n' > /tmp/mastery-permissions.txt
chmod 640 /tmp/mastery-permissions.txt
ls -l /tmp/mastery-permissions.txt
chmod g-r /tmp/mastery-permissions.txt
stat /tmp/mastery-permissions.txt`,
  `mkdir -p /tmp/mastery-private-dir
chmod 700 /tmp/mastery-private-dir
ls -ld /tmp/mastery-private-dir
umask
# ACLs and security modules can impose additional rules.`,
  "Avoid recursive chmod with one mode for both files and directories: files rarely need execute permission, but directories commonly do. Investigate ownership, ACLs, and mount options before broadening access.",
  "সব file ও folder-এ এক recursive mode দেবেন না। File-এ x দরকার নাও হতে পারে, folder-এ লাগে। আগে owner ও অন্য নিয়ম দেখুন।",
);
put(
  "1-11",
  "Ownership determines which permission triplet applies and which identity controls a file. Services should write only the directories they own or are explicitly permitted to use. Container numeric user IDs must match filesystem expectations; a username label inside an image does not automatically change ownership on a host-mounted directory.",
  "File-এর owner অনুযায়ী কোন permission চলবে তা নির্ধারিত হয়। Service-কে শুধু দরকারি folder-এ write দিন। Container-এর user নাম আর host-এর numeric UID এক জিনিস নয়; volume-এ mismatch হতে পারে।",
  `id
ls -ld /srv/app/data
stat /srv/app/data
# An authorized administrator may run the next operation.
# chown app:app /srv/app/data`,
  `find /srv/app -maxdepth 2 -printf '%u:%g %p\n'
id app
ls -ln /srv/app/data
# Compare numeric IDs with the process identity.`,
  "Changing ownership usually requires administrative authority. Do not recursively take ownership of system directories to make an application start; assign a dedicated writable data directory.",
  "অ্যাপ চালাতে system folder-এর owner নিজের করে নেবেন না। Administrator-এর মাধ্যমে আলাদা data directory-তে ঠিক permission দিন।",
);
put(
  "1-12",
  "A tar archive bundles paths and metadata; gzip compresses that archive stream. Listing contents before extraction reveals unexpected top-level paths. Extraction can create links or replace existing files, so use a dedicated empty destination and trust the source. The archive format itself does not prove origin or integrity.",
  "Tar file ও metadata এক করে; gzip সেই stream ছোট করে। খোলার আগে তালিকা দেখুন। Archive link বানাতে বা file বদলাতে পারে, তাই আলাদা খালি folder নিন ও উৎস যাচাই করুন।",
  `mkdir -p /tmp/mastery-archive/source
printf 'demo\n' > /tmp/mastery-archive/source/readme.txt
tar -czf /tmp/mastery-demo.tar.gz -C /tmp/mastery-archive/source .
tar -tzf /tmp/mastery-demo.tar.gz
mkdir -p /tmp/mastery-archive/extracted
tar -xzf /tmp/mastery-demo.tar.gz -C /tmp/mastery-archive/extracted`,
  `gzip -t /tmp/mastery-demo.tar.gz
sha256sum /tmp/mastery-demo.tar.gz
find /tmp/mastery-archive/extracted -type f
cmp /tmp/mastery-archive/source/readme.txt /tmp/mastery-archive/extracted/readme.txt`,
  "A checksum detects change only when compared to a trusted expected value. Compressed archives can expand dramatically; consider size and path limits for untrusted uploads.",
  "নিজে hash বের করলেই উৎস বিশ্বস্ত হয় না; trusted expected hash-এর সাথে মেলাতে হয়। ছোট compressed file খুলে অনেক বড় হতে পারে।",
);
put(
  "1-13",
  "ps is a snapshot rather than a live monitor. PID, parent PID, state, command, CPU, and memory help identify a process, but identifiers can be reused after termination. CPU percentages depend on sampling and tool semantics. A zombie is a terminated child waiting for its parent to reap status, not a running CPU-consuming application.",
  "Ps এক মুহূর্তের ছবি। PID, parent, state ও command দেখে process চিনুন; PID পরে অন্য process পেতে পারে। Zombie আসলে শেষ হওয়া child যার parent এখনো status নেয়নি, চলমান কাজ নয়।",
  `ps aux
ps -eo pid,ppid,user,stat,%cpu,%mem,args --sort=-%cpu
ps -p 1234 -o pid,ppid,etime,stat,args
# Replace 1234 with a current observed PID.`,
  `pgrep -a dotnet
ps -u "$USER" -o pid,ppid,stat,args
pstree -p
# Command-line arguments can contain sensitive values.`,
  "Correlate process identity immediately before sending signals. For .NET memory investigation, pair OS metrics with managed-heap and allocation diagnostics rather than equating RSS with GC heap size.",
  "Signal দেওয়ার আগে PID-এর পরিচয় আবার মিলান। .NET-এর memory বুঝতে OS metric-এর সাথে managed heap-এর হিসাবও দেখুন।",
);
put(
  "1-14",
  "top periodically samples system and per-process activity. High CPU, high load, low free memory, and I/O wait are different observations. Linux uses spare memory for useful caches, so free memory alone is not a good pressure signal. Watch changes over time and correlate them with request rate and latency.",
  "Top নিয়মিত মিটার পড়ে। CPU বেশি, load বেশি ও I/O wait এক সমস্যা নয়। Linux খালি memory cache-এ কাজে লাগায়, তাই শুধু free কম দেখেই ভয় পাবেন না; সময়ের সাথে চাপ ও latency মিলান।",
  `top
# Interactive: P sorts CPU, M sorts memory, q exits.
top -b -n 1
free -h
uptime`,
  `vmstat 1 5
ps -eo pid,comm,%cpu,%mem --sort=-%cpu
cat /proc/loadavg
# Pair observations with application latency and throughput.`,
  "Do not tune thread counts from a single top screenshot. A container may have a smaller CPU quota than the host, so interpret host-wide and cgroup-limited metrics separately.",
  "একটি screenshot দেখে thread বাড়াবেন না। Container-এর CPU quota host-এর চেয়ে কম হতে পারে, দুই হিসাব আলাদা।",
);
put(
  "1-15",
  "Signals request or force process behavior. SIGTERM gives a cooperative process a chance to stop accepting work and clean up. SIGKILL cannot be caught, blocked, or handled by application cleanup code. Uninterruptible kernel I/O can delay visible termination even after KILL. Supervisors may automatically restart the process you stop.",
  "SIGTERM গুছিয়ে বন্ধ হওয়ার সুযোগ দেয়। SIGKILL application ধরতে পারে না, cleanup-ও চলে না। Kernel I/O-তে আটকে থাকলে থামা দেখা দেরি হতে পারে। Supervisor আবার process চালিয়েও দিতে পারে।",
  `ps -p 1234 -o pid,user,stat,args
# Use only a PID you are authorized to stop.
kill -TERM 1234
ps -p 1234 -o pid,stat,args
# Wait within the application's shutdown budget.`,
  `ps -p 1234 -o pid,ppid,stat,args
# Last resort after identity and shutdown checks:
# kill -KILL 1234
pgrep -a dotnet
# Inspect the supervisor if a replacement process appears.`,
  "Prefer a service manager or orchestrator’s graceful stop operation. KILL can interrupt file writes or transactions outside protected storage semantics; plan recovery rather than assuming cleanup ran.",
  "Service manager দিয়ে graceful stop ভালো। KILL-এ মাঝের file write থামতে পারে; cleanup হয়েছে ধরে না নিয়ে recovery দেখুন।",
);
put(
  "1-16",
  "df reports capacity for mounted filesystems, not the size of a particular folder. Blocks can be consumed by files invisible in a directory walk, such as deleted files still held open. Reserved space, snapshots, and mount boundaries complicate comparisons. Inode exhaustion can prevent file creation independently of byte capacity.",
  "Df mount করা filesystem-এর জায়গা দেখায়, folder-এর মাপ নয়। মোছা কিন্তু process-এ খোলা file-এর জায়গা থাকতে পারে। Byte খালি থেকেও inode শেষ হলে নতুন file হয় না।",
  `df -h
df -h /var/log
df -i
findmnt /var/log
stat -f /var/log`,
  `du -sh /var/log
# If available and authorized, inspect unlinked open files.
lsof +L1
mount
# Compare the same filesystem boundary when reconciling totals.`,
  "Use df for filesystem pressure and du for directory attribution. Never delete arbitrary system files just because df is high; identify retention-safe data and running processes first.",
  "Filesystem চাপের জন্য df, কোন folder খাচ্ছে তার জন্য du। জায়গা কম মানেই যেকোনো system file মোছা নয়।",
);
put(
  "1-17",
  "du walks directory entries and estimates allocated storage. Its result depends on hard links, sparse files, permissions, and filesystem boundaries. Human-readable values are for people; machine comparisons need a consistent byte or block unit. Sorting a bounded set of directory summaries is useful for locating a large log or artifact subtree.",
  "Du ঘুরে দেখে কত disk block লেগেছে। Hard link, sparse file ও permission-এ ফল প্রভাবিত হয়। মানুষের h মানের বদলে script-এ একই unit নিন। কোন subtree বড় তা খুঁজুন।",
  `du -sh /var/log
du -h --max-depth=1 /var/log
du -x -h --max-depth=1 /var
ls -lh /var/log`,
  `du --apparent-size -sh /var/log
du -s --block-size=1 /var/log
find /var/log -type f -size +100M -print
# Inspect retention and ownership before removing any candidate.`,
  "A large apparent size can occupy few real blocks when a file is sparse. A directory walk with permission errors is incomplete evidence and should not be treated as a full inventory.",
  "Sparse file-এর logical মাপ বড় হলেও disk কম লাগতে পারে। Permission error থাকলে পুরো হিসাব পাননি, তা স্পষ্ট রাখুন।",
);
put(
  "1-18",
  "SSH encrypts transport and verifies the server host key before authenticating the user. User keys prove a client identity; known_hosts records the server identity. A host-key change may be legitimate rebuilding or an interception signal. Remote commands inherit a remote shell/environment, so quoting must account for local and remote interpretation.",
  "SSH-তে server-এর host key ও user-এর key দুই আলাদা পরিচয়। Host key বদলানো rebuild-ও হতে পারে, আক্রমণের সংকেতও হতে পারে। Remote command-এ নিজের shell ও দূরের shell—দুই জায়গায় quote-এর অর্থ ভাবুন।",
  `ssh -V
ssh -G app@example.com
# Replace the host with your authorized server.
# ssh -i ~/.ssh/learning_key app@example.com
# Never paste a private key into a terminal or notebook.`,
  `ssh-keygen -lf ~/.ssh/known_hosts
# Diagnostic example; review output for sensitive metadata.
# ssh -v app@example.com
# Use an agent and protected key storage when appropriate.`,
  "Verify a changed fingerprint through a trusted independent channel. Do not solve host-key warnings by globally disabling StrictHostKeyChecking or discarding known_hosts without investigation.",
  "Fingerprint বদলালে বিশ্বস্ত অন্য পথে মিলিয়ে নিন। Warning বন্ধ করতে host-key যাচাই globalভাবে বন্ধ করবেন না।",
);
put(
  "1-19",
  "curl separates network transport status from HTTP response status. By default an HTTP 404 can still be a successful transfer. Use explicit failure flags, time budgets, method, headers, and body shape in automation. A HEAD request is not equivalent to a GET for every server; redirects and response-size handling also need policy.",
  "Curl-এ data transfer সফল আর HTTP সফল এক নয়; 404-ও সাধারণত transfer সফল হতে পারে। Automation-এ failure flag, timeout, method ও body স্পষ্ট দিন। সব server-এ HEAD আর GET একই আচরণ নয়।",
  `curl --version
curl --connect-timeout 3 --max-time 10 -i https://example.com
curl --fail-with-body --max-time 10 https://example.com
curl -I --max-time 10 https://example.com`,
  `curl --max-time 10 -sS -o /tmp/mastery-response.txt -w '%{http_code}\n' https://example.com
wc -c /tmp/mastery-response.txt
curl --max-time 10 -sS -D /tmp/mastery-headers.txt -o /dev/null https://example.com
cat /tmp/mastery-headers.txt`,
  "Keep TLS verification enabled. Retrying non-idempotent requests automatically can duplicate side effects; choose retry conditions, deadlines, and idempotency keys deliberately.",
  "TLS যাচাই চালু রাখুন। Payment-এর মতো কাজ অন্ধ retry করলে দুইবার হতে পারে; method, deadline ও idempotency বুঝে দিন।",
);
put(
  "11-0",
  "Run combines create and start. An image reference selects filesystem/configuration defaults; command arguments can override its command. Port publishing maps host listeners to container listeners, while environment variables configure only that container. Container isolation shares the host kernel, so privilege, capabilities, mounts, and resource limits remain security decisions.",
  "Run-এ container তৈরি ও চালু একসাথে হয়। Image-এর default command বদলানো যায়। Port mapping আর অ্যাপের ভিতরের listener দুইটি ঠিক হতে হবে। Container kernel ভাগ করে, তাই mount, privilege ও resource limit গুরুত্বপূর্ণ।",
  `docker run --rm --name mastery-hello mcr.microsoft.com/dotnet/samples:dotnetapp
docker run -d --name mastery-web -p 127.0.0.1:8080:8080 mcr.microsoft.com/dotnet/samples:aspnetapp
docker ps --filter name=mastery-web
docker logs --tail 20 mastery-web
docker stop mastery-web`,
  `docker inspect mastery-web
docker port mastery-web
docker stats --no-stream mastery-web
# Cleanup a stopped disposable container:
docker rm mastery-web`,
  "Binding to 127.0.0.1 restricts this demo to local access. Production needs a reviewed image/digest, non-root identity, health checks, logging policy, and controlled network exposure.",
  "Demo-তে loopback binding বাইরে exposure কমায়। Production-এ reviewed image, non-root user, health check ও log policy যোগ করুন।",
);
put(
  "11-1",
  "ps lists containers known to the selected Docker engine. Running, exited, restarting, and paused describe different lifecycle states. A restart loop can briefly appear running between failures. Formatting and filters support inventory without printing all configuration. Health is a separate state only when a health check has been defined.",
  "Ps নির্বাচিত engine-এর container দেখায়। Running ও healthy আলাদা; health check না থাকলে health তথ্যই নেই। Restart loop-এর container সাময়িক running দেখাতে পারে। Filter দিয়ে দরকারি container বাছুন।",
  `docker context show
docker ps
docker ps -a
docker ps --filter status=exited
docker ps --format '{{.Names}} {{.Status}} {{.Ports}}'`,
  `docker ps --filter name=api
docker inspect --format '{{.State.ExitCode}}' api
docker inspect --format '{{.RestartCount}}' api
docker logs --tail 50 api`,
  "A container can exit successfully because its main process finished. Diagnose exit code, startup command, and logs before applying a restart policy that hides the real failure.",
  "মূল process শেষ হলে container স্বাভাবিকভাবেও থামে। Restart policy দেওয়ার আগে command, exit code ও log দেখুন।",
);
put(
  "11-2",
  "Images are content-addressed layer graphs with mutable human-friendly tag references. Multiple tags can point to one image, and images can share layers. Local size columns therefore do not directly equal removable disk capacity. Untagged images may still be retained by containers or build cache.",
  "Image-এর layer content দিয়ে চেনা হয়, tag মানুষের দেওয়া নাম। এক image-এর কয়েক tag ও কয়েক image-এর shared layer থাকতে পারে। তাই তালিকার size যোগ করলেই ছাড়ার জায়গা জানা যায় না।",
  `docker images
docker image ls --digests
docker image ls --filter dangling=true
docker system df
docker image inspect app:1.0`,
  `docker image history app:1.0
docker image ls --no-trunc
docker ps -a --filter ancestor=app:1.0
docker system df -v`,
  "Review container references and cache before cleanup. Do not delete a useful rollback image merely because it is not the newest tag. Record immutable digests for releases.",
  "Cleanup-এর আগে container ও cache-এর reference দেখুন। পুরোনো tag মানেই অপ্রয়োজনীয় নয়; rollback-এর জন্য লাগতে পারে।",
);
put(
  "11-3",
  "Pull resolves an image reference through a registry and downloads missing content. A tag may select a new image at a later time; a digest identifies exact content. Multi-platform manifests select compatible architecture/OS variants. Pulling does not start a process or prove the image is safe or compatible with your application configuration.",
  "Pull শুধু image আনে, process চালায় না। Tag পরে অন্য content দেখাতে পারে; digest নির্দিষ্ট content। Multi-platform image-এ architecture অনুযায়ী ভিন্ন অংশ আসে। Download সফল মানেই নিরাপদ বা compatible নয়।",
  `docker pull mcr.microsoft.com/dotnet/aspnet:9.0
docker image inspect mcr.microsoft.com/dotnet/aspnet:9.0
docker image ls --digests mcr.microsoft.com/dotnet/aspnet
docker image history mcr.microsoft.com/dotnet/aspnet:9.0`,
  `docker manifest inspect mcr.microsoft.com/dotnet/aspnet:9.0
docker version
docker info --format '{{.Architecture}}'
# Pin a reviewed sha256 digest in your actual release configuration.`,
  "Choose a currently supported runtime and patch policy. The curriculum uses .NET 9 names for continuity; check current Microsoft support dates before choosing a real deployment base image.",
  "বাস্তবে runtime-এর বর্তমান support date ও patch policy দেখুন। Course-এর version নামকে আজীবন supported ধরে নেবেন না।",
);
put(
  "11-4",
  "Build sends a context to the builder, evaluates Dockerfile instructions, and reuses eligible cached layers. Changing an early dependency layer can invalidate later work. Multi-stage builds keep SDK tools out of the final runtime image. Build arguments and ordinary layers are not safe secret storage because metadata or cached content may retain values.",
  "Build context-এর ফাইল Dockerfile অনুযায়ী layer হয়। আগের layer বদলালে পরের cache নষ্ট হতে পারে। Multi-stage-এ SDK বাদ দিয়ে ছোট runtime রাখা যায়। ARG বা layer-এ secret নিরাপদ নয়।",
  `dotnet publish ./src/App/App.csproj -c Release -o ./publish
docker build --progress=plain -t app:local .
docker image inspect app:local
docker image history app:local
docker run --rm app:local`,
  `docker build --no-cache -t app:diagnostic .
docker system df
docker image ls app
# Review .dockerignore before sending the context.
# Use supported BuildKit secret mounts for build-time secrets.`,
  "A no-cache rebuild is a diagnostic tool, not a fix for nondeterministic dependencies. Pin inputs, separate restore from source copying, and validate the resulting artifact.",
  "No-cache দিলে অনির্দিষ্ট dependency ঠিক হয় না। Input pin করুন, restore ও source layer আলাদা রাখুন, তৈরি image পরীক্ষা করুন।",
);
put(
  "11-5",
  "Exec starts an additional process inside an existing running container. It does not change the image and generally writes into the disposable container layer. Interactive stdin and pseudo-TTY are separate flags. Shell availability is image-dependent; minimal images intentionally omit many diagnostic tools.",
  "Exec চলমান container-এ নতুন process চালায়; image বদলায় না। ভিতরে edit করলে সাধারণত অস্থায়ী layer-এ থাকে। -i stdin খোলা রাখে, -t terminal দেয়। Minimal image-এ shell নাও থাকতে পারে।",
  `docker ps --filter name=api
docker exec api printenv ASPNETCORE_ENVIRONMENT
docker exec api pwd
docker exec -it api sh
docker inspect --format '{{.Config.User}}' api`,
  `docker logs --tail 30 api
docker top api
docker inspect --format '{{.State.Status}}' api
# Use a reviewed diagnostic container when the image lacks a shell.`,
  "Do not repair production by editing files inside a running container. Rebuild and redeploy an immutable artifact so the fix is reproducible and survives replacement.",
  "চলমান container-এ file edit করে স্থায়ী fix ভাববেন না। Source ঠিক করে image build ও redeploy করুন।",
);
put(
  "11-6",
  "Logs usually contain stdout/stderr from the main container process through the configured logging driver. They are not automatically every file under /var/log. Follow streams ongoing records; tail and since bound the requested history. Rotation and collection policies determine whether old records remain available after restarts or replacement.",
  "Docker logs সাধারণত process-এর stdout/stderr পড়ে, container-এর সব log file নয়। Tail ও since দিয়ে সময় ও পরিমাণ বাঁধুন। Logging driver, rotation ও collector-এর উপর পুরোনো log থাকা নির্ভর করে।",
  `docker logs --tail 100 api
docker logs --since 10m --timestamps api
docker logs --follow --tail 20 api
docker inspect --format '{{json .HostConfig.LogConfig}}' api`,
  `docker ps -a --filter name=api
docker inspect --format '{{.State.StartedAt}}' api
docker inspect --format '{{.State.FinishedAt}}' api
# Correlate application request IDs with timestamps.`,
  "Structured logs help search and correlation. Avoid printing secrets or full user payloads, and do not assume container-local log files survive a replacement.",
  "Structured field রাখুন, secret বা পুরো user data নয়। Container বদলালে ভিতরের log file থাকবে ধরে নেবেন না।",
);
put(
  "11-7",
  "Stop sends the configured stop signal to the main process and waits before forced termination. Signal delivery depends on entrypoint structure; a shell wrapper may fail to forward signals. Graceful shutdown should stop admission, complete or cancel in-flight work within a budget, and flush essential state.",
  "Stop আগে signal দেয়, সময় শেষে force করে। Shell wrapper signal না পাঠালে অ্যাপ সুযোগ পায় না। Graceful shutdown-এ নতুন কাজ বন্ধ, চলমান কাজ সীমিত সময়ে শেষ বা cancel, দরকারি state রাখা লাগে।",
  `docker inspect --format '{{.Config.StopSignal}}' api
docker stop --time 30 api
docker ps -a --filter name=api
docker inspect --format '{{.State.ExitCode}}' api
docker logs --tail 30 api`,
  `docker start api
docker stop --time 5 api
docker inspect --format '{{.State.FinishedAt}}' api
# Compare graceful application logs with the forced-stop budget.`,
  "Use exec-form entrypoints and cancellation-aware hosted services. A longer timeout cannot fix an application that never receives or handles the shutdown signal.",
  "Exec-form entrypoint ও cancellation-aware worker দিন। Signal-ই না পৌঁছালে শুধু timeout বাড়িয়ে লাভ নেই।",
);
put(
  "11-8",
  "Start reuses an existing container definition, writable layer, environment, mounts, and original image identity. Pulling or building a newer image with the same tag does not mutate that existing container. Restart policies and orchestrators can also start workloads automatically, so identify the owner before manually managing lifecycle.",
  "Start পুরোনো container-এর config ও image identity-ই ব্যবহার করে। একই tag-এ নতুন image আনলেও আগে বানানো container বদলে যায় না। Orchestrator চালালে তার নিয়মও বুঝতে হবে।",
  `docker ps -a --filter name=api
docker start api
docker logs --tail 30 api
docker inspect --format '{{.Image}}' api
docker image inspect --format '{{.Id}}' app:1.0`,
  `docker stop api
docker start -a api
docker inspect --format '{{.RestartCount}}' api
# Recreate the container to adopt a different image/configuration.`,
  "Use recreate/redeploy for configuration or image changes. Start is appropriate for a deliberately retained stopped container, not an update mechanism.",
  "Image বা setting বদলাতে container recreate বা redeploy করুন। Start বন্ধ একই container চালায়, update নয়।",
);
put(
  "11-9",
  "Removing a container deletes its definition and writable layer. Named volumes normally remain, while anonymous-volume removal is controlled separately. Removing a running container forcefully can interrupt the application without graceful cleanup. An orchestrator may recreate an equivalent container if its desired state still requests one.",
  "Container rm-এ config ও অস্থায়ী লেখা স্তর সরে। Named volume সাধারণত থাকে। Running container force করে সরালে cleanup হয় না। Orchestrator চাইলে আবার তৈরি করে দিতে পারে।",
  `docker ps -a --filter name=api
docker inspect --format '{{json .Mounts}}' api
docker stop api
docker rm api
docker volume ls`,
  `docker ps -a --filter status=exited
docker system df
# Review each disposable candidate before removal.
# Never confuse container removal with deleting a database volume.`,
  "Inspect persistence before removal. A successful removal is not proof that customer data was backed up or that all associated resources were cleaned up.",
  "আগে data কোথায় থাকে দেখুন। Container সরেছে মানেই backup আছে বা সব resource পরিষ্কার হয়েছে নয়।",
);
put(
  "11-10",
  "Image removal may remove only a tag or may make unreferenced layers eligible for cleanup. Other tags, stopped containers, and build caches can retain content. Disk usage is based on shared layer references, so the apparent image size is not a promise of freed bytes. Release artifact retention should support rollback requirements.",
  "Rmi কখনো শুধু tag সরায়। অন্য tag, stopped container বা cache থাকলে layer থাকে। Shared layer-এর কারণে তালিকার size পরিমাণ জায়গা নাও ছাড়তে পারে। Rollback image রাখার নীতি দরকার।",
  `docker image ls app
docker ps -a --filter ancestor=app:old
docker image inspect app:old
docker image rm app:old
docker system df`,
  `docker image ls --digests
docker image ls --filter dangling=true
docker system df -v
# Remove only reviewed images not needed by deployments or rollback.`,
  "Separate tag cleanup from broad pruning. Retain the exact digest of deployed and rollback artifacts even if local developer tags are removed.",
  "Tag cleanup আর broad prune আলাদা। Local tag সরলেও deployed ও rollback-এর নির্দিষ্ট digest রাখুন।",
);
put(
  "11-11",
  "Inspect exposes configuration and runtime state as structured JSON. Templates can select a narrow field, avoiding overwhelming output and reducing accidental disclosure. Container IPs are usually ephemeral and should not replace service discovery. Environment values and mounts can reveal credentials or sensitive host paths.",
  "Inspect JSON-এ config ও state দেয়। Template দিয়ে দরকারি field নিলে noise ও leak কমে। Container IP স্থায়ী service address নয়। Environment ও mount-এর তথ্যে secret থাকতে পারে।",
  `docker inspect --format '{{.State.Status}}' api
docker inspect --format '{{.State.ExitCode}}' api
docker inspect --format '{{.Config.User}}' api
docker inspect --format '{{json .NetworkSettings.Ports}}' api
docker inspect --format '{{json .Mounts}}' api`,
  `docker inspect --format '{{.Image}}' api
docker inspect --format '{{.RestartCount}}' api
docker inspect --format '{{json .State.Health}}' api
# Share only redacted, necessary diagnostic fields.`,
  "Prefer explicit fields in support evidence. Do not paste full inspect output into tickets without reviewing environment, labels, mounts, and authentication-related configuration.",
  "Support-এ পুরো inspect paste না করে প্রয়োজনীয় field দিন। Environment, label ও mount আগে গোপন তথ্যের জন্য দেখুন।",
);
put(
  "11-12",
  "A user-defined bridge network provides local container discovery by name and isolation from unrelated bridges. Published ports expose selected container ports to the host; containers on the same network can normally use container ports directly. Host networking and platform behavior differ, so do not assume every development topology maps to production.",
  "User-defined bridge-এ container নাম দিয়ে একে অন্যকে খুঁজে পায়। একই network-এ host-published port-এর বদলে container port ব্যবহার হয়। Host network ও platform-এর আচরণ আলাদা হতে পারে।",
  `docker network ls
docker network create mastery-net
docker network inspect mastery-net
docker run -d --name mastery-web --network mastery-net mcr.microsoft.com/dotnet/samples:aspnetapp
docker network inspect mastery-net`,
  `docker inspect --format '{{json .NetworkSettings.Networks}}' mastery-web
docker stop mastery-web
docker rm mastery-web
docker network rm mastery-net`,
  "A network boundary is one control, not full authorization. Limit published interfaces and use application authentication, TLS where required, and explicit network membership.",
  "Network আলাদা হলেই পূর্ণ authorization নয়। Port exposure, app-এর পরিচয় যাচাই ও প্রয়োজনমতো TLS রাখুন।",
);
put(
  "11-13",
  "Volumes decouple persistent data from a container’s writable layer. Named volumes are managed by the engine; bind mounts expose chosen host paths. Mounting over an existing container path hides the image content at that path while the mount is active. Volume lifetime and backup consistency need a policy independent of container replacement.",
  "Volume container-এর অস্থায়ী layer-এর বাইরে data রাখে। Bind mount host-এর path দেয়। কোনো image path-এর উপর mount দিলে তার পুরোনো content ঢাকা পড়ে। Backup ও মেয়াদ container বদলানোর বাইরে পরিকল্পনা করুন।",
  `docker volume create mastery-data
docker volume ls
docker volume inspect mastery-data
docker system df -v
# Mount using --mount type=volume,src=mastery-data,dst=/data in your app.`,
  `docker ps -a --filter volume=mastery-data
docker volume inspect mastery-data
# Verify application-consistent backups before deletion.
# docker volume rm mastery-data  # disposable empty demo only`,
  "A volume is persistence, not automatically a backup. Test restore procedures and ownership under the actual runtime user. Avoid storing production database files in an unplanned host bind mount.",
  "Volume থাকাই backup নয়। Restore ও runtime user-এর permission পরীক্ষা করুন; অগোছালো host path-এ production database রাখবেন না।",
);
put(
  "11-14",
  "Tag creates another name for an existing local image; it does not copy or rebuild layers. Registry hostname and repository path determine the eventual push destination. Tags are mutable references unless registry policy prevents updates. Semantic version tags communicate a release, while digests identify the exact bytes.",
  "Tag নতুন নাম দেয়, layer আবার বানায় না। Hostname ও repository path ঠিক করে push কোথায় যাবে। Registry policy না থাকলে tag বদলানো যায়; digest নির্দিষ্ট content চিনায়।",
  `docker image inspect app:local
docker tag app:local registry.example.com/team/app:1.2.0
docker image ls app
docker image ls registry.example.com/team/app
docker image inspect --format '{{.Id}}' registry.example.com/team/app:1.2.0`,
  `docker tag app:local registry.example.com/team/app:review
# The two tags currently point to the same local content.
docker image inspect --format '{{.Id}}' app:local
docker image inspect --format '{{.Id}}' registry.example.com/team/app:review`,
  "Choose a naming policy that distinguishes mutable development tags from immutable release identifiers. Replace the illustrative registry before pushing; inspect the destination first.",
  "Development-এর বদলানো tag ও release-এর স্থায়ী পরিচয় আলাদা রাখুন। Push-এর আগে উদাহরণের registry সঠিক গন্তব্যে বদলান।",
);
put(
  "11-15",
  "Push publishes manifests and missing layers to the selected registry repository after authentication and authorization. Successful publication makes an artifact available but does not deploy it. Remote registry retention, immutability, scanning, and access policies determine its later safety and availability. Capture the returned digest for reproducible rollout.",
  "Push registry-তে image দেয়, অ্যাপ deploy করে না। Login ও repository permission লাগে। পরে retention, scanning ও immutable tag-এর নিয়ম image-এর ব্যবস্থাপনা ঠিক করে। প্রকাশের digest রেখে দিন।",
  `docker image inspect registry.example.com/team/app:1.2.0
docker push registry.example.com/team/app:1.2.0
docker image ls --digests registry.example.com/team/app
# Record the registry-reported digest in release metadata.`,
  `docker manifest inspect registry.example.com/team/app:1.2.0
docker pull registry.example.com/team/app:1.2.0
docker image inspect registry.example.com/team/app:1.2.0
# Test the published artifact before rollout.`,
  "Use least-privilege push credentials, and separate build publication from production rollout authority. Never grant arbitrary pull-request code production registry credentials.",
  "Push ও production deploy-এর অধিকার আলাদা রাখুন। অবিশ্বস্ত PR code-এ production registry secret দেবেন না।",
);
put(
  "11-16",
  "Registry login configures credential use for later registry operations. Credential helpers protect stored authentication better than plain local configuration. Interactive passwords and access tokens have different scope and expiry. Authentication success does not imply permission to push to every repository. Logging out removes local access material according to the configured helper.",
  "Login পরের pull/push-এর জন্য পরিচয় দেয়। Credential helper নিরাপদ storage-এ সাহায্য করে। Token-এর scope ও মেয়াদ দেখুন। Login সফল মানেই সব repository-তে write permission নয়।",
  `docker login registry.example.com
# Prefer interactive login or a supported credential helper.
docker pull registry.example.com/team/app:1.2.0
docker logout registry.example.com`,
  `docker context show
docker version
# Verify the exact registry hostname and account scope.
# Do not place real passwords in command arguments or source code.`,
  "For automation, pass short-lived credentials through an approved stdin/secret mechanism, not command-line arguments. Review helper configuration before copying Docker configuration between machines.",
  "Automation-এ অনুমোদিত secret/stdin ব্যবস্থা নিন, command argument নয়। অন্য machine-এ config কপি করার আগে credential তথ্য দেখুন।",
);
put(
  "11-17",
  "Compose resolves a declarative application model, creates networks and containers, and starts services. Detached mode returns while processes continue. Environment interpolation occurs before the model reaches the engine, so inspect the resolved configuration carefully without leaking secrets. Dependency ordering is not equivalent to readiness unless health conditions are configured.",
  "Compose file থেকে service, network ও container তৈরি হয়। -d-তে terminal ফেরত আসে, কাজ চলতে থাকে। Environment-এর মান বসে চূড়ান্ত config হয়। আগে চালু মানেই ready নয়; health condition দরকার।",
  `docker compose config --services
docker compose config --images
docker compose up -d
docker compose ps
docker compose logs --tail 50 api`,
  `docker compose up -d --build api
docker compose ps -a
docker compose logs --since 5m api
docker compose restart api
# A restart alone does not adopt changed container configuration.`,
  "Use the same project name/file set consistently. Separate development bind mounts from production artifact deployment, and protect environment and secret files from source control.",
  "একই project name ও file set ব্যবহার করুন। Development-এর source mount আর production artifact আলাদা রাখুন; secret file commit নয়।",
);
put(
  "11-18",
  "Compose down stops and removes the project’s containers and default networks. Named volumes are normally preserved unless explicitly requested otherwise. External resources are managed outside the Compose project. Using a different project name or file can leave the original resources untouched, so verify project identity before cleanup.",
  "Down project-এর container ও সাধারণ network সরায়। Named volume সাধারণত থাকে, -v-তে সরতে পারে। External resource আলাদা। ভুল project name দিলে আসল resource থেকে যায় বা অন্যটি লক্ষ্য হতে পারে।",
  `docker compose ls
docker compose ps -a
docker compose config --volumes
docker compose down
docker volume ls`,
  `docker compose ls
docker ps -a --filter label=com.docker.compose.project=mastery
# Destructive volume cleanup is separate:
# docker compose down --volumes  # only for verified disposable data`,
  "Stopping a stack is not a database backup. Confirm retained volumes and a tested recovery point before any volume-removal flag.",
  "Stack বন্ধ করা backup নয়। Volume সরানোর আগে কোন data থাকবে ও restore করা যায় কি না নিশ্চিত করুন।",
);
put(
  "11-19",
  "System prune reclaims resources the engine considers unused. Its selection is reference-based, not business-value-based. Optional flags expand the removal scope, and volumes have separate handling. Build cache, stopped containers, and untagged layers may still be useful for offline development or rollback even if no process is currently running.",
  "Prune-এর unused মানে engine-এর reference অনুযায়ী, ব্যবসার প্রয়োজন অনুযায়ী নয়। বন্ধ container বা cache পরে দরকার হতে পারে। Flag অনুযায়ী scope বাড়ে, volume-এর নিয়ম আলাদা।",
  `docker system df
docker container ls -a
docker image ls --filter dangling=true
docker volume ls
# Review the interactive confirmation before any prune.
docker system prune`,
  `docker system df -v
docker builder du
# Prefer targeted cleanup after identifying the large category.
# Avoid adding -a or --volumes without a separate review.`,
  "Cleanup should follow measured disk attribution and retention policy. A prune command is not an appropriate first reaction to an unexplained storage spike.",
  "জায়গা কোথায় গেছে মেপে retention অনুযায়ী cleanup। Disk বাড়ল দেখেই প্রথমে broad prune নয়।",
);
put(
  "12-0",
  "Pods have a lifecycle phase and separate readiness conditions for their containers. A Deployment replaces failed pods, so names and IPs are ephemeral. Inspect namespace, labels, restarts, and events together. A Running phase does not mean the application can serve traffic.",
  "Pod-এর phase ও readiness আলাদা। Deployment নতুন pod বানালে নাম ও IP বদলায়। Namespace, label, restart ও event মিলিয়ে দেখুন; Running মানেই request নেওয়ার মতো ready নয়।",
  `kubectl config current-context
kubectl get pods -n learning -o wide
kubectl get pods -n learning -l app=api
kubectl get pods -n learning --show-labels
kubectl get pods -n learning -w`,
  `kubectl get pods -n learning --field-selector=status.phase=Pending
kubectl describe pod api-demo -n learning
kubectl logs api-demo -n learning --previous
kubectl get events -n learning --sort-by=.metadata.creationTimestamp`,
  "Use real observed names in diagnostic commands. Do not automate around a fixed pod name when a Deployment or label selector expresses the workload identity.",
  "Diagnostic-এ আসল নাম নিন। স্থায়ী app চিনতে Deployment বা label ব্যবহার করুন, ক্ষণস্থায়ী pod নাম নয়।",
);
put(
  "12-1",
  "A Service selects endpoints, usually from pod labels, and gives clients a stable discovery name. Service port and targetPort refer to different boundaries. EndpointSlices reveal whether ready backends were selected. Creating a Service does not start pods or open every external firewall.",
  "Service label দিয়ে backend বাছে ও স্থায়ী নাম দেয়। port ও targetPort আলাদা। EndpointSlice-এ ready backend আছে কি না দেখুন। Service বানানো মানে pod চালা বা বাইরের firewall খোলা নয়।",
  `kubectl get svc -n learning
kubectl describe svc api -n learning
kubectl get endpointslices -n learning -l kubernetes.io/service-name=api
kubectl get pods -n learning -l app=api -o wide`,
  `kubectl get svc api -n learning -o yaml
kubectl get pods -n learning --show-labels
kubectl port-forward svc/api 8080:80 -n learning
# Test http://localhost:8080 from your own terminal.`,
  "When a Service has no backends, check selector mismatch and pod readiness before changing its type to LoadBalancer.",
  "Backend না থাকলে আগে selector ও readiness দেখুন; অকারণে Service type বদলে সমস্যা ঢাকবেন না।",
);
put(
  "12-2",
  "A Deployment manages desired pod template and replica count through ReplicaSets. Updated, ready, available, and desired counts answer different rollout questions. Editing the pod template creates a new rollout; changing only replica count scales the current workload. Readiness and progress deadlines influence success.",
  "Deployment ReplicaSet দিয়ে pod template ও কপির সংখ্যা সামলায়। Desired, updated, ready ও available এক নয়। Template বদলালে rollout; শুধু replica বদলালে scale।",
  `kubectl get deployments -n learning
kubectl describe deployment api -n learning
kubectl get replicasets -n learning -l app=api
kubectl rollout history deployment/api -n learning`,
  `kubectl get deployment api -n learning -o yaml
kubectl rollout status deployment/api -n learning --timeout=120s
kubectl get pods -n learning -l app=api -o wide
kubectl get events -n learning --sort-by=.metadata.creationTimestamp`,
  "A desired count of three with one available pod is not a healthy completed rollout. Investigate image pulls, scheduling, probes, and application startup.",
  "তিনটি desired কিন্তু একটি available হলে rollout পূর্ণ নয়। Image, scheduler, probe ও startup দেখুন।",
);
put(
  "12-3",
  "Nodes advertise capacity and allocatable resources, while pods request portions of that capacity. A Ready node can still be unschedulable due to cordoning, taints, or resource shortage. Labels and topology guide placement; node health is not the same as application health.",
  "Node-এর মোট capacity ও pod-এর জন্য allocatable আলাদা। Ready হলেও cordon, taint বা resource shortage-এ নতুন pod নাও বসতে পারে। Node healthy আর app healthy এক নয়।",
  `kubectl get nodes -o wide
kubectl describe node worker-1
kubectl get nodes --show-labels
kubectl top nodes`,
  `kubectl get pods -A -o wide --field-selector spec.nodeName=worker-1
kubectl get events -A --sort-by=.metadata.creationTimestamp
kubectl get node worker-1 -o yaml
# Replace worker-1 with an observed node name.`,
  "Do not remove taints or limits blindly. Understand workload placement and disruption implications before maintenance operations.",
  "বুঝে না নিয়ে taint সরাবেন না। Placement ও disruption-এর প্রভাব জেনে maintenance করুন।",
);
put(
  "12-4",
  "Describe combines specification, conditions, container state, and recent events into a diagnostic view. ImagePullBackOff, CrashLoopBackOff, and Pending represent different failure paths. Events have retention limits, so preserve relevant messages during an incident and correlate them with application logs.",
  "Describe-এ spec, condition, state ও event একসাথে আসে। Image টানা ব্যর্থ, app crash ও scheduling pending আলাদা সমস্যা। Event চিরকাল থাকে না, দরকারি বার্তা সময়সহ রাখুন।",
  `kubectl get pods -n learning
kubectl describe pod api-demo -n learning
kubectl logs api-demo -n learning
kubectl logs api-demo -n learning --previous`,
  `kubectl get pod api-demo -n learning -o yaml
kubectl get events -n learning --field-selector involvedObject.name=api-demo
kubectl get pvc -n learning
kubectl describe deployment api -n learning`,
  "Read the last terminated state and exit code before restarting the pod. A restart may remove evidence without fixing the cause.",
  "Restart-এর আগে শেষ state ও exit code দেখুন। Restart-এ প্রমাণ সরে যেতে পারে, কারণ ঠিক নাও হতে পারে।",
);
put(
  "12-5",
  "Logs target a container’s stdout/stderr. A pod with multiple containers requires the right container selection. Previous retrieves the last terminated instance when available; it is not an unlimited archive. Label-based log aggregation helps during a rollout, but centralized collection is needed for durable investigation.",
  "Log নির্দিষ্ট container-এর stdout/stderr। Multi-container pod-এ সঠিকটি বাছুন। --previous আগের instance-এর সীমিত log, পূর্ণ archive নয়। স্থায়ী তদন্তে collector দরকার।",
  `kubectl logs deployment/api -n learning --tail=100
kubectl logs api-demo -c api -n learning --timestamps
kubectl logs api-demo -n learning --previous
kubectl logs -f deployment/api -n learning --tail=20`,
  `kubectl logs -l app=api -n learning --all-containers=true --prefix=true --tail=50
kubectl get pods -n learning -l app=api
kubectl describe pod api-demo -n learning
# Keep request IDs and deployment revisions with incident evidence.`,
  "Logs can contain private data. Limit scope and retention; do not share full payloads merely because the command can print them.",
  "Log-এ private data থাকতে পারে। Scope সীমিত রাখুন ও incident-এ দরকারের বেশি payload শেয়ার করবেন না।",
);
put(
  "12-6",
  "Exec sends a remote process request through the Kubernetes API. Arguments after -- belong to the container command rather than kubectl. Interactive flags are useful for a shell, but scripts should use noninteractive commands with predictable output. RBAC permission to exec is powerful and should be restricted.",
  "Exec API-এর মাধ্যমে container-এ process চালায়। -- এর পরে container command। Script-এ interactive shell নয়, নির্দিষ্ট command ভালো। Exec-এর RBAC অধিকার শক্তিশালী, সীমিত দিন।",
  `kubectl get pods -n learning
kubectl exec deployment/api -n learning -- printenv ASPNETCORE_ENVIRONMENT
kubectl exec deployment/api -n learning -- pwd
kubectl exec -it deployment/api -n learning -- sh`,
  `kubectl auth can-i create pods/exec -n learning
kubectl get pod api-demo -n learning -o jsonpath='{.spec.containers[*].name}'
kubectl exec api-demo -c api -n learning -- id
# Do not modify production binaries inside a running pod.`,
  "A minimal image may intentionally lack a shell. Use an approved ephemeral debugging workflow rather than weakening the production image’s security.",
  "Shell না থাকা নিরাপত্তার সিদ্ধান্ত হতে পারে। Image দুর্বল না করে অনুমোদিত debug ব্যবস্থা নিন।",
);
put(
  "12-7",
  "Apply reconciles a declarative manifest with API objects. Admission policies, schema validation, field ownership, and defaults can affect the stored result. Server-side dry-run exercises server validation without persisting resources. Diff helps review a change but may expose configuration values, so protect diagnostic output.",
  "Apply লিখিত নকশা API object-এর সাথে মেলায়। Admission policy, default ও field ownership প্রভাব ফেলে। Server dry-run save না করে server-এর validation করে। Diff-এ secret value থাকতে পারে।",
  `kubectl config current-context
kubectl apply --dry-run=server -f deployment.yaml -n learning
kubectl diff -f deployment.yaml -n learning
kubectl apply -f deployment.yaml -n learning
kubectl rollout status deployment/api -n learning --timeout=120s`,
  `kubectl get deployment api -n learning -o yaml
kubectl get pods -n learning -l app=api
kubectl describe deployment api -n learning
kubectl get events -n learning --sort-by=.metadata.creationTimestamp`,
  "Apply success means the API accepted state, not that the application is ready. Follow through rollout and functional checks.",
  "API গ্রহণ করেছে মানেই app ready নয়। Rollout ও আসল কাজের পরীক্ষা শেষ করুন।",
);
put(
  "12-8",
  "Delete requests resource removal through the API. Finalizers can delay completion while a controller performs cleanup. Deleting an owned pod may cause its controller to create a replacement. Namespace deletion can cascade across many resources, and storage reclaim policies decide what happens to underlying volumes.",
  "Delete-এ resource সরানোর অনুরোধ যায়। Finalizer cleanup পর্যন্ত অপেক্ষা করাতে পারে। Deployment-এর pod মুছলে নতুনটি আসে। Namespace delete বড় cascade ঘটায়; storage policy আলাদা।",
  `kubectl config current-context
kubectl get -f deployment.yaml -n learning
kubectl delete --dry-run=server -f deployment.yaml -n learning
# Mutating example for a disposable learning namespace:
# kubectl delete -f deployment.yaml -n learning`,
  `kubectl get pods -n learning
kubectl get pvc -n learning
kubectl get deployment api -n learning -o yaml
# Inspect finalizers and ownership before force-removing anything.`,
  "Force deletion and stripping finalizers can orphan infrastructure. Diagnose the owning controller and cleanup dependency first.",
  "Force বা finalizer মুছলে বাইরের resource অনাথ থাকতে পারে। আগে controller ও cleanup বাধা দেখুন।",
);
put(
  "12-9",
  "Namespaces partition resource names and provide policy attachment points. They do not isolate cluster-scoped resources or replace network policies and authorization. Default service accounts and quotas differ by configuration. Explicit namespace flags reduce accidental operations in the current context’s default namespace.",
  "Namespace নামের আলাদা এলাকা ও policy-এর স্থান। Cluster-wide resource আলাদা থাকে; এটি network security বা authorization-এর বিকল্প নয়। Explicit -n ভুল জায়গায় কাজ কমায়।",
  `kubectl create namespace learning --dry-run=client -o yaml
kubectl create namespace learning
kubectl get namespace learning
kubectl get serviceaccounts -n learning
kubectl get resourcequota -n learning`,
  `kubectl auth can-i get pods -n learning
kubectl get networkpolicies -n learning
kubectl get limitranges -n learning
kubectl config view --minify
# Do not delete a shared namespace as routine cleanup.`,
  "Use namespace-specific RBAC, quotas, and network policies to build an actual boundary. Namespaces alone are organizational separation.",
  "আসল সীমা চাইলে RBAC, quota ও network policy দিন। Namespace একা মূলত সংগঠনের ভাগ।",
);
put(
  "12-10",
  "Scale changes desired replicas on a scalable controller. The scheduler still needs capacity and the application still needs healthy startup. HorizontalPodAutoscaler or GitOps may later overwrite a manual count. Stateful workloads can require storage and ordering constraints that a larger number alone cannot satisfy.",
  "Scale কপির চাহিদা বদলায়; resource ও startup ঠিক থাকা তবুও দরকার। HPA বা GitOps manual সংখ্যা পরে বদলে দিতে পারে। Stateful app-এ storage ও ordering-এর নিয়ম থাকে।",
  `kubectl get deployment api -n learning
kubectl get hpa -n learning
kubectl scale deployment/api --replicas=3 -n learning
kubectl rollout status deployment/api -n learning --timeout=120s
kubectl get pods -n learning -l app=api -o wide`,
  `kubectl describe deployment api -n learning
kubectl top pods -n learning
kubectl get events -n learning --sort-by=.metadata.creationTimestamp
kubectl get hpa -n learning -o yaml`,
  "Scale stateless services after measuring the constrained layer. More pods can exhaust a fixed database connection budget.",
  "বাধা মেপে stateless app বাড়ান। বেশি pod database-এর connection সীমা শেষ করে দিতে পারে।",
);
put(
  "12-11",
  "Rollout status watches controller progress toward the current desired template. Progress deadlines, available replicas, readiness, and surging capacity affect completion. A successful rollout is an infrastructure signal; it does not verify every business transaction or a backward-compatible database migration.",
  "Rollout status নতুন template ঠিকমতো ছড়াচ্ছে কি না দেখে। Readiness, available replica ও deadline গুরুত্বপূর্ণ। Rollout সফল হলেও business flow বা database compatibility আলাদা test লাগে।",
  `kubectl rollout status deployment/api -n learning --timeout=120s
kubectl rollout history deployment/api -n learning
kubectl get deployment api -n learning
kubectl get replicasets -n learning -l app=api`,
  `kubectl describe deployment api -n learning
kubectl get pods -n learning -l app=api
kubectl logs deployment/api -n learning --tail=50
kubectl get events -n learning --sort-by=.metadata.creationTimestamp`,
  "Set a finite timeout in CI and capture events/logs on failure. Do not automatically declare success because kubectl apply returned zero.",
  "CI-তে timeout দিন, ব্যর্থ হলে log ও event রাখুন। Apply-এর exit ০-ই পুরো প্রকাশের সফলতা নয়।",
);
put(
  "12-12",
  "Undo restores a retained controller revision’s pod template. It does not rewind databases, queues, external API effects, or user-generated files. Revision retention controls whether the desired old state is still available. The restored version must remain compatible with shared state and neighboring services.",
  "Undo আগের pod template ফেরায়, database বা বাইরের side effect নয়। পুরোনো revision রাখা না থাকলে ফেরা যাবে না। পুরোনো code-কে বর্তমান shared data-এর সাথে চলতে হবে।",
  `kubectl rollout history deployment/api -n learning
kubectl rollout history deployment/api --revision=2 -n learning
# Mutating rollback in an authorized learning environment:
# kubectl rollout undo deployment/api --to-revision=2 -n learning
kubectl get deployment api -n learning`,
  `kubectl rollout status deployment/api -n learning --timeout=120s
kubectl get pods -n learning -l app=api
kubectl logs deployment/api -n learning --tail=50
# Run a representative application smoke test after rollback.`,
  "Plan expand-contract migrations and artifact retention before a release. A rollback button cannot repair an incompatible irreversible schema change.",
  "প্রকাশের আগে compatible migration ও পুরোনো artifact রাখুন। Irreversible schema change rollback button দিয়ে ঠিক হয় না।",
);
put(
  "12-13",
  "Port forwarding makes a local listener and tunnels traffic through the Kubernetes API to a selected workload. It is tied to a chosen pod’s lifetime and local process. It bypasses the ordinary external ingress path, so success does not prove DNS, TLS, gateway, or load-balancer configuration is correct.",
  "Port-forward local listener থেকে API-এর পথে workload-এ tunnel করে। Pod বা command বন্ধ হলে tunnel থামে। এতে external ingress-এর স্বাভাবিক পথ bypass হয়; তাই সাইটের DNS/TLS ঠিক প্রমাণ হয় না।",
  `kubectl get svc api -n learning
kubectl port-forward --address=127.0.0.1 svc/api 8080:80 -n learning
# In another local terminal:
# curl --max-time 5 http://127.0.0.1:8080/health`,
  `kubectl auth can-i create pods/portforward -n learning
kubectl get pods -n learning -l app=api
kubectl describe svc api -n learning
# Reconnect the tunnel if the selected pod is replaced.`,
  "Keep local binding restrictive. Do not expose a database port-forward on every network interface or treat it as a durable production endpoint.",
  "Loopback-এ bind রাখুন। Database tunnel সব interface-এ খুলবেন না, production endpoint ভাববেন না।",
);
put(
  "12-14",
  "Resource usage is sampled by the metrics API and differs from configured requests and limits. CPU is commonly reported in millicores; memory is a working-set-style measurement. Missing metrics can mean collection or permission problems, not zero resource usage. A short snapshot can miss bursty startup and garbage-collection behavior.",
  "Usage metric request/limit-এর config নয়। CPU millicore-এ, memory নির্দিষ্ট sampled মাপে আসে। Metric না থাকা মানে শূন্য ব্যবহার নয়। ছোট snapshot-এ startup বা GC-এর spike বাদ পড়তে পারে।",
  `kubectl top pods -n learning
kubectl top pods -n learning --containers
kubectl top nodes
kubectl get pods -n learning -o wide`,
  `kubectl describe pod api-demo -n learning
kubectl get deployment api -n learning -o yaml
kubectl get hpa -n learning
kubectl api-resources --api-group=metrics.k8s.io`,
  "Compare sustained usage, requests, limits, throttling, and OOM events. Raising a memory limit without investigating a leak can postpone rather than solve an incident.",
  "Usage, request, limit, throttling ও OOM একসাথে দেখুন। Leak থাকলে শুধু limit বাড়ানো স্থায়ী সমাধান নয়।",
);
put(
  "12-15",
  "Edit retrieves a resource, opens an editor, and submits a changed version to the API. Concurrent updates can conflict, and admission rules can reject the result. Manual edits create drift when Git or another controller owns desired configuration. Prefer versioned manifests for changes that must be reproducible.",
  "Edit API-এর resource এনে editor-এ বদলে ফেরত দেয়। অন্য update conflict করতে পারে। GitOps চালালে manual edit নকশা থেকে drift বা পরে overwrite হয়। স্থায়ী পরিবর্তন source manifest-এ রাখুন।",
  `kubectl get deployment api -n learning -o yaml
kubectl diff -f deployment.yaml -n learning
# Interactive emergency edit, only when authorized:
# kubectl edit deployment/api -n learning
kubectl rollout history deployment/api -n learning`,
  `kubectl get deployment api -n learning -o yaml
kubectl rollout status deployment/api -n learning --timeout=120s
# Reconcile the emergency fix back into version-controlled manifests.
# Remove diagnostic exports containing credentials before sharing.`,
  "Record the incident reason and reconcile drift promptly. Do not assume an emergency edit survives the next GitOps reconciliation.",
  "জরুরি edit-এর কারণ লিখুন ও source-এ মিলিয়ে দিন। পরের GitOps sync-এ manual পরিবর্তন থাকবে ধরে নেবেন না।",
);
put(
  "12-16",
  "Labels are selectable metadata, not merely decoration. Service selectors, controllers, policy, and operational searches may depend on them. Some controller selectors are immutable after creation. Changing pod labels can remove the pod from serving traffic or make an operational filter miss it. Annotations serve non-selecting metadata use cases.",
  "Label শুধু লেখা নয়; Service, policy ও controller তা দিয়ে বাছতে পারে। কিছু selector পরে বদলানো যায় না। Pod label বদলে traffic বা filter থেকে সেটি সরে যেতে পারে।",
  `kubectl get pods -n learning --show-labels
kubectl get pods -n learning -l app=api
kubectl label pod api-demo team=learning -n learning
kubectl get pod api-demo -n learning --show-labels`,
  `kubectl describe svc api -n learning
kubectl get deployment api -n learning -o yaml
kubectl get pods -n learning -l 'app=api,team=learning'
# Review selectors before removing or overwriting labels.`,
  "Choose stable workload labels and separate operational metadata from routing selectors. A label change should be reviewed as a potentially functional change.",
  "Routing label স্থায়ী রাখুন। Label বদলানো কার্যকর আচরণের পরিবর্তনও হতে পারে, তাই review করুন।",
);
put(
  "12-17",
  "Copy moves data between the local filesystem and a container through a remote execution mechanism. Many kubectl cp paths require tar in the container. It targets one container instance, so copied files can disappear on replacement unless the destination is persistent storage. Copying is not a deployment or backup strategy by itself.",
  "Kubectl cp-তে অনেক ক্ষেত্রে container-এর tar দরকার। এটি একটি instance-এ লেখে; persistent storage না হলে pod বদলালে হারায়। Copy একা deployment বা backup নয়।",
  `kubectl get pods -n learning
printf 'demo report\n' > /tmp/mastery-report.txt
kubectl cp /tmp/mastery-report.txt learning/api-demo:/tmp/mastery-report.txt
kubectl exec api-demo -n learning -- cat /tmp/mastery-report.txt`,
  `kubectl cp learning/api-demo:/tmp/mastery-report.txt /tmp/mastery-report-copy.txt
cmp /tmp/mastery-report.txt /tmp/mastery-report-copy.txt
kubectl get pod api-demo -n learning -o yaml
# Use -c when selecting among multiple containers.`,
  "For production artifacts use image builds; for durable data use a deliberate storage/backup workflow. Validate paths and permissions before transferring sensitive files.",
  "Production binary image দিয়ে, স্থায়ী data storage/backup নিয়মে দিন। Sensitive file-এর path ও permission যাচাই করুন।",
);
put(
  "12-18",
  "Kubeconfig merges cluster, user, and context entries from configured sources. A context selects a cluster, identity, and optional namespace. Merely changing current-context can redirect every subsequent command, including destructive ones. User entries may include credential helpers or certificate material, so exports are security-sensitive.",
  "Context বলে কোন cluster, পরিচয় ও namespace চলবে। Current-context বদলালে পরের সব command অন্য জায়গায় যেতে পারে। Kubeconfig-এ certificate বা credential helper থাকতে পারে, তাই export গোপন হিসেবে দেখুন।",
  `kubectl config current-context
kubectl config get-contexts
kubectl config view --minify
kubectl cluster-info
kubectl auth can-i get pods -n learning`,
  `kubectl config get-clusters
kubectl config view -o jsonpath='{.contexts[*].name}'
# Switch only after verifying the intended target:
# kubectl config use-context learning-cluster
# Avoid --raw when sharing diagnostic output.`,
  "Never print raw credential material to prove access works. Test a narrow read operation and record context names without exposing secret values.",
  "Access কাজ করে প্রমাণ করতে raw secret দেখাবেন না। সীমিত read command ও context-এর নাম যথেষ্ট।",
);
put(
  "12-19",
  "Cluster-info reports control-plane and selected service addresses for the current context. It does not establish every node, pod, DNS route, or workload is healthy. A reachable API endpoint proves one boundary; application traffic can still fail elsewhere. Large diagnostic dumps may contain sensitive configuration and should be handled deliberately.",
  "Cluster-info বর্তমান context-এর control plane ও কিছু service-এর ঠিকানা দেয়। এতে সব node বা app healthy প্রমাণ হয় না। API পৌঁছানো একটি boundary; traffic-এর অন্য ধাপে সমস্যা থাকতে পারে।",
  `kubectl config current-context
kubectl cluster-info
kubectl get nodes
kubectl get pods -n kube-system
kubectl get --raw='/readyz'`,
  `kubectl version --client
kubectl auth can-i get nodes
kubectl get events -A --sort-by=.metadata.creationTimestamp
# Review and redact any diagnostic dump before sharing.`,
  "Separate API availability, cluster scheduling, service discovery, and application health checks. Broad admin access is not required for every useful diagnostic.",
  "API, scheduler, discovery ও app-এর health আলাদা পরীক্ষা করুন। সব diagnostic-এর জন্য admin অধিকার দরকার নয়।",
);
export default entries;
