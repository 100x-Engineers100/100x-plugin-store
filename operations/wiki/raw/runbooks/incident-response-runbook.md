# Incident Response Runbook

> Version 1.3 | Last updated: 2026-05 | Owner: Engineering Lead + Operations Manager
> Trigger: Any system outage, data loss, security breach, or significant service degradation

---

## Purpose

Define a clear, repeatable process for responding to incidents so that response is fast, communication is consistent, and learning is captured. No one should be improvising during an active incident.

---

## Incident Severity Levels

| Level | Definition | Response time | Who's paged |
|-------|-----------|--------------|-------------|
| **P0 — Critical** | Full outage. Core product unreachable. Data loss risk. Security breach. | Immediate (< 5 min) | On-call engineer + Engineering Lead + CEO |
| **P1 — High** | Significant degradation. Major feature broken. >20% of users impacted. | < 15 min | On-call engineer + Engineering Lead |
| **P2 — Medium** | Partial degradation. Minor feature broken. <20% impacted. Workaround exists. | < 1 hour | On-call engineer |
| **P3 — Low** | Cosmetic issue, non-critical bug, slow performance. No data risk. | Next business day | Ticket only |

**When in doubt, escalate up. It's always cheaper to escalate a P2 as a P1 than to under-respond to a real P0.**

---

## Roles During an Incident

| Role | Who | Responsibilities |
|------|-----|-----------------|
| Incident Commander (IC) | Engineering Lead (or on-call senior) | Coordinates response, makes calls, owns communication |
| Tech Lead | On-call engineer | Diagnoses, implements fix |
| Comms Lead | Operations Manager | External and internal communication |
| Scribe | Anyone available | Documents timeline in real-time |

For P0/P1: IC and Tech Lead must be different people. IC does not touch the fix.

---

## Phase 1: Detection & Triage (0-10 minutes)

### Triggering events
- Automated alert from monitoring (Datadog / Grafana / etc.)
- User report via support channel
- Internal team member notices something wrong

### Steps
1. **Acknowledge** — On-call engineer acknowledges the alert within 5 minutes. If no acknowledgment, PagerDuty escalates to Engineering Lead.
2. **Assess** — Quick check: What's broken? How many users are affected? Is there data loss risk?
3. **Classify severity** — Using the table above.
4. **Declare** — Post in #incidents Slack channel: `[P{level}] {short description} — IC: {name}, investigating`
5. **Page** — Notify appropriate people per severity level (see table above).
6. **Open war room** — Create a dedicated Slack thread in #incidents or start a video call for P0/P1.

---

## Phase 2: Response (10 min — resolution)

### Communication cadence
| Severity | External update frequency | Internal update frequency |
|---------|--------------------------|--------------------------|
| P0 | Every 15 min (status page) | Every 10 min (war room) |
| P1 | Every 30 min (status page) | Every 20 min (war room) |
| P2 | On fix ETA known + on resolution | Ongoing in thread |

### Scribe responsibilities
Open a doc (or Notion page) immediately and log:
```
[HH:MM] Incident declared. Severity: P{level}. Affected: {what}
[HH:MM] IC: {name}, Tech Lead: {name}, Comms Lead: {name}
[HH:MM] Initial hypothesis: {text}
[HH:MM] Action taken: {text}
[HH:MM] Update: {text}
... (continue appending)
```

### Tech Lead focus areas (in order)
1. **Identify blast radius** — How many users? Which systems? Any data integrity risk?
2. **Check recent changes** — Any deploys, config changes, or migrations in the last 2 hours?
3. **Isolate** — Can we roll back? Can we disable the affected feature? Can we reduce impact without the full fix?
4. **Fix** — Implement fix. Do not rush. A wrong fix in a P0 makes things worse.
5. **Verify** — Confirm fix is live and working before declaring resolved.

### Comms Lead responsibilities

**Status page update (P0/P1):**
```
[Investigating] We're aware of issues affecting [feature/service]. Our team is actively investigating. Next update in 15 minutes.
```

**Resolved:**
```
[Resolved] [feature/service] is now operating normally. We've resolved the issue that caused [short description]. We'll publish a post-mortem within 48 hours.
```

**External stakeholder email (P0 only, if >30 min outage):**
Subject: `Service Disruption — [Date] — [Short description]`
```
Hi [name/team],

We experienced a service disruption affecting [feature/service] from [time] to [time] on [date].

What happened: [1-2 sentences]
Who was affected: [scope]
What we did: [1-2 sentences]
Status now: Resolved. All systems operating normally.

We're conducting a post-mortem and will share learnings with you.

Apologies for the disruption.

[Signed by Engineering Lead or CEO depending on severity]
```

---

## Phase 3: Resolution

### Declaring resolution
IC declares incident resolved in #incidents:
```
[P{level}] RESOLVED — {short description} — resolved at {time} — cause: {1 sentence} — post-mortem: {link or "TBD"}
```

### Checklist before declaring resolved
- [ ] Issue confirmed fixed by Tech Lead
- [ ] Fix confirmed by IC (not just Tech Lead's word — second pair of eyes)
- [ ] Monitoring shows return to normal
- [ ] Status page updated to "Resolved"
- [ ] Affected users notified (if P0/P1)
- [ ] Timeline document complete

---

## Phase 4: Post-Mortem

**Timeline:** P0 post-mortem within 24 hours. P1 within 48 hours. P2 within 1 week.

**Format:**
```
Incident: [title]
Date/time: [start] — [end]
Duration: [X hours Y minutes]
Severity: P{level}
IC: [name]
Tech Lead: [name]

## What happened (5-10 sentences, factual)

## Root cause

## Timeline
[Copy from scribe log]

## What went well

## What didn't go well

## Action items
| Action | Owner | Deadline |
|--------|-------|---------|
| [task] | [name] | [date] |

## How to prevent this class of incident
```

Post-mortem is blameless. We investigate systems and processes, not people. If a person made a mistake, the question is: what system allowed that mistake to happen?

---

## On-Call Rotation

- On-call is 1 week per rotation
- Current rotation: [link to PagerDuty rotation]
- On-call responsibilities: acknowledge alerts within 5 min, be available 24/7 for P0/P1, hand off cleanly at rotation change
- Compensation for on-call: [per company policy — link to HR doc]

---

## Tools & Links

| Tool | Purpose | Link |
|------|---------|------|
| PagerDuty | Alerting + on-call rotation | [internal link] |
| Status page | External communication | [status.company.com] |
| Monitoring | Grafana / Datadog | [internal link] |
| Incident docs | Notion — Engineering → Incidents | [internal link] |
| #incidents | Slack channel | slack://channel/incidents |

---

## SOP Update Log

| Date | Change | Who |
|------|--------|-----|
| 2023-09 | Initial version | Engineering Lead |
| 2024-11 | Comms Lead role added, status page templates added | Ops Manager |
| 2025-06 | Post-mortem format revised (blameless framing), on-call compensation section added | Engineering Lead |
| 2026-05 | P3 severity level added, scribe log format standardized | Ops Manager |
