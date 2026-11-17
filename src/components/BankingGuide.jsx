import React, { useState } from "react";
import "./banking.css";
const sections = [
  ["map", "01", "Know your servers", "সার্ভার চিনুন"],
  ["daily", "02", "Your daily workflow", "প্রতিদিনের কাজ"],
  ["publish", "03", "Build one release", "Release বানান"],
  ["windows", "04", "Deploy on Windows", "Windows-এ deploy"],
  ["linux", "05", "Deploy on Linux", "Linux-এ deploy"],
  ["live", "06", "Test → live release", "Test থেকে live"],
  ["help", "07", "When something fails", "সমস্যা হলে"],
];
function Text({ en, bn, lang }) {
  return (
    <>
      {lang !== "বাংলা" && <p>{en}</p>}
      {lang !== "English" && (
        <p className="bank-bn" lang="bn">
          {bn}
        </p>
      )}
    </>
  );
}
function Code({ title, children }) {
  return (
    <figure className="bank-code">
      <figcaption>{title}</figcaption>
      <pre>
        <code>{children}</code>
      </pre>
    </figure>
  );
}
function Step({ n, title, en, bn, lang, children }) {
  return (
    <li className="bank-step">
      <span className="bank-step-number">{n}</span>
      <div>
        <h4>{title}</h4>
        <Text {...{ en, bn, lang }} />
        {children}
      </div>
    </li>
  );
}
export default function BankingGuide({ lang }) {
  const [os, setOs] = useState(
    window.location.hash === "#bank-linux" ? "linux" : "windows",
  );
  return (
    <div className="bank-guide">
      <header className="bank-hero">
        <span className="bank-kicker">FIRST JOB FIELD GUIDE · .NET</span>
        <h2>Small steps. Safe releases.</h2>
        <Text
          lang={lang}
          en="Test is your rehearsal. Live serves real customers. Learn the same steps on a practice server first."
          bn="Test হলো মহড়া। Live-এ আসল customer কাজ করেন। আগে practice server-এ একই ধাপ শিখুন।"
        />
        <div className="bank-route">
          <span>Your PC</span>
          <b>→</b>
          <span>Test / UAT</span>
          <b>→</b>
          <span>Approved release</span>
          <b>→</b>
          <span>Live</span>
        </div>
      </header>
      <nav className="bank-toc" aria-label="Banking guide sections">
        {sections.map(([id, n, en, bn]) => (
          <a
            key={id}
            href={"#bank-" + id}
            onClick={(event) => {
              event.preventDefault();
              setOs("both");
              window.history.replaceState(null, "", "#bank-" + id);
              requestAnimationFrame(() =>
                document
                  .getElementById("bank-" + id)
                  ?.scrollIntoView({ behavior: "smooth" }),
              );
            }}
          >
            {n} {lang === "বাংলা" ? bn : en}
          </a>
        ))}
      </nav>
      <section id="bank-map" className="bank-panel">
        <h3>01 / Know your servers · সার্ভার চিনুন</h3>
        <div className="bank-environments">
          {[
            [
              "LOCAL",
              "Your computer",
              "Write code and run unit tests. Use fake data.",
              "নিজের PC-তে code লিখুন ও unit test চালান। নকল data ব্যবহার করুন।",
            ],
            [
              "TEST / UAT",
              "Practice together",
              "QA checks behavior; business users accept the change in UAT. Use masked or synthetic data and sandbox integrations.",
              "QA test করেন, UAT-এ business user পরিবর্তন গ্রহণ করেন। Masked বা নকল data ও sandbox integration নিন।",
            ],
            [
              "LIVE / PRODUCTION",
              "Real banking service",
              "Real customers, money and audit records. Use your bank’s approved release process and named access.",
              "আসল customer, টাকা ও audit record। Bank-এর approved release process ও নিজের নির্ধারিত access ব্যবহার করুন।",
            ],
          ].map(([label, title, en, bn]) => (
            <article key={label}>
              <span>{label}</span>
              <h4>{title}</h4>
              <Text {...{ en, bn, lang }} />
            </article>
          ))}
        </div>
        <Text
          lang={lang}
          en="First ask your lead for the server names, VPN or jump-host route, application owner, test URL, log location and release runbook. An environment named Production is only a setting; the destination host and database decide whether you are touching live."
          bn="Lead-এর কাছে server name, VPN/jump host, application owner, test URL, log path ও release runbook নিন। শুধু Production setting দেখে নয়—host ও database মিলিয়ে environment নিশ্চিত করুন।"
        />
      </section>
      <section id="bank-daily" className="bank-panel">
        <h3>02 / A simple workday · সহজ দৈনিক কাজ</h3>
        <ol className="bank-steps">
          <Step
            n="1"
            title="Read the ticket"
            lang={lang}
            en="Understand the expected result. Ask which test account and acceptance criteria to use."
            bn="কী ফল দরকার বুঝুন। কোন test account ও acceptance criteria লাগবে জেনে নিন।"
          />
          <Step
            n="2"
            title="Code locally → test → pull request"
            lang={lang}
            en="Create a branch, make the smallest change, run tests and request code review. Keep credentials outside Git."
            bn="Branch বানান, ছোট change করুন, test চালান ও code review নিন। Password Git-এ রাখবেন না।"
          />
          <Step
            n="3"
            title="Verify on TEST / UAT"
            lang={lang}
            en="Let the approved pipeline deploy to test. Check success, validation, permission failures and duplicate requests with test data. Save the release ID and results in the ticket."
            bn="Approved pipeline দিয়ে test-এ deploy করুন। নকল data দিয়ে success, validation, permission ও duplicate request পরীক্ষা করুন। Ticket-এ release ID ও ফল রাখুন।"
          />
        </ol>
      </section>
      <section id="bank-publish" className="bank-panel">
        <h3>03 / Build one release · একবার build করুন</h3>
        <Text
          lang={lang}
          en="Example: a modern ASP.NET Core API named BankApi, targeting .NET 10 LTS. Use the SDK/runtime version your team supports. Older .NET Framework apps normally need Windows/IIS; these Linux steps are for modern .NET."
          bn="উদাহরণে BankApi নামে modern ASP.NET Core API ও .NET 10 LTS ধরা হয়েছে। Team-এর supported version নিন। পুরোনো .NET Framework সাধারণত Windows/IIS চায়; Linux ধাপ modern .NET-এর জন্য।"
        />
        <Code title="On your PC or CI runner · project folder">{`dotnet --info
# Run from the solution/repository folder.
dotnet restore BankApi.sln
dotnet test BankApi.sln -c Release
# Replace this path with your actual web project.
dotnet publish src/BankApi/BankApi.csproj -c Release --no-self-contained -o ./artifacts/BankApi`}</Code>
        <Text
          lang={lang}
          en="Restore downloads dependencies. Test checks behavior. Publish makes the deployment folder. Give this artifact a unique release ID and record its commit/checksum. Promote the same tested artifact to live. This example assumes a portable app; native dependencies can require separate Windows/Linux builds."
          bn="Restore dependency আনে, test আচরণ যাচাই করে, publish deploy করার folder বানায়। Release ID ও commit/checksum রাখুন। একই tested artifact live-এ নিন। Native dependency থাকলে OS অনুযায়ী আলাদা build লাগতে পারে।"
        />
        <Code title="Small health endpoint · Program.cs">{`var builder = WebApplication.CreateBuilder(args);
builder.Services.AddHealthChecks();
var app = builder.Build();
app.MapHealthChecks("/health/live");
app.Run();`}</Code>
        <Text
          lang={lang}
          en="A 200 response here means the app is running. It does not prove the database or payment integration works. Add an internal readiness check and an approved business smoke test separately."
          bn="এখানে 200 মানে app চলছে। Database বা payment ঠিক আছে তার প্রমাণ নয়। আলাদা internal readiness check ও approved business smoke test লাগবে।"
        />
      </section>
      <div
        className="bank-os-tabs"
        role="group"
        aria-label="Deployment operating system"
      >
        <button
          aria-pressed={os === "windows"}
          onClick={() => setOs("windows")}
        >
          Windows · IIS
        </button>
        <button aria-pressed={os === "linux"} onClick={() => setOs("linux")}>
          Linux · systemd + Nginx
        </button>
        <button aria-pressed={os === "both"} onClick={() => setOs("both")}>
          Show both
        </button>
      </div>
      {(os === "windows" || os === "both") && (
        <section id="bank-windows" className="bank-panel">
          <h3>04 / Windows deployment · IIS</h3>
          <Text
            lang={lang}
            en="Practice on a TEST Windows Server first. IIS is the web server; the .NET Hosting Bundle lets it host ASP.NET Core. Ask the server team to do setup steps if your account lacks permission."
            bn="আগে TEST Windows Server-এ করুন। IIS web server, Hosting Bundle ASP.NET Core চালাতে সাহায্য করে। Permission না থাকলে server team setup করবে।"
          />
          <ol className="bank-steps">
            <Step
              n="1"
              title="Prepare IIS once"
              lang={lang}
              en="Server team enables IIS, installs the matching supported .NET Hosting Bundle and restarts IIS/WAS as required by its installer. If IIS was installed later, repair the bundle. Confirm the installed runtime."
              bn="Server team IIS enable করবে, matching Hosting Bundle install করবে এবং installer অনুযায়ী IIS/WAS restart করবে। IIS পরে install হলে bundle repair করুন। Runtime মিলিয়ে নিন।"
            >
              <Code title="PowerShell · inspect installed runtimes">
                dotnet --list-runtimes
              </Code>
            </Step>
            <Step
              n="2"
              title="Create the site and its identity"
              lang={lang}
              en="In IIS Manager create a dedicated application pool (No Managed Code) and site. Use the approved service identity. Set the physical path to a versioned release folder, for example C:\Apps\BankApi\releases\r001. Grant only required read/execute and separate log-directory write permissions."
              bn="IIS Manager-এ আলাদা app pool (No Managed Code) ও site বানান। Approved service identity নিন। Versioned release folder-এ physical path দিন। দরকারমতো read/execute ও আলাদা log folder-এ write permission দিন।"
            />
            <Step
              n="3"
              title="Copy the published folder"
              lang={lang}
              en="Your release pipeline copies the complete publish output into the new folder, including web.config, DLLs and dependencies. Do not copy the source repository or overwrite running DLLs."
              bn="Release pipeline দিয়ে নতুন folder-এ সম্পূর্ণ publish output দিন—web.config, DLL ও dependency-সহ। Source repository বা চলমান DLL overwrite করবেন না।"
            />
            <Step
              n="4"
              title="Set configuration and HTTPS"
              lang={lang}
              en="Use Staging for test and Production for live through the managed IIS application configuration. Inject the correct database/secrets through your approved secret system. Add the site’s DNS/HTTPS binding and certificate; keep DetailedErrors off outside local development."
              bn="Managed IIS config-এ test-এর জন্য Staging, live-এর জন্য Production দিন। Approved secret system থেকে সঠিক database ও secret দিন। DNS, HTTPS binding ও certificate যোগ করুন; local ছাড়া detailed error বন্ধ রাখুন।"
            />
            <Step
              n="5"
              title="Switch, start and verify"
              lang={lang}
              en="During the release window, the operator drains traffic or uses the site’s approved maintenance method, points the site to the new folder and starts/recycles only this application pool. Check health, one read-only screen and application logs before returning traffic."
              bn="Release window-এ operator traffic drain বা approved maintenance পদ্ধতি নেবে, site নতুন folder-এ দেবে ও শুধু এই app pool start/recycle করবে। Traffic ফেরানোর আগে health, একটি read-only screen ও log দেখুন।"
            >
              <Code title="PowerShell · use your actual TEST hostname">{`$env:COMPUTERNAME
Invoke-WebRequest -Uri "https://bankapi-test.example.internal/health/live" -UseBasicParsing`}</Code>
            </Step>
          </ol>
          <Text
            lang={lang}
            en="If startup fails: check Windows Event Viewer → Application and the app logs. IIS 500.30 often means startup failure; 502.5 can mean the app process failed. Temporary stdout logs may help, but protect them and turn them off after diagnosis. Avoid a server-wide iisreset during normal releases."
            bn="Startup fail হলে Event Viewer → Application ও app log দেখুন। 500.30 প্রায়ই startup failure; 502.5 process failure হতে পারে। প্রয়োজনে সাময়িক stdout log নিন ও পরে বন্ধ করুন। সাধারণ release-এ পুরো server-এর iisreset করবেন না।"
          />
        </section>
      )}
      {(os === "linux" || os === "both") && (
        <section id="bank-linux" className="bank-panel">
          <h3>05 / Linux deployment · systemd + Nginx</h3>
          <Text
            lang={lang}
            en="Example layout for an Ubuntu-like TEST server. Package names and paths vary by distribution. The server team installs the matching ASP.NET Core runtime and Nginx, creates an unprivileged bankapi account and configures the firewall and TLS."
            bn="Ubuntu ধরনের TEST server-এর উদাহরণ। Distribution অনুযায়ী package/path বদলায়। Server team matching ASP.NET Core runtime, Nginx, সীমিত bankapi user, firewall ও TLS setup করবে।"
          />
          <ol className="bank-steps">
            <Step
              n="1"
              title="Confirm the host and runtime"
              lang={lang}
              en="Connect using the bank’s VPN/jump host and named SSH account. Verify this is TEST before making changes."
              bn="Bank-এর VPN/jump host ও নিজের SSH account দিয়ে ঢুকুন। Change-এর আগে এটি TEST কি না নিশ্চিত করুন।"
            >
              <Code title="Read-only checks · Linux shell">{`hostname
whoami
dotnet --list-runtimes
systemctl status bankapi --no-pager`}</Code>
            </Step>
            <Step
              n="2"
              title="Place the release in its own folder"
              lang={lang}
              en="The approved pipeline uploads the complete publish output to /srv/bankapi/releases/r001. Give the service account read/execute access and only the write locations it needs. Create /srv/bankapi/current as a symlink to this release. Keep the previous release for rollback."
              bn="Pipeline দিয়ে /srv/bankapi/releases/r001-এ publish output দিন। Service user-কে প্রয়োজনীয় permission দিন। /srv/bankapi/current symlink এই release-এ দিন। Rollback-এর জন্য পুরোনো release রাখুন।"
            />
            <Step
              n="3"
              title="Configure the service once"
              lang={lang}
              en="The server team creates the unit below at /etc/systemd/system/bankapi.service. Create the environment file through the approved secret system with tightly restricted access. This example listens only on localhost behind Nginx."
              bn="Server team নিচের unit file বানাবে। Approved secret system দিয়ে সীমিত permission-এ environment file তৈরি করুন। App শুধু localhost-এ শোনে, সামনে Nginx থাকে।"
            >
              <Code title="bankapi.service · TEST example">{`[Unit]
Description=BankApi ASP.NET Core service
After=network.target

[Service]
WorkingDirectory=/srv/bankapi/current
ExecStart=/usr/bin/dotnet /srv/bankapi/current/BankApi.dll
User=bankapi
Group=bankapi
Environment=ASPNETCORE_ENVIRONMENT=Staging
Environment=ASPNETCORE_URLS=http://127.0.0.1:5000
EnvironmentFile=/etc/bankapi/bankapi.env
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target`}</Code>
            </Step>
            <Step
              n="4"
              title="Put HTTPS in front"
              lang={lang}
              en="The server team adds a TLS Nginx site using the approved hostname and certificate. The location block below goes inside that HTTPS server block. Configure ASP.NET Core Forwarded Headers for the explicitly trusted local proxy before HTTPS redirects or authentication."
              bn="Server team approved hostname/certificate দিয়ে Nginx HTTPS site বানাবে। নিচের location HTTPS server block-এর ভিতরে দিন। HTTPS redirect/auth-এর আগে শুধু trusted local proxy-এর Forwarded Headers configure করুন।"
            >
              <Code title="Nginx fragment · inside an existing HTTPS server block">{`location / {
    proxy_pass http://127.0.0.1:5000;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}`}</Code>
            </Step>
            <Step
              n="5"
              title="Start and check on TEST"
              lang={lang}
              en="An authorized operator runs these after validating paths, configuration and permissions. daemon-reload is needed when the unit changes; enable --now enables startup at boot and starts the service. For later releases use the approved restart/rolling procedure."
              bn="Path, config ও permission মিলিয়ে authorized operator চালাবে। Unit বদলালে daemon-reload লাগে; enable --now boot-এ চালু রাখে ও এখন start করে। পরের release-এ approved restart/rolling পদ্ধতি নিন।"
            >
              <Code title="TEST server · operator commands">{`sudo systemctl daemon-reload
sudo systemctl enable --now bankapi
sudo nginx -t
# Reload only after nginx -t succeeds.
sudo systemctl reload nginx
curl --fail http://127.0.0.1:5000/health/live
curl --fail https://bankapi-test.example.internal/health/live
sudo journalctl -u bankapi -n 50 --no-pager`}</Code>
            </Step>
          </ol>
          <Text
            lang={lang}
            en="For the next release, upload a new versioned folder, drain traffic, switch current to that folder and restart bankapi through the release runbook. A single instance may have brief downtime; continuous service needs the team’s rolling or blue/green setup."
            bn="পরের release নতুন folder-এ দিন, traffic drain করুন, current বদলে runbook অনুযায়ী bankapi restart করুন। এক instance-এ সাময়িক downtime হতে পারে; uninterrupted service-এর জন্য rolling বা blue/green setup লাগে।"
          />
        </section>
      )}
      <section id="bank-live" className="bank-panel bank-live">
        <h3>06 / Test → live · ছোট release checklist</h3>
        <ol className="bank-steps">
          <Step
            n="1"
            title="Before: get the release ready"
            lang={lang}
            en="Record the reviewed commit and tested artifact ID. Attach QA/UAT results, dependency/config changes and migration plan. The release owner obtains the bank’s approval, schedule, backup/restore confirmation and rollback decision."
            bn="Reviewed commit, tested artifact ID, QA/UAT ফল, config ও migration plan লিখুন। Release owner bank-এর approval, schedule, backup/restore confirmation ও rollback decision নেবে।"
          />
          <Step
            n="2"
            title="Deploy: follow the approved runbook"
            lang={lang}
            en="The named operator confirms live host + database, then deploys the same artifact with live configuration. Use the approved pipeline and per-instance traffic drain. Do not apply database migrations automatically at app startup in this guide."
            bn="Named operator live host ও database মিলিয়ে একই artifact live config-সহ deploy করবে। Approved pipeline ও instance traffic drain ব্যবহার করুন। এই guide-এ startup-এ automatic database migration নেই।"
          />
          <Step
            n="3"
            title="After: prove it works"
            lang={lang}
            en="Check health/readiness, login with the approved procedure, one non-financial smoke test, error rate and latency. Check integrations and reconciliation evidence with the responsible team. Record who deployed, version, time and result. Do not create a real transfer just to test a release."
            bn="Health/readiness, approved login, non-financial smoke test, error rate ও latency দেখুন। সংশ্লিষ্ট team-এর সাথে integration ও reconciliation evidence মিলান। কে, কোন version, কখন ও কী ফল—লিখুন। Release test করতে আসল টাকা transfer নয়।"
          />
          <Step
            n="4"
            title="If unhealthy: stop and escalate"
            lang={lang}
            en="Notify the release owner and follow the rollback trigger. Returning to the previous folder/artifact is safe only if database/config changes remain compatible. App rollback does not undo transactions or schema changes; the DBA owns the approved recovery plan."
            bn="Release owner-কে জানান ও rollback trigger মানুন। Database/config compatible হলেই আগের artifact-এ ফেরা নিরাপদ। App rollback transaction বা schema change ফেরায় না; DBA approved recovery plan দেখবে।"
          />
        </ol>
      </section>
      <section id="bank-help" className="bank-panel">
        <h3>07 / When something fails · আগে কী দেখবেন</h3>
        <div className="bank-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Symptom</th>
                <th>First check</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>App will not start</td>
                <td>
                  Runtime version → config present → IIS/Event Viewer or
                  journalctl
                </td>
              </tr>
              <tr>
                <td>502 / 503</td>
                <td>App pool/service status → local health → proxy upstream</td>
              </tr>
              <tr>
                <td>Database timeout</td>
                <td>
                  Correct environment → network → database availability; involve
                  DBA
                </td>
              </tr>
              <tr>
                <td>401 / 403</td>
                <td>
                  Test user role → token/cookie settings → clock; keep
                  authorization enabled
                </td>
              </tr>
              <tr>
                <td>Payment status unclear</td>
                <td>
                  Trace/reference ID → approved status enquiry →
                  operations/reconciliation team; avoid blind retries
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <Text
          lang={lang}
          en="When asking for help, send: environment, release ID, time, symptom, correlation ID and a redacted error. Keep passwords, tokens, account numbers and customer data out of chat and screenshots. Never edit balances or run an unreviewed SQL fix."
          bn="Help চাইলে environment, release ID, সময়, symptom, correlation ID ও গোপন তথ্য বাদ দেওয়া error দিন। Password/token/customer data chat বা screenshot-এ দেবেন না। Balance edit বা unreviewed SQL fix নয়।"
        />
        <p className="bank-memory">
          Remember: identify → test → review → approve → deploy → verify →
          record.
        </p>
        <div className="bank-docs">
          <a
            href="https://learn.microsoft.com/aspnet/core/host-and-deploy/iis/"
            target="_blank"
            rel="noreferrer"
          >
            Microsoft: IIS deployment ↗
          </a>
          <a
            href="https://learn.microsoft.com/aspnet/core/host-and-deploy/linux-nginx"
            target="_blank"
            rel="noreferrer"
          >
            Microsoft: Linux + Nginx ↗
          </a>
        </div>
      </section>
    </div>
  );
}
