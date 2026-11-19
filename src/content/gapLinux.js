// Module 21 — Linux for .NET developers (topics the Linux Essentials module does not cover).
const cs = String.raw;

export const linuxRows = [
  {
    topic: "File System Hierarchy",
    en: "Linux has one tree that starts at / (root) — there are no C: or D: drives. Each top folder has a job: /etc holds configuration (Nginx sites, systemd units), /var/log holds logs, /var/www or /opt is where you usually deploy your published ASP.NET Core app, /home/<user> is each user's personal folder, /usr/bin holds installed programs like dotnet, and /tmp is temporary space cleared on reboot. SQL Server on Linux keeps its data in /var/opt/mssql.",
    bn: "Linux-এ একটি মাত্র গাছ, শুরু / (root) থেকে — C: বা D: drive নেই। প্রতিটি folder-এর কাজ আছে: /etc-এ configuration, /var/log-এ log, /var/www বা /opt-এ আপনার published ASP.NET Core app, /home-এ user-দের folder, /usr/bin-এ dotnet-এর মতো program, /tmp-এ অস্থায়ী ফাইল। Linux-এ SQL Server-এর data থাকে /var/opt/mssql-এ।",
    analogy: [
      "Linux is one big office building with labelled floors: /etc is the rules and settings room, /var/log is the diary room, /home is each employee's desk, /usr/bin is the tool store, /tmp is the scrap paper tray.",
      "Linux একটি বড় অফিস বিল্ডিং, প্রতিটি তলায় লেবেল: /etc নিয়ম ও settings-এর ঘর, /var/log ডায়েরির ঘর, /home প্রত্যেক কর্মীর টেবিল, /usr/bin যন্ত্রপাতির গুদাম, /tmp খসড়া কাগজের ট্রে।",
    ],
    flow: ["/ root", "/etc config", "/var/log logs", "/var/www app", "/home users", "/tmp scratch"],
    code: cs`var places = new (string Path, string Purpose)[] ~~ Important folders and what they are for / গুরুত্বপূর্ণ folder ও কাজ
{
    ("/etc", "configuration: nginx, systemd units"), ~~ Settings / সেটিংস
    ("/var/log", "log files"), ~~ Logs / লগ ফাইল
    ("/var/www", "published web apps (or /opt)"), ~~ Where you deploy / যেখানে deploy করেন
    ("/var/opt/mssql", "SQL Server on Linux data and logs"), ~~ Database files / database ফাইল
    ("/home", "personal folders of users"), ~~ Users / user-দের folder
    ("/usr/bin", "installed programs such as dotnet"), ~~ Programs / প্রোগ্রাম
    ("/tmp", "temporary files, cleared on reboot"), ~~ Scratch space / অস্থায়ী জায়গা
};
foreach (var p in places) ~~ Check each folder on this machine / এই মেশিনে প্রতিটি folder
    Console.WriteLine($"{p.Path,-15} exists={Directory.Exists(p.Path),-5} {p.Purpose}"); ~~ True on Linux, mostly False on Windows / Linux-এ True
Console.WriteLine($"This app runs from: {AppContext.BaseDirectory}"); ~~ Where your DLLs are / আপনার DLL কোথায়
Console.WriteLine($"Path separator here: '{Path.DirectorySeparatorChar}'"); ~~ '/' on Linux, '\' on Windows / Linux-এ '/'`,
    output: `/etc            exists=True  configuration: nginx, systemd units
/var/log        exists=True  log files
/var/www        exists=True  published web apps (or /opt)
/var/opt/mssql  exists=False SQL Server on Linux data and logs
/home           exists=True  personal folders of users
/usr/bin        exists=True  installed programs such as dotnet
/tmp            exists=True  temporary files, cleared on reboot
This app runs from: /home/rahim/Study/bin/Debug/net8.0/
Path separator here: '/'`,
    bash: `ls /                         # see the top-level folders
ls /etc/nginx/sites-enabled   # web server configuration
ls -la /var/log               # log files
sudo mkdir -p /var/www/myapi  # a home for your published API
dotnet publish -c Release -o /var/www/myapi`,
    caution:
      "Linux paths are case-sensitive: appsettings.json and AppSettings.json are different files. Never hard-code 'C:\\' or '\\' in C#; use Path.Combine and AppContext.BaseDirectory so the same code runs on Windows and Linux.",
    exercise: "Change the code to also show how many files are in /var/log, wrapped in try/catch for folders you are not allowed to read.",
  },
  {
    topic: "head, tail & less",
    en: "Logs are large, so you rarely open them whole. head shows the first lines of a file, tail shows the last lines, and tail -f keeps the file open and prints new lines as your ASP.NET Core app writes them — the first thing to run when production misbehaves. less opens a big file page by page with search (/ERROR, then n for next, q to quit) without loading it all into memory. For systemd services, journalctl -u myapi -f does the same as tail -f.",
    bn: "Log ফাইল বড়, তাই পুরোটা খোলা হয় না। head দেখায় প্রথম কয়েক লাইন, tail শেষ কয়েক লাইন, tail -f ফাইল খোলা রেখে নতুন লাইন আসামাত্র দেখায় — production-এ সমস্যা হলে প্রথম কাজ। less বড় ফাইল পাতা ধরে দেখায়, /ERROR লিখে খোঁজা যায়, q দিয়ে বের হন।",
    analogy: [
      "head reads the first page of a book, tail reads the last page, tail -f is watching a live news ticker, and less is flipping through a big book with a bookmark and an index.",
      "head বইয়ের প্রথম পাতা, tail শেষ পাতা, tail -f হলো live খবরের ticker দেখা, less হলো বড় বই bookmark ও সূচি দিয়ে উল্টানো।",
    ],
    flow: ["Big log file", "head: first lines", "tail: last lines", "tail -f: follow live", "less: scroll and search"],
    code: cs`string path = "app.log"; ~~ A sample log file / নমুনা log ফাইল
File.WriteAllLines(path, Enumerable.Range(1, 100).Select(i => $"10:{i % 60:D2} {(i % 25 == 0 ? "ERROR" : "INFO ")} request {i}")); ~~ Create 100 lines, every 25th is an error / ১০০ লাইন, প্রতি ২৫তমটি error
var lines = File.ReadLines(path); ~~ Lazy reading, like the tools: no full load / ধীরে পড়া, পুরোটা নয়
Console.WriteLine("head -n 2:"); ~~ First lines / প্রথম লাইন
foreach (var l in lines.Take(2)) Console.WriteLine("  " + l); ~~ Take = head / Take মানে head
Console.WriteLine("tail -n 2:"); ~~ Last lines / শেষ লাইন
foreach (var l in lines.TakeLast(2)) Console.WriteLine("  " + l); ~~ TakeLast = tail / TakeLast মানে tail
Console.WriteLine("grep ERROR:"); ~~ Search like less with /ERROR / less-এর /ERROR-এর মতো খোঁজা
foreach (var l in lines.Where(l => l.Contains("ERROR"))) Console.WriteLine("  " + l); ~~ Only error lines / শুধু error লাইন`,
    output: `head -n 2:
  10:01 INFO  request 1
  10:02 INFO  request 2
tail -n 2:
  10:39 INFO  request 99
  10:40 ERROR request 100
grep ERROR:
  10:25 ERROR request 25
  10:50 ERROR request 50
  10:15 ERROR request 75
  10:40 ERROR request 100`,
    bash: `head -n 20 /var/log/myapi/app.log     # first 20 lines
tail -n 50 /var/log/myapi/app.log     # last 50 lines
tail -f /var/log/myapi/app.log        # follow new lines live (Ctrl+C to stop)
tail -f app.log | grep --line-buffered ERROR   # follow only errors
less /var/log/myapi/app.log           # scroll; /ERROR to search, n next, G end, q quit
journalctl -u myapi -n 100 -f         # same idea for a systemd service
sudo tail -n 30 /var/opt/mssql/log/errorlog    # SQL Server on Linux error log`,
    caution:
      "Do not cat a 2 GB log into the terminal or open it in an editor on a production server — use tail, less or grep. Rotate logs (logrotate or Serilog rolling files) so they cannot fill the disk.",
    exercise: "Use TakeLast to print only the last 3 ERROR lines, like tail combined with grep.",
  },
  {
    topic: "Users & Groups",
    en: "Every file and process on Linux belongs to a user and a group. Users are listed in /etc/passwd and groups in /etc/group; root is the all-powerful administrator. Best practice is to run each app under its own unprivileged service user (for example myapi or www-data), make it the owner of only the folders it needs, and use sudo for admin tasks. SQL Server on Linux itself runs as the mssql user. In .NET, Environment.UserName tells you who your process runs as.",
    bn: "Linux-এ প্রতিটি ফাইল ও process কোনো user ও group-এর। User থাকে /etc/passwd-এ, group /etc/group-এ; root সর্বশক্তিমান admin। নিয়ম হলো প্রতিটি app নিজের সাধারণ service user-এ চালানো (যেমন myapi), শুধু দরকারি folder-এর মালিক করা, admin কাজে sudo ব্যবহার করা। Linux-এ SQL Server নিজে চলে mssql user হিসেবে।",
    analogy: [
      "An office: each employee (user) belongs to departments (groups). Keys are given per department, so the accounts team can open the accounts cupboard but not the server room. Root is the building owner with every key.",
      "অফিসে প্রতিটি কর্মী (user) কোনো বিভাগের (group) সদস্য। বিভাগ অনুযায়ী চাবি দেওয়া হয়, তাই হিসাব বিভাগ হিসাবের আলমারি খুলতে পারে, server room নয়। Root হলো বিল্ডিংয়ের মালিক, সব চাবি তার কাছে।",
    ],
    flow: ["Create service user", "Add to group", "chown app folder", "Run app as that user", "Least privilege"],
    code: cs`Console.WriteLine($"Running as user: {Environment.UserName}"); ~~ Which user owns this process / কোন user-এ চলছে
bool isRoot = Environment.UserName == "root"; ~~ Root check (simple version) / root কি না
if (isRoot) ~~ Warn about running as root / root হলে সতর্ক
    Console.WriteLine("Warning: run web apps as a dedicated non-root user such as myapi"); ~~ Least privilege / কম ক্ষমতা
if (!OperatingSystem.IsWindows() && File.Exists("/etc/passwd")) ~~ Unix-only APIs / শুধু Unix-এ
{
    UnixFileMode mode = File.GetUnixFileMode("/etc/passwd"); ~~ Read the owner/group/other permission bits / permission bit পড়ুন
    Console.WriteLine($"/etc/passwd permissions: {mode}"); ~~ Everyone can read, only root can write / সবাই পড়ে, root লেখে
    var serviceUsers = File.ReadLines("/etc/passwd").Select(l => l.Split(':')[0]).Where(u => u is "www-data" or "mssql" or "myapi"); ~~ Look for common service users / সাধারণ service user খুঁজুন
    Console.WriteLine($"Service users found: {string.Join(", ", serviceUsers)}"); ~~ Show them / দেখান
}`,
    output: `Running as user: rahim
/etc/passwd permissions: OtherRead, GroupRead, UserWrite, UserRead
Service users found: www-data, mssql`,
    bash: `whoami && id                            # current user, uid and groups
sudo adduser --system --group --no-create-home myapi   # service account, no login
sudo usermod -aG myapi deploy           # add user 'deploy' to group 'myapi'
groups deploy                           # check memberships
sudo chown -R myapi:myapi /var/www/myapi   # app folder belongs to the service user
grep myapi /etc/passwd                  # users live in /etc/passwd
ps -o user,pid,cmd -C sqlservr          # SQL Server runs as user 'mssql'`,
    caution:
      "Never run ASP.NET Core as root — a single bug would give an attacker the whole server. Removing a user from a group only takes effect at their next login. Linux users are separate from SQL Server logins; the app still needs its own least-privilege SQL login.",
    exercise: "Print the groups of the current user by reading /etc/group and finding lines that list your user name.",
  },
  {
    topic: "Pipes & Redirection",
    en: "Every Linux program has three streams: standard input (stdin), standard output (stdout) and standard error (stderr). A pipe | connects one program's stdout to the next program's stdin, so small tools combine into powerful one-liners (grep ERROR app.log | wc -l). Redirection sends output to files: > overwrites, >> appends, 2> captures only errors, 2>&1 merges errors into output. A .NET console app takes part too: Console.ReadLine reads stdin, Console.WriteLine writes stdout, Console.Error writes stderr.",
    bn: "প্রতিটি Linux program-এর তিনটি stream: stdin (input), stdout (output), stderr (error)। Pipe | একটির output পরেরটির input বানায়, তাই ছোট tool জুড়ে বড় কাজ হয় (grep ERROR app.log | wc -l)। > ফাইলে লেখে (মুছে), >> যোগ করে, 2> শুধু error ধরে, 2>&1 error-কেও output-এ মেলায়। .NET console app-ও এভাবে কাজ করে।",
    analogy: [
      "Pipes are like a factory assembly line: one worker cuts, passes to the next who paints, who passes to the next who packs. Redirection is choosing which box the finished items (or the rejected ones) go into.",
      "Pipe কারখানার assembly line-এর মতো: একজন কাটে, পরের জন রং করে, পরের জন প্যাক করে। Redirection মানে তৈরি জিনিস (বা বাতিলগুলো) কোন বাক্সে যাবে তা ঠিক করা।",
    ],
    flow: ["cat app.log", "| pipe", "dotnet LogCounter (stdin)", "stdout > report.txt", "stderr 2> errors.txt"],
    code: cs`int total = 0, errors = 0; ~~ Counters / গণনা
string? line; ~~ One line of input at a time / একবারে এক লাইন
while ((line = Console.ReadLine()) != null) ~~ Read stdin until the pipe closes / pipe বন্ধ না হওয়া পর্যন্ত পড়ুন
{
    total++; ~~ Count every line / প্রতিটি লাইন গুনুন
    if (line.Contains("ERROR")) errors++; ~~ Count errors / error গুনুন
}
Console.WriteLine($"lines={total} errors={errors}"); ~~ stdout: can be redirected with > / stdout: > দিয়ে ফাইলে
Console.Error.WriteLine("done (this goes to stderr; capture it with 2>)"); ~~ stderr: separate stream for diagnostics / stderr: আলাদা stream
return errors > 0 ? 1 : 0; ~~ Exit code lets scripts react: 0 success, 1 problems / exit code দিয়ে script বোঝে`,
    output: `$ printf "INFO a\nERROR b\nERROR c\n" | dotnet run
lines=3 errors=2
done (this goes to stderr; capture it with 2>)
$ echo $?
1`,
    setup:
      "Create a console project (dotnet new console -n LogCounter), replace Program.cs, then pipe text into it: cat app.log | dotnet run --project LogCounter. Without a pipe it waits for keyboard input; press Ctrl+D to finish.",
    bash: `grep ERROR app.log | wc -l               # | : count error lines
grep ERROR app.log | sort | uniq -c | sort -rn | head   # most frequent errors
dotnet run > out.txt                     # >  : stdout to a new file
dotnet run >> out.txt                    # >> : append
dotnet run 2> errors.txt                 # 2> : only stderr
dotnet run > all.txt 2>&1                # stdout and stderr together
cat app.log | dotnet run --project LogCounter && echo "clean" || echo "has errors"
sqlcmd -S localhost -U sa -Q "SELECT name FROM sys.databases" -h -1 | grep -v '^$' > dbs.txt`,
    caution:
      "> silently overwrites — double-check the file name. Write real results to stdout and messages or progress to stderr so pipes stay clean. In ASP.NET Core, logs go to stdout by default, which is exactly what Docker and systemd collect.",
    exercise: "Add a --errors-only argument: when present, print each ERROR line to stdout instead of the summary.",
  },
  {
    topic: "Package Managers",
    en: "A package manager installs, updates and removes software with its dependencies from trusted repositories. Ubuntu and Debian use apt, Red Hat family uses dnf, Alpine (small Docker images) uses apk. On Ubuntu you install the .NET SDK with 'sudo apt install dotnet-sdk-8.0', and Microsoft publishes SQL Server and its sqlcmd tools as apt packages too. NuGet is the same idea for .NET libraries: dotnet add package installs a library into your project.",
    bn: "Package manager বিশ্বস্ত repository থেকে software ও তার dependency install, update, remove করে। Ubuntu/Debian-এ apt, Red Hat-এ dnf, Alpine-এ apk। Ubuntu-তে 'sudo apt install dotnet-sdk-8.0' দিয়ে .NET SDK install হয়, SQL Server ও sqlcmd-ও apt package। .NET library-র জন্য একই কাজ করে NuGet: dotnet add package।",
    analogy: [
      "apt is a trusted app store for the whole server, like the Play Store for your phone: search, install, update everything with one command. NuGet is a smaller app store only for your project's code libraries.",
      "apt হলো পুরো server-এর বিশ্বস্ত app store, ফোনের Play Store-এর মতো: এক command-এ খোঁজা, install, update। NuGet শুধু আপনার project-এর library-র ছোট app store।",
    ],
    flow: ["apt update (refresh list)", "apt install package", "Dependencies resolved", "Verify version", "apt upgrade later"],
    code: cs`using System.Runtime.InteropServices; ~~ RuntimeInformation / OS ও runtime-এর তথ্য
Console.WriteLine($"OS: {RuntimeInformation.OSDescription}"); ~~ Which Linux distribution and version / কোন Linux
Console.WriteLine($".NET: {RuntimeInformation.FrameworkDescription}"); ~~ The runtime apt installed / apt যে runtime দিল
Console.WriteLine($"CPU architecture: {RuntimeInformation.OSArchitecture}"); ~~ x64 or Arm64 decides which package you need / কোন package লাগবে
string manager = File.Exists("/usr/bin/apt") ? "apt" : File.Exists("/usr/bin/dnf") ? "dnf" : File.Exists("/sbin/apk") ? "apk" : "unknown"; ~~ Detect the package manager / package manager খুঁজুন
Console.WriteLine($"Package manager: {manager}"); ~~ Show it / দেখান
Console.WriteLine("OS packages: apt install ... | .NET libraries: dotnet add package ..."); ~~ Two levels of packages / দুই স্তরের package`,
    output: `OS: Ubuntu 24.04.1 LTS
.NET: .NET 8.0.11
CPU architecture: X64
Package manager: apt
OS packages: apt install ... | .NET libraries: dotnet add package ...`,
    bash: `sudo apt update                          # refresh the package list first
apt search dotnet-sdk                    # find packages
sudo apt install -y dotnet-sdk-8.0       # .NET 8 SDK (Ubuntu 22.04+ built-in feed)
dotnet --info                            # verify
apt list --installed | grep dotnet       # what is installed
sudo apt upgrade -y                      # install security updates
sudo apt remove dotnet-sdk-8.0           # uninstall
# SQL Server tools come from Microsoft's apt repository (see Microsoft Learn: 'Install sqlcmd on Linux')
sudo apt install -y mssql-tools18 unixodbc-dev
dotnet add package Microsoft.Data.SqlClient   # NuGet: a library for your project`,
    caution:
      "Always run apt update before install. Do not mix .NET from Ubuntu's feed and Microsoft's feed on one machine — it causes 'SDK not found' errors. In Dockerfiles, prefer the official mcr.microsoft.com/dotnet images instead of installing .NET with apt.",
    exercise: "Run the program inside an Alpine Docker container (mcr.microsoft.com/dotnet/runtime:8.0-alpine). Which package manager does it detect?",
  },
  {
    topic: "Environment Variables",
    en: "Environment variables are named values every process inherits from its parent (shell, systemd, Docker). ASP.NET Core reads them automatically into configuration: ASPNETCORE_ENVIRONMENT picks appsettings.Production.json, ASPNETCORE_URLS sets the listening address, and a double underscore becomes a colon, so ConnectionStrings__Default overrides ConnectionStrings:Default from appsettings.json. This is how the same build gets a different SQL Server connection string in development and production.",
    bn: "Environment variable হলো নাম-দেওয়া মান, যা প্রতিটি process তার parent (shell, systemd, Docker) থেকে পায়। ASP.NET Core এগুলো স্বয়ংক্রিয়ভাবে configuration-এ পড়ে: ASPNETCORE_ENVIRONMENT কোন appsettings ফাইল নেবে ঠিক করে, double underscore (__) হয়ে যায় colon (:)। তাই ConnectionStrings__Default দিয়ে production-এর SQL Server connection string বদলানো যায়।",
    analogy: [
      "Environment variables are sticky notes your manager puts on your desk before you start: 'today you work in Production, the database is at 10.0.1.20'. The work (your code) stays the same; the notes change per office.",
      "Environment variable হলো কাজ শুরুর আগে ম্যানেজারের টেবিলে রাখা স্টিকি নোট: 'আজ Production, database 10.0.1.20-এ'। কাজ (কোড) একই থাকে, অফিস অনুযায়ী নোট বদলায়।",
    ],
    flow: ["Shell or systemd sets variables", "Process starts", "ASP.NET Core reads env", "__ becomes :", "Overrides appsettings.json"],
    code: cs`Environment.SetEnvironmentVariable("ConnectionStrings__Default", "Server=localhost;Database=ShopDb;Trusted_Connection=True;TrustServerCertificate=True"); ~~ Demo only: normally set by the shell, systemd or Docker / demo: আসলে বাইরে থেকে সেট হয়
string env = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Production"; ~~ ASP.NET Core assumes Production if unset / না থাকলে Production
string? cs = Environment.GetEnvironmentVariable("ConnectionStrings__Default"); ~~ What GetConnectionString("Default") would see / GetConnectionString যা দেখবে
Console.WriteLine($"Environment: {env}"); ~~ Which appsettings.{env}.json loads / কোন appsettings লোড হবে
Console.WriteLine($"Connection string found: {cs is not null}"); ~~ Never print the secret itself / secret নিজে print করবেন না
Console.WriteLine($"Config key: {"ConnectionStrings__Default".Replace("__", ":")}"); ~~ Double underscore maps to colon / __ মানে :
Console.WriteLine($"HOME = {Environment.GetEnvironmentVariable("HOME") ?? "(not set on Windows)"}"); ~~ A standard Linux variable / সাধারণ Linux variable`,
    output: `Environment: Production
Connection string found: True
Config key: ConnectionStrings:Default
HOME = /home/rahim`,
    bash: `echo $HOME                                    # read a variable
export ASPNETCORE_ENVIRONMENT=Development      # set for this shell session
export ConnectionStrings__Default="Server=10.0.1.20;Database=ShopDb;User Id=shop_app;Password=***;TrustServerCertificate=True"
printenv | grep ASPNETCORE                    # list matching variables
ASPNETCORE_URLS=http://0.0.0.0:5000 dotnet MyApi.dll   # set for one command only
unset ASPNETCORE_ENVIRONMENT                  # remove
# Permanent for a service: Environment= lines in /etc/systemd/system/myapi.service
# SQL Server on Linux setup also uses them: MSSQL_SA_PASSWORD, ACCEPT_EULA=Y, MSSQL_PID`,
    caution:
      "Environment variables are visible to anyone who can inspect the process (/proc/<pid>/environ, docker inspect). Do not commit them in scripts; prefer a secret store (Azure Key Vault, AWS Secrets Manager) or a root-only EnvironmentFile for production passwords.",
    exercise: "Read ASPNETCORE_URLS and print the port your API would listen on, defaulting to 5000 when it is missing.",
  },
  {
    topic: "cron Jobs",
    en: "cron runs commands on a schedule. Each line in a crontab has five time fields — minute, hour, day of month, month, day of week — followed by the command: '30 2 * * *' means every day at 02:30. A common .NET use is a small console app that cleans old files, sends a daily report or calls an API endpoint. The program should return exit code 0 on success and write its output to a log file. Inside SQL Server, the same job would be a SQL Server Agent job; inside ASP.NET Core you could use a BackgroundService, Hangfire or Quartz.NET.",
    bn: "cron নির্দিষ্ট সময়ে command চালায়। Crontab-এর প্রতিটি লাইনে পাঁচটি সময়ের ঘর — মিনিট, ঘণ্টা, মাসের দিন, মাস, সপ্তাহের দিন — তারপর command: '30 2 * * *' মানে প্রতিদিন রাত ২:৩০। .NET-এ সাধারণত একটি ছোট console app পুরনো ফাইল মোছে বা দৈনিক report পাঠায়। SQL Server-এ একই কাজ SQL Server Agent job দিয়ে হয়।",
    analogy: [
      "cron is the alarm clock on your phone with repeating alarms: 'every weekday at 7:00', 'every 5 minutes'. Instead of ringing, it runs your program.",
      "cron হলো ফোনের বারবার বাজা alarm: 'প্রতি কর্মদিবস সকাল ৭টা', 'প্রতি ৫ মিনিট'। বাজার বদলে আপনার program চালায়।",
    ],
    flow: ["crontab line", "Time fields match", "cron starts the command", "App does the job", "Exit code + log"],
    code: cs`string folder = Path.Combine(Path.GetTempPath(), "myapi-logs"); ~~ Folder this job cleans / যে folder পরিষ্কার হবে
Directory.CreateDirectory(folder); ~~ Make sure it exists (demo) / আছে কি না নিশ্চিত
string oldFile = Path.Combine(folder, "old.log"); ~~ A pretend old log / পুরনো log
File.WriteAllText(oldFile, "x"); ~~ Create it / তৈরি
File.SetLastWriteTimeUtc(oldFile, DateTime.UtcNow.AddDays(-10)); ~~ Make it 10 days old / ১০ দিন পুরনো
File.WriteAllText(Path.Combine(folder, "today.log"), "x"); ~~ A fresh log that must stay / নতুন log, থাকবে
var cutoff = DateTime.UtcNow.AddDays(-7); ~~ Keep only the last 7 days / শুধু ৭ দিনের
foreach (var f in new DirectoryInfo(folder).GetFiles("*.log").Where(x => x.LastWriteTimeUtc < cutoff)) ~~ Find old files / পুরনো ফাইল খুঁজুন
{
    Console.WriteLine($"{DateTime.UtcNow:yyyy-MM-dd HH:mm} deleting {f.Name}"); ~~ Log with a timestamp for >> cleanup.log / সময়সহ log
    f.Delete(); ~~ Remove it / মুছুন
}
Console.WriteLine($"Remaining: {string.Join(", ", Directory.GetFiles(folder).Select(f => Path.GetFileName(f)))}"); ~~ What is left / কী বাকি
return 0; ~~ Exit code 0 tells cron and scripts it succeeded / ০ মানে সফল`,
    output: `2026-11-19 02:30 deleting old.log
Remaining: today.log`,
    bash: `crontab -e        # edit your schedule
# ┌ minute ┌ hour ┌ day-of-month ┌ month ┌ day-of-week
  30        2      *              *       *     /usr/bin/dotnet /opt/cleanup/Cleanup.dll >> /var/log/cleanup.log 2>&1
  */5       *      *              *       *     curl -fsS http://localhost:5000/health > /dev/null || logger "myapi health check failed"
  0         8      *              *       1-5   /usr/bin/dotnet /opt/report/DailyReport.dll
crontab -l                      # list jobs
grep CRON /var/log/syslog       # did it run?`,
    sql: `-- The same nightly cleanup inside SQL Server (put this in a SQL Server Agent job step)
-- Delete in small batches so the log and locks stay small
WHILE 1 = 1
BEGIN
    DELETE TOP (5000) FROM dbo.RequestLogs
    WHERE CreatedAt < DATEADD(DAY, -30, SYSUTCDATETIME());
    IF @@ROWCOUNT = 0 BREAK;
END;`,
    caution:
      "cron runs with a tiny PATH and no ASPNETCORE variables — always use full paths (/usr/bin/dotnet) and set needed variables in the crontab. Times are the server's time zone. If a job can run longer than its interval, guard against overlap (flock) or use a queue.",
    exercise: "Write the crontab line that runs the cleanup every Sunday at 03:15 and appends both output and errors to /var/log/cleanup.log.",
  },
  {
    topic: "ping, ss & netstat",
    en: "These are the first network checks on a Linux server. ping tests whether a host answers at all (ICMP) and shows round-trip time. curl tests a real HTTP endpoint. ss (modern) or netstat (older) shows which ports are listening and which connections are open — for example, whether Kestrel listens on 5000 or SQL Server on 1433, and how many connections your app holds to the database. nc -zv tests a single TCP port. .NET has the same tools: Ping, TcpClient and IPGlobalProperties.",
    bn: "Linux server-এ প্রথম network পরীক্ষা এগুলো। ping দেখে host উত্তর দেয় কি না ও কত সময় লাগে। curl আসল HTTP endpoint পরীক্ষা করে। ss (নতুন) বা netstat (পুরনো) দেখায় কোন port শুনছে ও কোন connection খোলা — যেমন Kestrel 5000-এ বা SQL Server 1433-এ শুনছে কি না। .NET-এ একই কাজের জন্য Ping, TcpClient, IPGlobalProperties আছে।",
    analogy: [
      "ping is knocking on a door to see if anyone is home. Checking a port is ringing a specific flat's bell. ss is the building's visitor register showing who is talking to whom right now.",
      "ping হলো দরজায় টোকা দিয়ে দেখা কেউ আছে কি না। Port পরীক্ষা হলো নির্দিষ্ট ফ্ল্যাটের বেল বাজানো। ss হলো বিল্ডিংয়ের দর্শনার্থী খাতা — এখন কে কার সাথে কথা বলছে।",
    ],
    flow: ["ping host", "check TCP port 1433", "curl /health", "ss -tlnp: who listens", "ss -tn: open connections"],
    code: cs`using System.Net.NetworkInformation; ~~ Ping and IPGlobalProperties / ping ও port তালিকার class
using System.Net.Sockets; ~~ TcpClient and SocketException / TCP সংযোগ ও তার error
using var ping = new Ping(); ~~ Like the ping command / ping command-এর মতো
PingReply reply = await ping.SendPingAsync("127.0.0.1", 1000); ~~ Send one ICMP echo, wait up to 1 s / একটি ping, ১ সেকেন্ড অপেক্ষা
Console.WriteLine($"ping 127.0.0.1: {reply.Status} in {reply.RoundtripTime} ms"); ~~ Success and time / ফল ও সময়
using var tcp = new TcpClient(); ~~ Like nc -zv host 1433 / nc -zv-এর মতো
try ~~ A closed port throws / বন্ধ port-এ exception
{
    await tcp.ConnectAsync("127.0.0.1", 1433).WaitAsync(TimeSpan.FromSeconds(2)); ~~ Try SQL Server's port with a timeout / timeout-সহ 1433 চেষ্টা
    Console.WriteLine("Port 1433 open: SQL Server is listening"); ~~ Reachable / পৌঁছানো যায়
}
catch (Exception ex) when (ex is SocketException or TimeoutException) ~~ Refused or filtered / প্রত্যাখ্যান বা firewall
{
    Console.WriteLine($"Port 1433 closed or filtered: {ex.GetType().Name}"); ~~ Report the reason / কারণ জানান
}
var listening = IPGlobalProperties.GetIPGlobalProperties().GetActiveTcpListeners(); ~~ Like ss -tln / ss -tln-এর মতো
Console.WriteLine($"Listening TCP ports: {string.Join(", ", listening.Select(e => e.Port).Distinct().Order().Take(8))}"); ~~ First few listening ports / প্রথম কয়েকটি port`,
    output: `ping 127.0.0.1: Success in 0 ms
Port 1433 closed or filtered: SocketException
Listening TCP ports: 22, 53, 631, 5000
(results depend on what runs on your machine)`,
    bash: `ping -c 4 db.internal                    # reachable? (ICMP may be blocked by firewalls)
curl -fsS http://localhost:5000/health   # is the API answering HTTP?
ss -tlnp                                 # listening TCP ports and their programs
sudo netstat -tlnp                       # older equivalent (net-tools package)
ss -tn state established '( dport = :1433 )'   # open connections to SQL Server
nc -zv db.internal 1433                  # test one TCP port
ss -s                                    # summary: how many sockets in each state`,
    caution:
      "A failed ping does not prove the server is down — many networks block ICMP; test the real port. If ss shows Kestrel on 127.0.0.1:5000 only, other machines cannot reach it; use ASPNETCORE_URLS=http://0.0.0.0:5000 or put Nginx in front.",
    exercise: "Make the port check accept a host and port from command-line arguments, like nc -zv host port.",
  },
  {
    topic: "systemd & Services",
    en: "systemd starts and supervises long-running programs (services) on modern Linux. You describe your ASP.NET Core app in a unit file under /etc/systemd/system: which user runs it, the working directory, the ExecStart command, environment variables and Restart=always so it comes back after a crash or reboot. Then you use systemctl to start, stop, enable and check it, and journalctl to read its logs. With the Microsoft.Extensions.Hosting.Systemd package and UseSystemd(), the app tells systemd when it is ready and shuts down cleanly on SIGTERM. SQL Server on Linux runs as the mssql-server service the same way.",
    bn: "systemd আধুনিক Linux-এ দীর্ঘ সময় চলা program (service) চালু ও দেখাশোনা করে। /etc/systemd/system-এ unit file-এ লেখেন: কোন user চালাবে, কোন folder, ExecStart command, environment variable এবং Restart=always যাতে crash বা reboot-এর পর আবার চালু হয়। systemctl দিয়ে start/stop/enable, journalctl দিয়ে log। Linux-এ SQL Server-ও mssql-server service হিসেবে চলে।",
    analogy: [
      "systemd is the building's facility manager: it switches on the lifts and lights every morning (start at boot), restarts the generator if it stops (Restart=always), and keeps a logbook of everything (journalctl).",
      "systemd হলো বিল্ডিংয়ের facility manager: প্রতিদিন সকালে লিফট ও লাইট চালু করে (boot-এ start), জেনারেটর বন্ধ হলে আবার চালায় (Restart=always), সব কিছুর logbook রাখে (journalctl)।",
    ],
    flow: ["Write myapi.service", "systemctl daemon-reload", "enable --now", "Crash: auto restart", "journalctl -u myapi"],
    code: cs`var builder = WebApplication.CreateBuilder(args); ~~ Normal ASP.NET Core startup / সাধারণ ASP.NET Core শুরু
builder.Host.UseSystemd(); ~~ From Microsoft.Extensions.Hosting.Systemd: ready notification + journald-friendly logs / systemd-কে 'ready' জানায়
var app = builder.Build(); ~~ Build the app / app তৈরি
app.MapGet("/health", () => "Healthy"); ~~ Something for curl and monitoring to check / curl ও monitoring-এর জন্য
app.Lifetime.ApplicationStopping.Register(() => ~~ systemctl stop sends SIGTERM; this runs first / stop-এ SIGTERM আসে, এটা আগে চলে
    Console.WriteLine("SIGTERM received: finishing requests and closing SQL connections")); ~~ Graceful shutdown / সুন্দরভাবে বন্ধ
app.Run(); ~~ Runs until systemd stops it / systemd না থামানো পর্যন্ত চলে`,
    output: `$ sudo systemctl status myapi
● myapi.service - My ASP.NET Core API
     Active: active (running) since Thu 2026-11-19 10:00:01 +06; 5min ago
$ sudo systemctl stop myapi && journalctl -u myapi -n 2
myapi[2141]: SIGTERM received: finishing requests and closing SQL connections`,
    kind: "ASP.NET Core program",
    setup:
      "Create a web project (dotnet new web -n MyApi), run 'dotnet add package Microsoft.Extensions.Hosting.Systemd', replace Program.cs, publish with 'dotnet publish -c Release -o /var/www/myapi', then create the unit file shown in the next example.",
    bash: `sudo tee /etc/systemd/system/myapi.service > /dev/null <<'EOF'
[Unit]
Description=My ASP.NET Core API
After=network.target

[Service]
Type=notify
User=myapi
WorkingDirectory=/var/www/myapi
ExecStart=/usr/bin/dotnet /var/www/myapi/MyApi.dll
Restart=always
RestartSec=5
Environment=ASPNETCORE_ENVIRONMENT=Production
Environment=ASPNETCORE_URLS=http://127.0.0.1:5000

[Install]
WantedBy=multi-user.target
EOF
sudo systemctl daemon-reload          # read the new unit file
sudo systemctl enable --now myapi     # start now and at every boot
systemctl status myapi                # is it running?
journalctl -u myapi -f                # follow its logs
sudo systemctl restart myapi          # after deploying a new version
systemctl status mssql-server         # SQL Server on Linux is a systemd service too`,
    caution:
      "Type=notify only works with UseSystemd(); without it use Type=simple. Run daemon-reload after every unit file change. Keep the app on 127.0.0.1 behind Nginx, and put secrets in an EnvironmentFile readable only by root instead of inline Environment= lines.",
    exercise: "Change RestartSec to 10, crash the app on purpose (an endpoint that calls Environment.Exit(1)), and watch systemd restart it in journalctl.",
  },
];
