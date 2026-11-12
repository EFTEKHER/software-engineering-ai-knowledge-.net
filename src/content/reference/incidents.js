export const incidents = [
  [
    "Profile before changing architecture",
    "Slow APIs can be dominated by CPU, database waits, downstream calls, serialization, or queueing. Compare a representative slow trace with a normal one and isolate the largest span. Capture a safe baseline, change one bottleneck, and verify user-facing percentiles rather than a single fast request.",
    "Slow API-তে CPU, DB, দূরের call বা queueing—যেকোনোটি বাধা। Slow ও normal trace মিলিয়ে বড় span ধরুন। এক বাধা বদলে user-facing percentile দেখুন, শুধু একটি দ্রুত request নয়।",
    `dotnet-counters ps
dotnet-counters monitor --process-id YOUR_PID --counters System.Runtime
dotnet-trace collect --process-id YOUR_PID --duration 00:00:10
# Use authorized tools and protect trace files as diagnostic data.`,
  ],
  [
    "Inspect query shape and plans",
    "A slow query may read too many rows, use the wrong index, wait on locks, or execute once per entity. Check actual parameters and row counts alongside the plan. Reduce the result and remove N+1 round trips before assuming a larger database is required.",
    "Query বেশি row, ভুল index, lock বা N+1-এ ধীর। Actual parameter, row count ও plan দেখুন। আগে result ও round-trip কমান, তারপর DB বড় ভাবুন।",
    `EXPLAIN QUERY PLAN
SELECT Id, Name FROM Employees
WHERE DepartmentId = 1
ORDER BY Id LIMIT 20;
-- SQLite learning example; use your provider's actual-plan tooling.`,
  ],
  [
    "Cache with a freshness contract",
    "Read latency can benefit from caching when values are reused and a defined amount of staleness is acceptable. Measure hit ratio and miss amplification. A cache outage must have a bounded source fallback instead of sending every request to an already saturated database.",
    "বারবার একই ফল ও মানা যায় এমন staleness থাকলে cache। Hit ও miss-এ source-এর চাপ মাপুন। Cache fail-এ সব request একসাথে DB-তে ফেলবেন না।",
    `redis-cli --version
# On an authorized learning Redis instance:
# redis-cli INFO stats
# redis-cli INFO memory
# Never use MONITOR indiscriminately on production; it can expose data.`,
  ],
  [
    "Offload immutable media",
    "Large file responses consume origin bandwidth and connections. Object storage plus a CDN can reduce distance and origin pressure, but content type, cache key, access control, and retention still matter. Measure cache misses and transfer sizes before selecting compression or image transformations.",
    "বড় file origin bandwidth ও connection খায়। Object storage/CDN দূরত্ব কমায়, তবে type, key, permission ও retention লাগবে। Transfer ও cache miss মাপুন।",
    `curl -I --max-time 10 https://example.com
curl -sS --max-time 10 -o /dev/null -w 'bytes=%{size_download} time=%{time_total}\n' https://example.com
# Compare a real authorized asset's cache headers and size.
# Do not publish private user files as public cache content.`,
  ],
  [
    "Identify the limiting stage",
    "Growth is a capacity-planning problem rather than an automatic instruction to add servers. Trace CPU, request queues, database connections, external quotas, and tail latency. Scale the constrained stage and validate that downstream systems can absorb the new maximum demand.",
    "Growth-এ আগে CPU, queue, DB connection ও quota দেখুন। যেই ধাপে বাধা সেটি বাড়ান; downstream বাড়তি চাপ নিতে পারবে কি না test করুন।",
    `kubectl top pods -n learning
kubectl get hpa -n learning
kubectl describe deployment api -n learning
kubectl get events -n learning --sort-by=.metadata.creationTimestamp`,
  ],
  [
    "Distribute work only to healthy capacity",
    "A traffic spike can create uneven load, connection buildup, and cascading retry pressure. Verify backend health, routing policy, timeouts, and graceful draining. Load balancing does not create database capacity or make a slow downstream healthy.",
    "Spike-এ অসম চাপ, connection ও retry বাড়ে। Backend health, routing, timeout ও drain দেখুন। Balancer DB capacity বানায় না।",
    `kubectl get pods -n learning -l app=api -o wide
kubectl get endpointslices -n learning
kubectl top pods -n learning
# Inspect gateway target-health and retry metrics in your actual platform.`,
  ],
  [
    "Protect quotas and expensive work",
    "Too many requests can be legitimate peaks, abusive clients, or a runaway retry loop. Partition limits by a trustworthy identity and bound queues before expensive work. Return observable overload signals and document whether a global limiter fails open or closed.",
    "বেশি request ভাল user, abuse বা retry loop হতে পারে। বিশ্বস্ত identity-তে limit ও expensive কাজের আগে queue সীমা দিন। Overload signal ও fail policy স্পষ্ট।",
    `curl --max-time 5 -i https://example.com
# Inspect 429 and Retry-After on your authorized test endpoint.
# Generate load only in a controlled environment with agreed limits.
# Compare limiter rejections with upstream and database saturation.`,
  ],
  [
    "Separate read scaling from consistency",
    "Read replicas help read-heavy traffic when queries can tolerate their visibility guarantees. Measure replication lag and identify read-after-write flows that need stronger routing. Replication is not a substitute for correcting an unbounded query.",
    "Read replica-তে lag মানতে হয়। নিজের write সঙ্গে দেখা দরকার এমন flow আলাদা route করুন। Unbounded query-এর বদলি replica নয়।",
    `SELECT DepartmentId, COUNT(*) FROM Employees GROUP BY DepartmentId;
EXPLAIN QUERY PLAN SELECT * FROM Employees WHERE DepartmentId = 1;
-- These local queries inspect workload shape, not a real replica.
-- Check engine-specific replication lag and consistency metrics separately.`,
  ],
  [
    "Partition only with an operational plan",
    "A write-heavy database can be limited by contention, logging, indexes, or one hot key. Fix those causes before sharding. If partitioning is necessary, choose locality, global uniqueness, resharding, transaction, and restore rules so scale does not silently break correctness.",
    "Write-heavy-তে lock, WAL, index বা hot key বাধা হতে পারে। Shard-এর আগে এগুলো ঠিক করুন। Shard লাগলে key, uniqueness, migration ও restore স্পষ্ট।",
    `EXPLAIN QUERY PLAN SELECT * FROM Employees WHERE Id = 1;
SELECT DepartmentId, COUNT(*) AS RowsPerKey FROM Employees GROUP BY DepartmentId;
-- Inspect hot-key skew with authorized production metrics.
-- Do not repartition a live database from a toy modulo script.`,
  ],
  [
    "Bound and shape responses",
    "Large payloads increase transfer, allocation, serialization time, and client parsing work. Project only needed fields and paginate with a stable order. Compression helps text but is not a substitute for reducing data and may waste CPU for already-compressed media.",
    "বড় payload-এ transfer, allocation ও parsing বাড়ে। দরকারি field ও stable pagination দিন। Compression data কম চাওয়ার বিকল্প নয়, compressed media-তে CPU নষ্ট হতে পারে।",
    `SELECT Id, Name FROM Employees ORDER BY Id LIMIT 20;
SELECT COUNT(*) AS Total FROM Employees;
-- Compare narrow projection with an unrestricted export.
-- Measure serialized bytes and client parsing, not just query time.`,
  ],
  [
    "Make asynchronous completion explicit",
    "Long tasks should not keep request resources indefinitely. Accept durable work, return an operation identity, and expose progress/result. A background thread without durable state can lose work on restart; retries and cancellation require an explicit product contract.",
    "দীর্ঘ কাজের জন্য durable job, operation id ও progress দিন। শুধু background thread restart-এ হারায়। Retry ও cancel-এর অর্থ ঠিক করুন।",
    `kubectl logs deployment/api -n learning --tail=50
kubectl top pods -n learning
# Inspect queue age, worker concurrency, retries, and completion records.
# A 202 response means accepted, not already completed.`,
  ],
  [
    "Retry within a deadline and idempotent contract",
    "Temporary failures justify retry only when a later attempt can help and repeated effects are safe. Exponential backoff with jitter avoids synchronized clients. A deadline bounds total work across attempts; retrying at every service layer can multiply load exponentially.",
    "পরে লাভ হবে ও effect নিরাপদ থাকলেই retry। Backoff+jitter একসাথে ধাক্কা কমায়। মোট deadline দিন; প্রতিটি layer retry করলে চাপ বহুগুণ হয়।",
    `curl --connect-timeout 2 --max-time 5 -I https://example.com
# Check exact status, timeout stage, and request identity.
# Reproduce transient failures only in the learning environment.
# Correlate retries with the downstream error and saturation window.`,
  ],
  [
    "Deduplicate the business effect",
    "Duplicate requests can arise from user retries, network uncertainty, or at-least-once delivery. Persist an idempotency key, request fingerprint, state, and result at the effect boundary. Reusing a key for different input must not silently return an unrelated outcome.",
    "User retry ও network uncertainty-তে duplicate আসে। Effect boundary-তে key, fingerprint, state ও result রাখুন। একই key-তে ভিন্ন input হলে আগের unrelated result ফেরাবেন না।",
    `SELECT Id, Name FROM Employees WHERE Id = 1;
-- A real idempotency table needs a UNIQUE key and atomic effect/result update.
-- Simulate duplicate calls using disposable data and compare effect count.
-- Do not infer deduplication from identical HTTP response text alone.`,
  ],
  [
    "Stop cascading dependency calls",
    "A failing service can consume callers through long waits and repeated retries. Apply timeouts, bounded retries, concurrency isolation, and circuit breaking with distinct purposes. Recovery probes should be limited and measured, not a sudden reopening to all accumulated traffic.",
    "Failing service অপেক্ষা ও retry-তে caller খায়। Timeout, bounded retry, isolation ও breaker আলাদা দিন। Recovery-তে সীমিত probe, জমে থাকা সব traffic একবারে নয়।",
    `kubectl get pods -n learning
kubectl logs deployment/api -n learning --since=10m
kubectl top pods -n learning
# Correlate timeout, retry, breaker-state, and queue metrics.`,
  ],
  [
    "Remove shared failure assumptions",
    "Redundant replicas only help when they do not share the same critical failure domain. Consider zones, storage, credentials, network, control plane, and configuration. Failover needs clear ownership and fencing; an untested standby is not a verified recovery capability.",
    "Replica এক zone/storage/credential-এর উপর থাকলে একসাথে fail হতে পারে। Failure domain ও leader/fencing দেখুন। পরীক্ষা না করা standby recovery-এর প্রমাণ নয়।",
    `kubectl get pods -n learning -l app=api -o wide
kubectl get nodes --show-labels
kubectl get deployment api -n learning -o yaml
# Check placement, disruption budget, storage, and dependency redundancy.`,
  ],
  [
    "Budget pooled connections across replicas",
    "A per-process pool can multiply into thousands of database sessions after scale-out. Leaked transactions and slow queries hold slots longer. Set pool bounds from database capacity, measure wait time, and dispose connections/contexts correctly. A proxy can help connection management but cannot repair incorrect transaction scope.",
    "প্রতি process-এর pool সব replica মিলে বড় হয়। Slow query ও leak slot ধরে। DB capacity অনুযায়ী সীমা, wait time ও dispose ঠিক করুন। Proxy transaction ভুল সারায় না।",
    `kubectl get deployment api -n learning
kubectl top pods -n learning
# Compute maximum pool size times replica count.
# Inspect engine-specific active/idle/waiting sessions and long transactions.`,
  ],
  [
    "Choose a search access path",
    "Contains queries over large text can scan many rows despite ordinary indexes. Full-text or dedicated search indexes serve different relevance and query capabilities. Keep source-to-index synchronization, access filtering, deletion, and freshness visible. A separate index is another replica of meaning that can become stale.",
    "বড় text-এর contains সাধারণ index-এও scan হতে পারে। Full-text/search engine আলাদা query দেয়। Sync, permission, delete ও freshness দেখুন; search index-ও stale হতে পারে।",
    `EXPLAIN QUERY PLAN SELECT Name FROM Employees WHERE Name LIKE '%a%';
SELECT Name FROM Employees WHERE Name LIKE 'A%';
-- Compare prefix and contains access patterns.
-- Use the actual provider's full-text tooling for a production plan.`,
  ],
  [
    "Reduce distance without losing data rules",
    "Distant users pay network round trips. CDN caching helps public static content, while regional application placement can reduce dynamic latency. Multi-region writes introduce conflict, routing, residency, and recovery costs. Measure the client-to-region path before choosing active-active architecture.",
    "দূরের user-এ network RTT বাড়ে। Static-এ CDN, dynamic-এ region placement। Multi-region write-এ conflict ও residency খরচ। আগে client-এর আসল পথ মাপুন।",
    `curl --max-time 10 -sS -o /dev/null -w 'dns=%{time_namelookup} connect=%{time_connect} tls=%{time_appconnect} total=%{time_total}\n' https://example.com
# Compare from representative authorized locations.
# Distinguish cache hits from dynamic origin requests.
# Do not publish invented latency numbers as benchmarks.`,
  ],
  [
    "Test backup recovery, not just backup creation",
    "Data loss protection requires recovery point and recovery time objectives, retention, integrity, and restore tests. Replication can copy accidental deletes. Store recovery material in a separate failure/security boundary where appropriate and test restoration into an isolated environment without overwriting production.",
    "Backup বানানো নয়, restore প্রমাণ দরকার। RPO/RTO, retention ও integrity ঠিক করুন। Replica ভুল delete কপি করে। আলাদা failure/security boundary-তে recovery material ও isolated restore test দিন।",
    `tar -tzf learning-backup.tar.gz
sha256sum learning-backup.tar.gz
mkdir -p /tmp/mastery-restore-review
# Extract only a trusted disposable archive into the isolated directory.
# Database backups require engine-consistent tools and restore verification.`,
  ],
  [
    "Correlate logs, metrics, and traces",
    "Production diagnosis needs user symptoms, a time window, exact release identity, and correlated signals. Logs provide events, metrics reveal aggregate change, and traces localize request work. Missing telemetry is a gap, not proof that no error occurred. Record mitigation and prevention separately.",
    "লক্ষণ, সময়, release id ও সম্পর্কিত signal দরকার। Log ঘটনা, metric পরিবর্তন, trace কাজের পথ। Telemetry নেই মানে error নেই নয়। Mitigation ও prevention আলাদা লিখুন।",
    `kubectl rollout history deployment/api -n learning
kubectl logs deployment/api -n learning --since=10m --timestamps
kubectl top pods -n learning
kubectl get events -n learning --sort-by=.metadata.creationTimestamp`,
  ],
];
