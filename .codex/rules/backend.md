# Backend Rules (Codex)

1. Supabase is the default backend and auth provider.
2. Enable RLS for new tables and define explicit access behavior.
3. Validate write inputs on the server boundary.
4. Enforce authentication and authorization checks on protected routes.
5. Return predictable error structures for client handling.
6. Document schema or policy changes in feature artifacts.
7. Do not ship backend changes without QA coverage on core paths.
