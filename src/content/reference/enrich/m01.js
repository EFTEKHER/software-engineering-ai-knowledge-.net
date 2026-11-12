// Module 01 Linux: easy story, plain theory, steps, mistakes, 2028 tip, hands-on practice.
import { sh } from "./helpers";

export default {
  "ls -la": {
    s: ["Opening a cupboard and looking at everything inside, including the small items hidden at the back, with labels showing who owns each item and when it was last used. ls -la is that full look at a folder.", "আলমারি খুলে ভিতরের সবকিছু দেখা, পিছনে লুকানো ছোট জিনিসসহ, প্রতিটির মালিক ও শেষ ব্যবহারের লেবেলসহ। ls -la হলো একটি folder-এর সেই পূর্ণ দৃশ্য।"],
    t: ["ls lists files. -l shows details: permissions, owner, group, size and modified time. -a includes hidden files whose names start with a dot (.env, .git). Add -h for human sizes (4.0K, 2.1M) and -t to sort by time.", "ls file-এর তালিকা দেখায়। -l বিস্তারিত দেখায়: permission, মালিক, group, আকার ও পরিবর্তনের সময়। -a ডট দিয়ে শুরু লুকানো file (.env, .git) দেখায়। মানুষের পড়ার আকারে (4.0K, 2.1M) -h, সময় অনুযায়ী সাজাতে -t দিন।"],
    p: [["Run ls -la in your project.", "Project-এ ls -la চালান।"], ["Read the first column: d = directory, - = file, then rwx permissions.", "প্রথম column পড়ুন: d = directory, - = file, তারপর rwx permission।"], ["Use ls -lah to read sizes easily.", "সহজে আকার পড়তে ls -lah দিন।"], ["Use ls -lt | head to find recently changed files.", "সম্প্রতি বদলানো file খুঁজতে ls -lt | head দিন।"]],
    m: ["Forgetting -a and missing .env or .git; confusing the link count column with file count; parsing ls output in scripts (use find or globbing instead).", "-a ভুলে .env বা .git না দেখা; link count column-কে file সংখ্যা ভাবা; script-এ ls-এর output parse করা (find বা globbing ব্যবহার করুন)।"],
    f: ["Servers, containers and CI runners are Linux. Reading ls -la quickly lets you spot wrong permissions or a missing config file in seconds during an incident.", "Server, container ও CI runner সবই Linux। দ্রুত ls -la পড়তে পারলে সমস্যার সময় কয়েক সেকেন্ডে ভুল permission বা অনুপস্থিত config file ধরা যায়।"],
    x: [sh("Read every column of ls -la · প্রতিটি column পড়া", `mkdir -p demo && cd demo && echo "KEY=1" > .env && echo hi > app.txt && mkdir logs
# -l details  -a hidden files  -h human sizes
ls -lah
# Tip: ls -lt sorts newest first`, `total 16K
drwxr-xr-x 3 you you 4.0K Nov 12 10:00 .
drwxr-xr-x 9 you you 4.0K Nov 12 10:00 ..
-rw-r--r-- 1 you you    6 Nov 12 10:00 .env
-rw-r--r-- 1 you you    3 Nov 12 10:00 app.txt
drwxr-xr-x 2 you you 4.0K Nov 12 10:00 logs
# type+permissions | links | owner | group | size | modified | name`)],
  },
  "cd": {
    s: ["Walking from room to room in a building. cd is how you walk between folders; the folder you stand in is where your commands act.", "ভবনে এক ঘর থেকে আরেক ঘরে হাঁটার মতো। cd দিয়ে folder-এর মধ্যে হাঁটেন; আপনি যে folder-এ দাঁড়িয়ে, command সেখানেই কাজ করে।"],
    t: ["cd changes the current directory. Absolute paths start at / (cd /var/log); relative paths start from where you are (cd src). Shortcuts: cd (home), cd .. (up one), cd - (back to previous), ~ means your home folder.", "cd বর্তমান directory বদলায়। Absolute path / থেকে শুরু (cd /var/log); relative path আপনি যেখানে আছেন সেখান থেকে (cd src)। Shortcut: cd (home), cd .. (এক ধাপ উপরে), cd - (আগেরটায়), ~ মানে home folder।"],
    p: [["pwd to see where you are.", "কোথায় আছেন দেখতে pwd।"], ["cd ~/practice to go home-relative.", "Home থেকে যেতে cd ~/practice।"], ["Use Tab to auto-complete folder names.", "Folder-এর নাম auto-complete করতে Tab চাপুন।"], ["cd - to jump back and forth.", "আগে-পিছে যেতে cd -।"]],
    m: ["Spaces in names without quotes (cd My Folder fails; use cd \"My Folder\"); running destructive commands in the wrong folder; forgetting Linux paths are case-sensitive.", "Quote ছাড়া নামে space (cd My Folder ব্যর্থ; cd \"My Folder\" দিন); ভুল folder-এ ধ্বংসাত্মক command চালানো; Linux path case-sensitive ভুলে যাওয়া।"],
    f: ["In scripts and Dockerfiles, prefer absolute paths or WORKDIR so commands never depend on where someone happened to be standing.", "Script ও Dockerfile-এ absolute path বা WORKDIR ব্যবহার করুন, যাতে command কখনো কেউ কোথায় দাঁড়িয়ে ছিল তার উপর নির্ভর না করে।"],
    x: [sh("Move around with absolute and relative paths · path দিয়ে ঘোরা", `cd ~/practice
mkdir -p shop/src/api
cd shop/src/api && pwd
cd ../.. && pwd
cd - && pwd
cd && pwd`, `/home/you/practice/shop/src/api
/home/you/practice/shop
/home/you/practice/shop/src/api
/home/you/practice/shop/src/api
/home/you`)],
  },
  "pwd": {
    s: ["The 'You are here' dot on a shopping-mall map. pwd prints your exact location in the folder tree.", "Shopping mall-এর মানচিত্রে 'আপনি এখানে' বিন্দু। pwd folder-গাছে আপনার সঠিক অবস্থান দেখায়।"],
    t: ["pwd (print working directory) shows the absolute path of the current folder. Relative paths in commands are resolved from here. pwd -P shows the real path when you entered through a symbolic link.", "pwd (print working directory) বর্তমান folder-এর absolute path দেখায়। Command-এর relative path এখান থেকে হিসাব হয়। Symbolic link দিয়ে ঢুকলে pwd -P আসল path দেখায়।"],
    p: [["Run pwd before rm, mv or chmod.", "rm, mv বা chmod-এর আগে pwd চালান।"], ["Use $(pwd) in commands that need the full path.", "পূর্ণ path লাগে এমন command-এ $(pwd) দিন।"], ["Compare pwd and pwd -P inside a symlinked folder.", "Symlink-করা folder-এ pwd ও pwd -P তুলনা করুন।"], ["Show the path in your prompt so you always know.", "Prompt-এ path দেখান যাতে সবসময় জানেন।"]],
    m: ["Assuming you are in the project folder because the terminal was opened there yesterday; mixing up Windows (C:\\) and Linux (/) paths.", "গতকাল terminal সেখানে খোলা ছিল বলে project folder-এ আছেন ধরে নেওয়া; Windows (C:\\) ও Linux (/) path গুলিয়ে ফেলা।"],
    f: ["Docker volume mounts often use $(pwd): docker run -v \"$(pwd)\":/app. Knowing the current path avoids mounting the wrong folder into a container.", "Docker volume mount-এ প্রায়ই $(pwd) লাগে: docker run -v \"$(pwd)\":/app। বর্তমান path জানলে container-এ ভুল folder mount এড়ানো যায়।"],
    x: [sh("Use pwd inside other commands · অন্য command-এ pwd", `cd ~/practice/shop
pwd
echo "Mounting $(pwd)/src into the container"
ln -s ~/practice/shop/src ~/src-link && cd ~/src-link
pwd
pwd -P`, `/home/you/practice/shop
Mounting /home/you/practice/shop/src into the container
/home/you/src-link
/home/you/practice/shop/src`)],
  },
  "mkdir -p": {
    s: ["Building a shelf, then a box on the shelf, then a smaller box inside it, in one go. mkdir -p creates the whole chain of folders at once, and does not complain if some already exist.", "এক বারে তাক, তাকের উপর বাক্স, তার ভিতরে ছোট বাক্স বানানোর মতো। mkdir -p পুরো folder-শৃঙ্খল একবারে বানায়, আর কিছু আগে থেকে থাকলেও অভিযোগ করে না।"],
    t: ["mkdir creates a directory. -p creates missing parent directories and succeeds if the target already exists, which makes scripts safe to re-run. Brace expansion creates many folders at once: mkdir -p src/{api,web,tests}.", "mkdir একটি directory বানায়। -p অনুপস্থিত parent directory বানায় এবং লক্ষ্য আগে থেকে থাকলেও সফল হয়, ফলে script বারবার চালানো নিরাপদ। Brace expansion একবারে অনেক folder বানায়: mkdir -p src/{api,web,tests}।"],
    p: [["Plan the folder structure.", "Folder-এর কাঠামো পরিকল্পনা করুন।"], ["Run mkdir -p with braces for siblings.", "পাশাপাশি folder-এর জন্য brace দিয়ে mkdir -p চালান।"], ["Check with find . -type d.", "find . -type d দিয়ে দেখুন।"], ["Use mkdir -p in scripts so re-runs do not fail.", "Script-এ mkdir -p দিন যাতে বারবার চালালে ব্যর্থ না হয়।"]],
    m: ["Spaces in brace lists ({api, web} creates odd names); typos creating extra folders silently; forgetting quotes for names with spaces.", "Brace তালিকায় space ({api, web} অদ্ভুত নাম বানায়); টাইপো নীরবে অতিরিক্ত folder বানায়; space-সহ নামে quote ভুলে যাওয়া।"],
    f: ["Idempotent commands (safe to run twice) are the foundation of reliable automation in CI/CD and infrastructure as code. mkdir -p is a small first example of that mindset.", "Idempotent command (দুবার চালানো নিরাপদ) CI/CD ও infrastructure as code-এ নির্ভরযোগ্য automation-এর ভিত্তি। mkdir -p সেই মানসিকতার ছোট প্রথম উদাহরণ।"],
    x: [sh("Create a project skeleton in one line · এক লাইনে project কাঠামো", `mkdir -p shop/{src/{Api,Web,Core},tests/{Unit,Integration},docs}
# run it again: already exists, still no error
mkdir -p shop/src/Api
find shop -type d | sort`, `shop
shop/docs
shop/src
shop/src/Api
shop/src/Core
shop/src/Web
shop/tests
shop/tests/Integration
shop/tests/Unit`)],
  },
  "rm -rf": {
    s: ["A paper shredder with no undo button and no 'are you sure?'. rm -rf destroys folders and everything inside immediately. Powerful, and dangerous if pointed at the wrong drawer.", "Undo বোতাম ও 'নিশ্চিত?' ছাড়া কাগজ কাটার যন্ত্র। rm -rf folder ও ভিতরের সবকিছু সাথে সাথে ধ্বংস করে। শক্তিশালী, আর ভুল ড্রয়ারে তাক করলে বিপজ্জনক।"],
    t: ["rm deletes files; -r deletes folders recursively; -f forces without asking and ignores missing files. There is no recycle bin. Always check the path, prefer relative paths inside your project, and try ls on the same path first.", "rm file মোছে; -r folder recursively মোছে; -f জিজ্ঞেস না করে জোর করে এবং অনুপস্থিত file উপেক্ষা করে। Recycle bin নেই। সবসময় path দেখুন, project-এর ভিতরে relative path পছন্দ করুন, আর আগে একই path-এ ls চালান।"],
    p: [["pwd to confirm the folder.", "pwd দিয়ে folder নিশ্চিত করুন।"], ["ls the exact path you plan to delete.", "যে path মুছবেন ঠিক সেটিতে ls চালান।"], ["Use rm -ri for interactive confirmation while learning.", "শেখার সময় নিশ্চিতকরণের জন্য rm -ri ব্যবহার করুন।"], ["In scripts, guard variables: rm -rf \"${DIR:?not set}\"/build.", "Script-এ variable রক্ষা করুন: rm -rf \"${DIR:?not set}\"/build।"]],
    m: ["rm -rf $DIR/ when DIR is empty (becomes rm -rf /); a stray space: rm -rf ./ build deletes the current folder; running with sudo out of habit.", "DIR খালি থাকলে rm -rf $DIR/ (হয়ে যায় rm -rf /); একটি অতিরিক্ত space: rm -rf ./ build বর্তমান folder মুছে দেয়; অভ্যাসবশত sudo দিয়ে চালানো।"],
    f: ["Never let an AI agent run destructive commands without your approval. Most agent tools have permission settings; keep rm, git push --force and database drops on the 'ask me' list.", "আপনার অনুমোদন ছাড়া AI agent-কে ধ্বংসাত্মক command চালাতে দেবেন না। বেশিরভাগ agent tool-এ permission setting আছে; rm, git push --force ও database drop 'আমাকে জিজ্ঞেস করো' তালিকায় রাখুন।"],
    x: [sh("Delete safely with checks · যাচাই করে নিরাপদে মোছা", `mkdir -p build/tmp && touch build/tmp/a.o
ls build
rm -ri build          # answer y to each prompt while learning
DIR=""
rm -rf "\${DIR:?DIR is not set}/build"   # guard stops the disaster`, `tmp
rm: descend into directory 'build'? y
rm: descend into directory 'build/tmp'? y
rm: remove regular empty file 'build/tmp/a.o'? y
rm: remove directory 'build/tmp'? y
rm: remove directory 'build'? y
bash: DIR: DIR is not set`)],
  },
  "cp -r": {
    s: ["Photocopying a whole file folder, including every sheet inside, so you can scribble on the copy while the original stays clean.", "পুরো file folder photocopy করা, ভিতরের প্রতিটি পাতাসহ, যাতে কপিতে লিখতে পারেন আর মূলটি পরিষ্কার থাকে।"],
    t: ["cp copies files; -r copies directories recursively. -a (archive) also keeps permissions, times and symbolic links, which is best for backups. A trailing slash matters with some tools; with cp, copying src to an existing folder puts it inside that folder.", "cp file কপি করে; -r directory recursively কপি করে। -a (archive) permission, সময় ও symbolic link-ও রাখে, যা backup-এর জন্য সেরা। কিছু tool-এ শেষের slash গুরুত্বপূর্ণ; cp-তে src-কে বিদ্যমান folder-এ কপি করলে সেই folder-এর ভিতরে যায়।"],
    p: [["Copy a folder: cp -r src backup-src.", "Folder কপি: cp -r src backup-src।"], ["Preserve details: cp -a config config.bak.", "বিস্তারিত রেখে: cp -a config config.bak।"], ["Avoid overwriting: cp -n or cp -i.", "Overwrite এড়াতে: cp -n বা cp -i।"], ["Verify: diff -r src backup-src.", "যাচাই: diff -r src backup-src।"]],
    m: ["Forgetting -r and getting 'omitting directory'; silently overwriting newer files; copying huge node_modules or bin folders by accident.", "-r ভুলে 'omitting directory' পাওয়া; নীরবে নতুন file overwrite; ভুলে বিশাল node_modules বা bin folder কপি করা।"],
    f: ["For large or remote copies use rsync -a --delete, which only transfers changes. It is the tool behind many deploy and backup scripts.", "বড় বা দূরের কপির জন্য rsync -a --delete ব্যবহার করুন, যা শুধু পরিবর্তন পাঠায়। অনেক deploy ও backup script-এর পিছনে এই tool।"],
    x: [sh("Back up a config folder and verify · config backup ও যাচাই", `mkdir -p config && echo "port=8080" > config/app.conf
cp -a config config.bak
echo "port=9090" > config/app.conf
diff -r config.bak config`, `diff -r config.bak/app.conf config/app.conf
1c1
< port=8080
---
> port=9090`)],
  },
  "mv": {
    s: ["Moving a book to another shelf, or putting a new label on its spine. mv both moves and renames, without making a copy.", "একটি বই অন্য তাকে সরানো, বা পিঠে নতুন লেবেল লাগানো। mv কপি না করে সরায় ও নাম বদলায়, দুটোই করে।"],
    t: ["mv source target renames when target is a new name in the same folder, and moves when target is another folder. On the same disk it is instant because only the directory entry changes. If the target file exists it is overwritten unless you use -i or -n.", "mv source target একই folder-এ নতুন নাম হলে নাম বদলায়, অন্য folder হলে সরায়। একই disk-এ তাৎক্ষণিক, কারণ শুধু directory entry বদলায়। লক্ষ্য file থাকলে -i বা -n না দিলে overwrite হয়।"],
    p: [["Rename: mv draft.txt notes.txt.", "নাম বদল: mv draft.txt notes.txt।"], ["Move into a folder: mv notes.txt docs/.", "Folder-এ সরান: mv notes.txt docs/।"], ["Ask before overwrite: mv -i.", "Overwrite-এর আগে জিজ্ঞেস: mv -i।"], ["In a Git repo prefer git mv so history follows the file.", "Git repo-তে git mv পছন্দ করুন, যাতে ইতিহাস file-এর সাথে থাকে।"]],
    m: ["Overwriting an existing file without noticing; moving to a folder name with a typo, which renames the file instead; moving files out of a Git repository and losing track.", "অজান্তে বিদ্যমান file overwrite; টাইপো-সহ folder নামে সরানোয় file-এর নাম বদলে যাওয়া; Git repository থেকে file সরিয়ে হিসাব হারানো।"],
    f: ["Atomic rename is a classic deployment trick: build into a new folder, then mv a symlink to switch versions instantly with zero downtime.", "Atomic rename একটি প্রচলিত deployment কৌশল: নতুন folder-এ build করে symlink mv করে মুহূর্তে version বদলানো, কোনো downtime ছাড়া।"],
    x: [sh("Rename, move and avoid overwrites · নাম বদল, সরানো, overwrite এড়ানো", `echo a > draft.txt && mkdir -p docs && echo old > docs/notes.txt
mv draft.txt notes.txt
mv -n notes.txt docs/       # -n: do not overwrite existing docs/notes.txt
cat docs/notes.txt
mv -i notes.txt docs/       # asks first`, `old
mv: overwrite 'docs/notes.txt'? n`)],
  },
  "cat": {
    s: ["Reading a short letter aloud from start to end. cat prints a file's content to the screen in one go.", "একটি ছোট চিঠি শুরু থেকে শেষ পর্যন্ত জোরে পড়ার মতো। cat একবারে file-এর লেখা পর্দায় দেখায়।"],
    t: ["cat prints files and can join several (cat a b > c). For long files use less (scroll and search with /), head -n 20 (first lines) or tail -n 50 (last lines). tail -f follows a growing log file live.", "cat file দেখায় এবং কয়েকটি জোড়া দিতে পারে (cat a b > c)। লম্বা file-এ less (scroll ও / দিয়ে খোঁজ), head -n 20 (প্রথম লাইন) বা tail -n 50 (শেষ লাইন) দিন। tail -f বাড়তে থাকা log file সরাসরি অনুসরণ করে।"],
    p: [["Small file: cat appsettings.json.", "ছোট file: cat appsettings.json।"], ["Long file: less app.log, press q to quit.", "লম্বা file: less app.log, বের হতে q।"], ["Recent errors: tail -n 100 app.log.", "সাম্প্রতিক error: tail -n 100 app.log।"], ["Live logs: tail -f app.log.", "সরাসরি log: tail -f app.log।"]],
    m: ["cat-ing a 2 GB log and freezing the terminal; cat on binary files filling the screen with garbage; using cat file | grep when grep pattern file works directly.", "২ GB log cat করে terminal আটকে যাওয়া; binary file-এ cat করে পর্দা আবর্জনায় ভরা; grep pattern file সরাসরি চললেও cat file | grep ব্যবহার।"],
    f: ["Here-documents (cat <<EOF > file) are a quick way to write config files in scripts and Dockerfiles. You will see them in many setup guides.", "Here-document (cat <<EOF > file) script ও Dockerfile-এ config file লেখার দ্রুত উপায়। অনেক setup guide-এ দেখবেন।"],
    x: [sh("Write and read files quickly · দ্রুত file লেখা ও পড়া", `cat <<'EOF' > appsettings.json
{ "Logging": { "LogLevel": { "Default": "Information" } } }
EOF
cat appsettings.json
seq 1 1000 | sed 's/^/log line /' > app.log
head -n 2 app.log
tail -n 1 app.log`, `{ "Logging": { "LogLevel": { "Default": "Information" } } }
log line 1
log line 2
log line 1000`)],
  },
  "grep -r": {
    s: ["Using a highlighter to find every place a word appears in a stack of notebooks. grep -r searches all files in a folder for a pattern.", "একগাদা খাতায় একটি শব্দ যেখানে যেখানে আছে highlighter দিয়ে খোঁজার মতো। grep -r একটি folder-এর সব file-এ pattern খোঁজে।"],
    t: ["grep prints lines matching a pattern. -r searches folders, -n shows line numbers, -i ignores case, -l lists only file names, -w matches whole words, -E enables extended regular expressions. --include filters by file type and --exclude-dir skips folders like bin.", "grep pattern-এর সাথে মেলে এমন লাইন দেখায়। -r folder-এ খোঁজে, -n লাইন নম্বর, -i case উপেক্ষা, -l শুধু file-এর নাম, -w পুরো শব্দ মেলায়, -E extended regular expression চালু করে। --include file-এর ধরন অনুযায়ী filter আর --exclude-dir bin-এর মতো folder বাদ দেয়।"],
    p: [["Find a word with line numbers: grep -rn \"TODO\" src.", "লাইন নম্বরসহ শব্দ খুঁজুন: grep -rn \"TODO\" src।"], ["Limit to C# files: --include=\"*.cs\".", "C# file-এ সীমিত: --include=\"*.cs\"।"], ["Skip build output: --exclude-dir={bin,obj}.", "Build output বাদ: --exclude-dir={bin,obj}।"], ["Search logs for errors: grep -i \"error\" app.log | tail.", "Log-এ error খুঁজুন: grep -i \"error\" app.log | tail।"]],
    m: ["Searching node_modules or bin and drowning in results; forgetting quotes around patterns with spaces or special characters; not escaping dots in regex (a.b matches axb).", "node_modules বা bin-এ খুঁজে ফলে ডুবে যাওয়া; space বা বিশেষ অক্ষর-সহ pattern-এ quote ভুলে যাওয়া; regex-এ dot escape না করা (a.b মেলে axb-এর সাথে)।"],
    f: ["ripgrep (rg) is a faster grep that respects .gitignore; AI coding agents use it constantly to explore codebases. Learn both; grep is available everywhere.", "ripgrep (rg) দ্রুততর grep, যা .gitignore মানে; AI coding agent codebase খুঁজতে এটি সারাক্ষণ ব্যবহার করে। দুটোই শিখুন; grep সব জায়গায় পাওয়া যায়।"],
    x: [sh("Find code and errors fast · দ্রুত code ও error খোঁজা", `mkdir -p src/bin && printf 'var x = 1; // TODO validate\\n' > src/Order.cs && printf 'TODO in build\\n' > src/bin/out.txt
grep -rn "TODO" src --include="*.cs" --exclude-dir=bin
printf 'INFO start\\nERROR db timeout\\nWarn slow\\nerror retry failed\\n' > app.log
grep -in "error" app.log
grep -ic "error" app.log`, `src/Order.cs:1:var x = 1; // TODO validate
2:ERROR db timeout
4:error retry failed
2`)],
  },
  "find": {
    s: ["Asking a librarian: 'Show me every book over 500 pages added this month in the science section.' find searches folders by name, type, size and age.", "Librarian-কে বলা: 'এই মাসে বিজ্ঞান বিভাগে যোগ হওয়া ৫০০ পাতার বেশি সব বই দেখান।' find নাম, ধরন, আকার ও বয়স ধরে folder খোঁজে।"],
    t: ["find <where> <tests> <action>. Tests: -name \"*.log\", -type f or d, -size +100M, -mtime -1 (changed in last day). Actions: -print (default), -delete, -exec cmd {} +. Always run without -delete first to see what matches.", "find <কোথায়> <শর্ত> <কাজ>। শর্ত: -name \"*.log\", -type f বা d, -size +100M, -mtime -1 (গত এক দিনে বদলানো)। কাজ: -print (default), -delete, -exec cmd {} +। আগে সবসময় -delete ছাড়া চালিয়ে কী মেলে দেখুন।"],
    p: [["Find by name: find . -name \"*.csproj\".", "নাম ধরে: find . -name \"*.csproj\"।"], ["Big files: find / -type f -size +500M 2>/dev/null.", "বড় file: find / -type f -size +500M 2>/dev/null।"], ["Old logs: find logs -name \"*.log\" -mtime +7.", "পুরনো log: find logs -name \"*.log\" -mtime +7।"], ["Act on results: add -delete or -exec gzip {} + after checking.", "ফলের উপর কাজ: যাচাইয়ের পর -delete বা -exec gzip {} + দিন।"]],
    m: ["Putting -delete before the tests (it deletes everything); forgetting quotes so the shell expands *.log too early; searching / without 2>/dev/null and getting permission errors.", "শর্তের আগে -delete দেওয়া (সব মুছে ফেলে); quote ভুলে shell আগেই *.log expand করে; 2>/dev/null ছাড়া / খুঁজে permission error পাওয়া।"],
    f: ["Disk-full incidents are common in production. A find for large or old files is often the first diagnostic step before cleaning or adding log rotation.", "Production-এ disk ভরে যাওয়ার সমস্যা প্রচলিত। পরিষ্কার বা log rotation যোগ করার আগে বড় বা পুরনো file-এর find প্রায়ই প্রথম পরীক্ষা।"],
    x: [sh("Find and clean old logs safely · পুরনো log খুঁজে নিরাপদে পরিষ্কার", `mkdir -p logs && touch logs/today.log && touch -d "10 days ago" logs/old1.log logs/old2.log
find logs -name "*.log" -mtime +7          # preview first
find logs -name "*.log" -mtime +7 -delete
ls logs`, `logs/old1.log
logs/old2.log
today.log`)],
  },
  "chmod": {
    s: ["A house with three groups of keys: one for the owner, one for family, one for guests. Each key can allow reading the diary, writing in it, or entering the room. chmod decides who gets which keys.", "তিন দলের চাবিসহ একটি বাড়ি: মালিকের, পরিবারের, অতিথির। প্রতিটি চাবি ডায়েরি পড়া, লেখা বা ঘরে ঢোকার অনুমতি দিতে পারে। chmod ঠিক করে কে কোন চাবি পাবে।"],
    t: ["Permissions are r (read=4), w (write=2), x (execute=1) for user, group and others. 755 = rwx for owner, r-x for others (scripts, folders). 644 = rw for owner, r for others (normal files). 600 = only the owner can read/write (private keys, .env). chmod +x makes a script executable.", "Permission হলো user, group ও others-এর জন্য r (পড়া=4), w (লেখা=2), x (চালানো=1)। 755 = মালিকের rwx, অন্যদের r-x (script, folder)। 644 = মালিকের rw, অন্যদের r (সাধারণ file)। 600 = শুধু মালিক পড়তে/লিখতে পারে (private key, .env)। chmod +x script চালানোর যোগ্য করে।"],
    p: [["Check current permissions with ls -l.", "ls -l দিয়ে বর্তমান permission দেখুন।"], ["Make a script runnable: chmod +x deploy.sh.", "Script চালানোর যোগ্য করুন: chmod +x deploy.sh।"], ["Protect secrets: chmod 600 .env ~/.ssh/id_ed25519.", "Secret রক্ষা করুন: chmod 600 .env ~/.ssh/id_ed25519।"], ["Verify again with ls -l.", "আবার ls -l দিয়ে যাচাই করুন।"]],
    m: ["chmod 777 to 'fix' errors (anyone can modify; a security hole); chmod -R on a whole tree making every file executable; forgetting SSH refuses keys that are too open.", "error 'ঠিক' করতে chmod 777 (যে কেউ বদলাতে পারে; নিরাপত্তার ফাঁক); পুরো গাছে chmod -R দিয়ে প্রতিটি file executable করা; খুব খোলা key SSH প্রত্যাখ্যান করে ভুলে যাওয়া।"],
    f: ["Least privilege starts here. The same idea scales up to cloud IAM roles and AI tool permissions: give only what is needed.", "Least privilege এখান থেকেই শুরু। একই ধারণা cloud IAM role ও AI tool-এর permission পর্যন্ত বড় হয়: শুধু যা দরকার তাই দিন।"],
    x: [sh("Read and set permissions with numbers · সংখ্যা দিয়ে permission", `printf '#!/bin/bash\\necho deployed\\n' > deploy.sh && echo "DB_PASS=x" > .env
ls -l deploy.sh .env
chmod 755 deploy.sh && chmod 600 .env
ls -l deploy.sh .env
./deploy.sh`, `-rw-r--r-- 1 you you 10 Nov 12 10:00 .env
-rw-r--r-- 1 you you 26 Nov 12 10:00 deploy.sh
-rw------- 1 you you 10 Nov 12 10:00 .env
-rwxr-xr-x 1 you you 26 Nov 12 10:00 deploy.sh
deployed`)],
  },
  "chown": {
    s: ["Transferring a car's registration to its new owner. chown changes who owns a file or folder (and which group it belongs to).", "গাড়ির registration নতুন মালিকের নামে করা। chown বদলায় file বা folder-এর মালিক কে (আর কোন group-এর)।"],
    t: ["chown user:group path changes ownership; -R applies to a whole tree. Usually only root (sudo) can change owners. Web servers and services run as their own users (www-data, app), so their folders must be owned or readable by them.", "chown user:group path মালিকানা বদলায়; -R পুরো গাছে প্রয়োগ করে। সাধারণত শুধু root (sudo) মালিক বদলাতে পারে। Web server ও service নিজস্ব user (www-data, app) হিসেবে চলে, তাই তাদের folder তাদের মালিকানায় বা পড়ার যোগ্য হতে হয়।"],
    p: [["Check owner: ls -l /srv/app.", "মালিক দেখুন: ls -l /srv/app।"], ["Create a service user: sudo useradd -r app.", "Service user বানান: sudo useradd -r app।"], ["Transfer: sudo chown -R app:app /srv/app.", "হস্তান্তর: sudo chown -R app:app /srv/app।"], ["Verify the service can read and write its data folder.", "Service নিজের data folder পড়তে-লিখতে পারে যাচাই করুন।"]],
    m: ["Running everything as root instead of fixing ownership; chown -R on / or /usr by accident; Docker volumes owned by root so the app container (non-root) cannot write.", "মালিকানা ঠিক না করে সব root হিসেবে চালানো; ভুলে / বা /usr-এ chown -R; Docker volume root-এর মালিকানায় থাকায় app container (non-root) লিখতে না পারা।"],
    f: ["Modern containers run as non-root users for security. Expect 'permission denied' on mounted volumes and know that chown (or matching UIDs) is the fix.", "নিরাপত্তার জন্য আধুনিক container non-root user হিসেবে চলে। Mount করা volume-এ 'permission denied' আশা করুন এবং জানুন সমাধান chown (বা UID মেলানো)।"],
    x: [sh("Give a service its own folder · service-কে নিজস্ব folder", `sudo useradd -r -s /usr/sbin/nologin app
sudo mkdir -p /srv/shop/data
ls -ld /srv/shop/data
sudo chown -R app:app /srv/shop
ls -ld /srv/shop/data
sudo -u app touch /srv/shop/data/ok && echo "app can write"`, `drwxr-xr-x 2 root root 4096 Nov 12 10:00 /srv/shop/data
drwxr-xr-x 2 app app 4096 Nov 12 10:00 /srv/shop/data
app can write`)],
  },
  "tar -xzf": {
    s: ["Packing clothes into a vacuum bag to save space (compress), then unpacking at the destination (extract). tar bundles many files into one archive; -z squeezes it with gzip.", "জায়গা বাঁচাতে কাপড় vacuum bag-এ ভরা (compress), গন্তব্যে খোলা (extract)। tar অনেক file একটি archive-এ বাঁধে; -z gzip দিয়ে চাপে ছোট করে।"],
    t: ["Flags: c = create, x = extract, t = list, z = gzip, f = file name, v = verbose, -C = target folder. Create: tar -czf backup.tar.gz folder. List before extracting: tar -tzf file. Extract: tar -xzf file -C target.", "Flag: c = তৈরি, x = খোলা, t = তালিকা, z = gzip, f = file-এর নাম, v = বিস্তারিত, -C = লক্ষ্য folder। তৈরি: tar -czf backup.tar.gz folder। খোলার আগে তালিকা: tar -tzf file। খুলুন: tar -xzf file -C target।"],
    p: [["Create an archive: tar -czf logs.tar.gz logs/.", "Archive বানান: tar -czf logs.tar.gz logs/।"], ["Inspect: tar -tzf logs.tar.gz | head.", "দেখুন: tar -tzf logs.tar.gz | head।"], ["Extract into a folder: mkdir out && tar -xzf logs.tar.gz -C out.", "Folder-এ খুলুন: mkdir out && tar -xzf logs.tar.gz -C out।"], ["Check size: ls -lh logs.tar.gz.", "আকার দেখুন: ls -lh logs.tar.gz।"]],
    m: ["Extracting unknown archives into the current folder and overwriting files; forgetting f must be followed by the file name; extracting archives from the internet without listing them first.", "অজানা archive বর্তমান folder-এ খুলে file overwrite; f-এর পরে file-এর নাম দিতে হয় ভুলে যাওয়া; আগে তালিকা না দেখে internet-এর archive খোলা।"],
    f: ["Container images are layers of tar archives, and many CI artifacts and backups are .tar.gz files. Reading them confidently helps when debugging builds and releases.", "Container image tar archive-এর স্তর, আর অনেক CI artifact ও backup .tar.gz file। আত্মবিশ্বাসের সাথে পড়তে পারলে build ও release debug-এ সাহায্য হয়।"],
    x: [sh("Create, inspect and extract an archive · archive তৈরি, দেখা, খোলা", `mkdir -p release && echo v1 > release/app.dll && echo '{}' > release/appsettings.json
tar -czf release.tar.gz release
tar -tzf release.tar.gz
mkdir -p deploy && tar -xzf release.tar.gz -C deploy
ls deploy/release`, `release/
release/app.dll
release/appsettings.json
app.dll  appsettings.json`)],
  },
  "ps aux": {
    s: ["Looking at the attendance sheet of a factory: who is working, since when, and how much energy each person uses. ps aux lists every running process.", "কারখানার হাজিরা খাতা দেখার মতো: কে কাজ করছে, কখন থেকে, কে কতটা শক্তি খরচ করছে। ps aux প্রতিটি চলমান process-এর তালিকা দেয়।"],
    t: ["ps aux shows all processes with user, PID (process id), %CPU, %MEM, start time and command. Combine with grep to find one app, or sort: ps aux --sort=-%mem | head. The PID is what you pass to kill.", "ps aux সব process দেখায় user, PID (process id), %CPU, %MEM, শুরুর সময় ও command-সহ। একটি app খুঁজতে grep-এর সাথে মেলান, বা সাজান: ps aux --sort=-%mem | head। kill-এ PID দিতে হয়।"],
    p: [["List: ps aux | head.", "তালিকা: ps aux | head।"], ["Find your app: ps aux | grep [d]otnet.", "আপনার app খুঁজুন: ps aux | grep [d]otnet।"], ["Top memory users: ps aux --sort=-%mem | head -5.", "সবচেয়ে বেশি memory: ps aux --sort=-%mem | head -5।"], ["Get just the PID: pgrep -f MyApp.dll.", "শুধু PID: pgrep -f MyApp.dll।"]],
    m: ["grep matching itself in the results (use [d]otnet trick or pgrep); killing the wrong PID because two copies run; confusing VSZ/RSS units.", "ফলাফলে grep নিজেকেই মেলায় ([d]otnet কৌশল বা pgrep দিন); দুটি কপি চলায় ভুল PID kill করা; VSZ/RSS-এর একক গুলিয়ে ফেলা।"],
    f: ["In containers there is usually one main process (PID 1). Knowing ps helps you see whether your app is actually running inside a container when health checks fail.", "Container-এ সাধারণত একটি প্রধান process (PID 1) থাকে। Health check ব্যর্থ হলে container-এর ভিতরে app আসলেই চলছে কি না দেখতে ps জানা কাজে লাগে।"],
    x: [sh("Find a process and its resource use · process ও তার খরচ খোঁজা", `sleep 300 &
ps aux | grep [s]leep
pgrep -a sleep
ps -o pid,ppid,%cpu,%mem,etime,cmd -p $(pgrep sleep)`, `you   4242  0.0  0.0   8376   956 pts/0  S  10:00  0:00 sleep 300
4242 sleep 300
    PID    PPID %CPU %MEM     ELAPSED CMD
   4242    4100  0.0  0.0       00:05 sleep 300`)],
  },
  "top": {
    s: ["A live dashboard in a car showing speed, fuel and engine heat, updating every second. top is the live dashboard of your server.", "গাড়ির সরাসরি dashboard, যা প্রতি সেকেন্ডে গতি, জ্বালানি ও ইঞ্জিনের তাপ দেখায়। top আপনার server-এর সরাসরি dashboard।"],
    t: ["top shows load average, CPU usage, memory and swap, and a live list of processes sorted by CPU. Keys: P sorts by CPU, M by memory, k kills a process, q quits. Load average above the number of CPU cores means work is waiting. htop is a friendlier version.", "top load average, CPU ব্যবহার, memory ও swap, আর CPU অনুযায়ী সাজানো process-এর সরাসরি তালিকা দেখায়। Key: CPU-তে সাজাতে P, memory-তে M, process kill করতে k, বের হতে q। Load average CPU core-এর সংখ্যার বেশি হলে কাজ অপেক্ষায় আছে। htop আরও বন্ধুসুলভ সংস্করণ।"],
    p: [["Run top and read the header lines.", "top চালিয়ে উপরের লাইনগুলো পড়ুন।"], ["Press M to sort by memory, P for CPU.", "Memory-তে সাজাতে M, CPU-তে P চাপুন।"], ["Compare load average with nproc.", "nproc-এর সাথে load average তুলনা করুন।"], ["Take a snapshot for a report: top -b -n 1 | head -15.", "Report-এর জন্য snapshot: top -b -n 1 | head -15।"]],
    m: ["Panicking at high 'buff/cache' (Linux uses free memory as cache, which is fine); ignoring swap usage, which makes everything slow; killing processes from top without knowing what they are.", "উঁচু 'buff/cache' দেখে ঘাবড়ে যাওয়া (Linux খালি memory cache হিসেবে ব্যবহার করে, সমস্যা নেই); swap ব্যবহার উপেক্ষা, যা সব ধীর করে; না জেনে top থেকে process kill।"],
    f: ["top is the quick manual check; in production you watch the same numbers on dashboards (Prometheus, Grafana) with alerts. Learn what normal looks like so you can spot abnormal.", "top দ্রুত হাতে পরীক্ষা; production-এ একই সংখ্যা alert-সহ dashboard-এ (Prometheus, Grafana) দেখেন। স্বাভাবিক কেমন জানুন, যাতে অস্বাভাবিক ধরতে পারেন।"],
    x: [sh("Capture a one-shot snapshot · এক ঝলকের snapshot", `# How many CPU cores? Load above this number means waiting work
nproc
# -b batch mode, -n 1 one refresh: good for saving into a report
top -b -n 1 | head -8`, `4
top - 10:00:01 up 12 days,  3:04,  1 user,  load average: 0.52, 0.61, 0.58
Tasks: 187 total,   1 running, 186 sleeping,   0 stopped,   0 zombie
%Cpu(s):  6.1 us,  1.2 sy,  0.0 ni, 92.4 id,  0.2 wa,  0.0 hi,  0.1 si,  0.0 st
MiB Mem :   7841.2 total,   1203.5 free,   2410.8 used,   4226.9 buff/cache
MiB Swap:   2048.0 total,   2048.0 free,      0.0 used.   5120.3 avail Mem
    PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND
   1234 app       20   0 3.1g 210.4m  38.2m S   4.0   2.7   1:02.33 dotnet
# load 0.52 on 4 cores = mostly idle`)],
  },
  "kill -9": {
    s: ["Asking a guest politely to leave (SIGTERM) versus security carrying them out immediately (SIGKILL, -9). Try polite first; use force only when they will not respond.", "অতিথিকে ভদ্রভাবে চলে যেতে বলা (SIGTERM) বনাম নিরাপত্তারক্ষী সাথে সাথে বের করে দেওয়া (SIGKILL, -9)। আগে ভদ্রভাবে চেষ্টা করুন; সাড়া না দিলেই জোর।"],
    t: ["kill sends a signal to a process. Default SIGTERM (15) lets the app finish requests, close files and exit cleanly; ASP.NET Core handles it for graceful shutdown. SIGKILL (9) cannot be caught: the process dies instantly and may leave half-written data. Use kill PID, wait, then kill -9 only if needed.", "kill একটি process-এ signal পাঠায়। Default SIGTERM (15) app-কে request শেষ, file বন্ধ ও পরিষ্কারভাবে বের হতে দেয়; ASP.NET Core graceful shutdown-এ এটি সামলায়। SIGKILL (9) ধরা যায় না: process সাথে সাথে মরে, অর্ধেক লেখা data রেখে যেতে পারে। kill PID দিন, অপেক্ষা করুন, দরকার হলেই kill -9।"],
    p: [["Find the PID with pgrep -f.", "pgrep -f দিয়ে PID খুঁজুন।"], ["Send SIGTERM: kill <pid>.", "SIGTERM পাঠান: kill <pid>।"], ["Wait 10-30 seconds and check with ps.", "১০-৩০ সেকেন্ড অপেক্ষা করে ps দিয়ে দেখুন।"], ["Only if still alive: kill -9 <pid>.", "এখনো চললে তবেই: kill -9 <pid>।"]],
    m: ["Always using -9 first; killing PID 1 in a container or the database during writes; killing by name with pkill and hitting other users' processes.", "সবসময় প্রথমেই -9; container-এ PID 1 বা লেখার সময় database kill; pkill দিয়ে নাম ধরে kill করে অন্য user-এর process-এ আঘাত।"],
    f: ["Kubernetes sends SIGTERM, waits terminationGracePeriodSeconds, then SIGKILL. Apps that handle SIGTERM correctly deploy without dropped requests.", "Kubernetes SIGTERM পাঠায়, terminationGracePeriodSeconds অপেক্ষা করে, তারপর SIGKILL। যে app SIGTERM ঠিকমতো সামলায়, তা request না হারিয়ে deploy হয়।"],
    x: [sh("Graceful stop first, force only if needed · আগে ভদ্রভাবে, দরকারে জোর", `sleep 600 &
PID=$!
kill $PID            # SIGTERM
sleep 1; ps -p $PID >/dev/null && echo "still running" || echo "stopped gracefully"
bash -c 'trap "" TERM; sleep 600' &   # a process that ignores SIGTERM
PID=$!; kill $PID; sleep 1
ps -p $PID >/dev/null && kill -9 $PID && echo "forced with SIGKILL"`, `stopped gracefully
forced with SIGKILL`)],
  },
  "df -h": {
    s: ["Checking how full each water tank on the roof is. df -h shows how much space is used and free on every disk.", "ছাদের প্রতিটি পানির ট্যাংক কতটা ভরা দেখার মতো। df -h প্রতিটি disk-এ কত জায়গা ব্যবহৃত ও খালি দেখায়।"],
    t: ["df reports filesystem usage: size, used, available, use% and where it is mounted. -h prints human units. -i shows inodes (number of files), which can run out even when space is free. A disk above ~85% deserves attention; at 100% databases and logs stop writing.", "df filesystem-এর ব্যবহার দেখায়: আকার, ব্যবহৃত, খালি, use% আর কোথায় mount। -h মানুষের এককে দেখায়। -i inode (file-এর সংখ্যা) দেখায়, যা জায়গা থাকলেও শেষ হতে পারে। ~৮৫%-এর বেশি ভরা disk-এ মনোযোগ দিন; ১০০%-এ database ও log লেখা বন্ধ হয়।"],
    p: [["Run df -h.", "df -h চালান।"], ["Find the mount near 100%.", "১০০%-এর কাছের mount খুঁজুন।"], ["Check inodes with df -i.", "df -i দিয়ে inode দেখুন।"], ["Use du -sh to find what fills it (next lesson).", "কী ভরছে খুঁজতে du -sh দিন (পরের পাঠ)।"]],
    m: ["Looking at the wrong mount (data is on /var, not /); deleting a log file that a process still holds open, so space is not freed until restart; ignoring inode exhaustion.", "ভুল mount দেখা (data /var-এ, / নয়); process খোলা রাখা log file মুছে ফেলায় restart না হওয়া পর্যন্ত জায়গা খালি না হওয়া; inode শেষ হওয়া উপেক্ষা।"],
    f: ["Set alerts at 80-85% disk usage and configure log rotation. Full disks are one of the most common, most avoidable outages.", "Disk ব্যবহার ৮০-৮৫%-এ alert দিন এবং log rotation ঠিক করুন। Disk ভরে যাওয়া সবচেয়ে প্রচলিত ও সবচেয়ে এড়ানো যায় এমন বিভ্রাটগুলোর একটি।"],
    x: [sh("Spot the full disk · ভরা disk খোঁজা", `# -h human sizes, -x tmpfs hides memory-only filesystems
# Look at the Use% column first
df -h --output=source,size,used,avail,pcent,target -x tmpfs
df -i / | tail -1     # inodes can run out too`, `Filesystem      Size  Used Avail Use% Mounted on
/dev/sda1        40G   18G   20G  48% /
/dev/sdb1       200G  188G   12G  95% /var/lib/postgresql
/dev/sda1      2621440 412300 2209140   16% /
# 95% on the database disk: act now (clean, archive or grow the volume)`)],
  },
  "du -sh": {
    s: ["df told you the tank is almost full; du tells you which room is using the most water. du -sh measures how big each folder is.", "df বলেছে ট্যাংক প্রায় ভরা; du বলে কোন ঘর সবচেয়ে বেশি পানি ব্যবহার করছে। du -sh প্রতিটি folder কত বড় মাপে।"],
    t: ["du (disk usage) adds up file sizes. -s gives one total per argument, -h prints human units. du -sh * | sort -h shows the biggest items in a folder; repeat inside the biggest one to drill down. --max-depth=1 shows one level.", "du (disk usage) file-এর আকার যোগ করে। -s প্রতি argument-এ একটি মোট দেয়, -h মানুষের এককে দেখায়। du -sh * | sort -h একটি folder-এর সবচেয়ে বড় জিনিস দেখায়; সবচেয়ে বড়টার ভিতরে আবার চালিয়ে খুঁজুন। --max-depth=1 এক স্তর দেখায়।"],
    p: [["Start at the full mount: cd /var.", "ভরা mount থেকে শুরু: cd /var।"], ["sudo du -sh * 2>/dev/null | sort -h | tail.", "সবচেয়ে বড় folder দেখতে sudo du -sh * 2>/dev/null | sort -h | tail চালান।"], ["cd into the largest folder and repeat.", "সবচেয়ে বড় folder-এ cd করে আবার চালান।"], ["Clean or archive safely (logs, old builds, caches).", "নিরাপদে পরিষ্কার বা archive করুন (log, পুরনো build, cache)।"]],
    m: ["Running du on / and waiting forever (start narrower); forgetting hidden folders (* skips them; use .[!.]* too); deleting before understanding what the files are.", "/-এ du চালিয়ে অনন্তকাল অপেক্ষা (ছোট জায়গা থেকে শুরু); লুকানো folder ভুলে যাওয়া (* বাদ দেয়; .[!.]*-ও দিন); file কী না বুঝে মুছে ফেলা।"],
    f: ["Docker images and build caches quietly eat disk space on developer machines and CI runners. du plus docker system df finds them quickly.", "Developer machine ও CI runner-এ Docker image ও build cache নীরবে disk খায়। du ও docker system df দ্রুত খুঁজে দেয়।"],
    x: [sh("Drill down to the biggest folder · সবচেয়ে বড় folder খোঁজা", `# Step 1: biggest folders in /var
cd /var
sudo du -sh * 2>/dev/null | sort -h | tail -4
sudo du -sh log/* 2>/dev/null | sort -h | tail -2`, `120M	cache
640M	lib
2.1G	tmp
9.8G	log
1.2G	log/syslog.1
8.4G	log/shop-api.log
# One un-rotated app log is the culprit: rotate it with logrotate`)],
  },
  "ssh": {
    s: ["A secure tunnel into another building where only people with the right key card can enter. ssh opens an encrypted terminal on a remote server.", "অন্য ভবনে নিরাপদ সুড়ঙ্গ, যেখানে সঠিক key card ছাড়া কেউ ঢুকতে পারে না। ssh দূরের server-এ encrypted terminal খোলে।"],
    t: ["ssh user@host logs in to a remote machine over an encrypted connection. Key-based login is safer than passwords: generate a key pair (ssh-keygen -t ed25519), put the public key on the server (ssh-copy-id), keep the private key secret. ~/.ssh/config stores shortcuts. scp and rsync copy files over ssh.", "ssh user@host encrypted সংযোগে দূরের machine-এ login করে। Password-এর চেয়ে key দিয়ে login নিরাপদ: key pair বানান (ssh-keygen -t ed25519), public key server-এ রাখুন (ssh-copy-id), private key গোপন রাখুন। ~/.ssh/config shortcut রাখে। scp ও rsync ssh দিয়ে file কপি করে।"],
    p: [["Create a key: ssh-keygen -t ed25519 -C \"you@laptop\".", "Key বানান: ssh-keygen -t ed25519 -C \"you@laptop\"।"], ["Install it: ssh-copy-id deploy@server.", "Install করুন: ssh-copy-id deploy@server।"], ["Add a Host entry in ~/.ssh/config.", "~/.ssh/config-এ Host entry দিন।"], ["Connect: ssh shop-prod; run one command: ssh shop-prod uptime.", "যুক্ত হন: ssh shop-prod; একটি command: ssh shop-prod uptime।"]],
    m: ["Sharing private keys or committing them to Git; logging in as root with a password; ignoring host-key warnings (could be an attack); leaving port 22 open to the world without fail2ban or a firewall.", "Private key শেয়ার বা Git-এ commit; password দিয়ে root হিসেবে login; host-key সতর্কতা উপেক্ষা (আক্রমণ হতে পারে); fail2ban বা firewall ছাড়া port 22 সবার জন্য খোলা রাখা।"],
    f: ["Many teams now reach servers through bastions, SSO-based SSH certificates or cloud session managers instead of long-lived keys. The ideas (keys, least privilege, audit) stay the same.", "অনেক দল এখন দীর্ঘস্থায়ী key-এর বদলে bastion, SSO-ভিত্তিক SSH certificate বা cloud session manager দিয়ে server-এ যায়। ধারণা (key, least privilege, audit) একই থাকে।"],
    x: [sh("Key login with a config shortcut · config shortcut-সহ key login", `ssh-keygen -t ed25519 -C "asha@laptop" -f ~/.ssh/shop_ed25519 -N ""
cat >> ~/.ssh/config <<'EOF'
Host shop-prod
  HostName 203.0.113.10
  User deploy
  IdentityFile ~/.ssh/shop_ed25519
EOF
ssh-copy-id -i ~/.ssh/shop_ed25519.pub shop-prod
ssh shop-prod "uptime && df -h /"`, `Your identification has been saved in /home/you/.ssh/shop_ed25519
Number of key(s) added: 1
 10:00:01 up 12 days,  3:04,  0 users,  load average: 0.10, 0.12, 0.09
Filesystem      Size  Used Avail Use% Mounted on
/dev/sda1        40G   18G   20G  48% /`)],
  },
  "curl": {
    s: ["Sending a letter to a company's office and reading the reply, without opening a browser. curl talks to web servers and APIs from the terminal.", "Browser না খুলে একটি কোম্পানির অফিসে চিঠি পাঠিয়ে উত্তর পড়ার মতো। curl terminal থেকে web server ও API-র সাথে কথা বলে।"],
    t: ["curl URL sends a GET request. -i shows response headers, -X sets the method, -H adds headers, -d sends a body, -s hides progress, -o saves to a file, -L follows redirects. It is the fastest way to test an API, check a health endpoint or download a file.", "curl URL একটি GET request পাঠায়। -i response header দেখায়, -X method ঠিক করে, -H header যোগ করে, -d body পাঠায়, -s অগ্রগতি লুকায়, -o file-এ রাখে, -L redirect অনুসরণ করে। API test, health endpoint দেখা বা file নামানোর দ্রুততম উপায়।"],
    p: [["Check a site: curl -I https://example.com.", "Site দেখুন: curl -I https://example.com।"], ["Call an API: curl -s localhost:5000/api/products | jq.", "API ডাকুন: curl -s localhost:5000/api/products | jq।"], ["POST JSON with -H 'Content-Type: application/json' -d '{...}'.", "-H 'Content-Type: application/json' -d '{...}' দিয়ে JSON POST।"], ["Send a token: -H \"Authorization: Bearer $TOKEN\".", "Token পাঠান: -H \"Authorization: Bearer $TOKEN\"।"]],
    m: ["Using -k to ignore TLS errors in production scripts; putting real tokens in shell history (use variables or files); forgetting quotes around URLs with & characters.", "Production script-এ TLS error উপেক্ষা করতে -k; shell history-তে আসল token রাখা (variable বা file দিন); & থাকা URL-এ quote ভুলে যাওয়া।"],
    f: ["curl -w with timing variables gives a quick latency breakdown (DNS, connect, TLS, first byte). It is a handy first tool when someone says 'the API is slow'.", "সময়ের variable-সহ curl -w দ্রুত latency ভাগ দেখায় (DNS, connect, TLS, first byte)। কেউ 'API ধীর' বললে প্রথম সহজ tool এটি।"],
    x: [sh("Test an API and measure its timing · API test ও সময় মাপা", `# 1) latency breakdown of one request
curl -s -o /dev/null -w "status=%{http_code} dns=%{time_namelookup}s connect=%{time_connect}s tls=%{time_appconnect}s first_byte=%{time_starttransfer}s total=%{time_total}s\\n" https://example.com
curl -s -X POST https://httpbin.org/post -H "Content-Type: application/json" -d '{"name":"Asha"}' | jq .json
# 2) POST JSON and print only the echoed body`, `status=200 dns=0.012s connect=0.051s tls=0.124s first_byte=0.210s total=0.212s
{
  "name": "Asha"
}`)],
  },
};
