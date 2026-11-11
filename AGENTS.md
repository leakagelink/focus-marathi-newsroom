<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

- Cloud Auth owns account identity; roles live in protected user_roles and database policies authorize every news/moderation/storage write, so browser UI cannot grant privileges.
- Cloud news, breaking news and broadcast settings replace demo rows; private clip paths are signed for authorized readers, so pending reports stay private.
- A single root auth subscription refreshes the browser store after identity changes; generation guards discard outdated refreshes, preventing stale private state after sign-out.
- New accounts receive only journalist access; owner administrator access must be assigned to a verified, explicitly identified account, never the first signup.
- Text-only news uses empty clip_paths; video submissions still require four owned clips, preserving moderation and validation.
- News listening uses browser SpeechSynthesis only after hydration, preferring Marathi then Hindi voices and cancelling on exit; unsupported devices show an unavailable state instead of calling a paid service.
