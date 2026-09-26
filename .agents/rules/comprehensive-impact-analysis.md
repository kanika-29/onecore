---
description: Perform comprehensive impact analysis before proposing optimizations.
---

# Comprehensive Impact Analysis Rule

Always perform a Comprehensive Impact Analysis before making any changes. We do not build MVPs; we build industry-grade production software. 

**Core Directive:**
Never miss anything. Before doing 1 thing, check ALL things connected to it or that can be affected by it directly or indirectly. 

**Workflow:**
1. When proposing a performance optimization (like pagination, limiting queries, or caching), trace how the frontend currently consumes that data.
2. If the frontend relies on full data payloads for client-side filtering, searching, or status counting, do not implement server-side limits that will break those client-side features without providing a full server-side replacement.
3. Every modification must be evaluated for:
   - Data Privacy/RBAC regressions
   - Client-side state/filtering breakage
   - Mobile app vs. Web app discrepancies
   - Schema compatibility

This rule applies to all current and future projects.
