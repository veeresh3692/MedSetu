# MEDICOMPARE INDIA — GEMINI ORCHESTRATION RULES
This workspace follows the central orchestrator and specialist agent rules defined in `AGENTS.md` and `.agents/rules/`.

## Key Orchestrator Directives:
1. Orchestrator coordinates 18 specialist agents and 33 domain skills.
2. Incremental development: Never generate the full application in one turn.
3. Modular monolith architecture using Next.js, TypeScript, Tailwind CSS, Supabase PostgreSQL with RLS.
4. Strict separation of Government NPPA reference prices, Manufacturer MRP, and Pharmacy Selling Prices.
5. All implementations must pass the 10 Quality Gates with independent review before merging.
6. The human developer is the Product Owner and holds final authority over critical architecture, security, and deployment decisions.
