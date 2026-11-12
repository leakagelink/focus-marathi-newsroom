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
- Public video uses a dedicated breaking-news band fed by the existing managed breaking rows, keeping regional headlines readable without a scrolling ticker.
- Keep in-app headers as sticky siblings of expanding content inside the phone scroll container so both top headers and bottom navigation remain visible while scrolling.
- Keep editorial assembly regions separate from administrative divisions and use their district IDs for public assembly filtering so regional totals and news selection stay consistent.
- Use source-keyed NewsVideo for uploaded clip playback and previews, never sample posters; preserve clip identity on story changes and report media failures instead of showing unrelated imagery.
- Render the shared Logo at the top-right of every full NewsVideo player, outside source-keyed media, so clip switches retain branding without obscuring thumbnail previews or controls.
- A single root auth subscription refreshes the browser store after identity changes; generation guards discard outdated refreshes, preventing stale private state after sign-out.
- Publish account/profile readiness independently of feeds and clip signing, and reuse the loaded own profile in the editor so unrelated data cannot delay account access.
- New accounts receive only journalist access; owner administrator access must be assigned to a verified, explicitly identified account, never the first signup.
- Text-only news uses empty clip_paths; video submissions still require four owned clips, preserving moderation and validation.
- News listening uses browser SpeechSynthesis only after hydration, preferring Marathi then Hindi voices and cancelling on exit; unsupported devices show an unavailable state instead of calling a paid service.
- Admin management uses separate news, profile, content, payment and account-access editors with explicit save and confirmed delete; database policies enforce editorial versus administrator permissions.
- Show moderation actions directly beside each admin news row; review details remain optional so pending submissions never hide approval behind selection.
- Public story lists, open details and bulletins share approval-first visibility; app_content stores managed categories, districts, advertisements, live sources and bulletin IDs.
- Keep fictional sample submissions in a shared validated fixture; derive managed bulletin publication state from referenced published stories rather than private broadcast settings.
- AccountForm offers email/password and phone/SMS OTP; phone login never creates users, signup carries only profile name, and OTP verification uses the number returned by the send step.
- Use one shared Logo component for screen branding and derive install icons and favicon from the same supplied image so replacements stay consistent.
- Keep the online Android wrapper configuration in capacitor.config.json with a minimal www entry and an exact-host HTTPS navigation allowlist; this prevents canonical-domain redirects escaping the WebView without allowing arbitrary sites native-plugin access. Local Android projects must sync and rebuild to receive changes.
