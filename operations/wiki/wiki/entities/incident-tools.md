---
title: "Incident Tools"
type: entity
entity_type: tool
tags: [incident, pagerduty, monitoring, status-page]
---

## Overview
Tool stack used during incident response. Each tool has a specific role — do not improvise with other tools during active incidents.

## Key Facts / Usage
- **PagerDuty**: alerting + on-call rotation. Escalates if unacknowledged in 5min.
- **#incidents (Slack)**: all incident declarations, updates, and resolution posts go here
- **Status page** (status.company.com): external communication for P0/P1
- **Grafana/Datadog**: monitoring — check here first for blast radius assessment
- **Notion (Engineering → Incidents)**: post-mortem docs and incident timeline scribe log

## Connections
Appears in sources: [[incident-response-runbook]]
Related entities: [[ops-team]]
