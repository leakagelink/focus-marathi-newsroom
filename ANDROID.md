# Android app: keep the newsroom inside the app

The repository includes `capacitor.config.json` and a minimal `www/index.html` for the existing online-only Android wrapper. The website remains server-rendered; this is not an offline or bundled-native build. Capacitor dependencies and the Android Studio project are installed locally.

## Confirmed diagnosis

`https://focus-marathi-newsroom.lovable.app` returns HTTP 302 to `https://news.homemuse.in/`. Capacitor opens a different, unapproved host in the external browser. An APK built with the old address can therefore leave the app on startup. The custom domain itself returns HTTP 200.

The checked-in configuration starts directly at the HTTPS custom domain and permits only that exact additional host. Do not use `*` or allow unrelated websites: remote pages inside a Capacitor WebView can have access to native plugins. Capacitor documents remote `server.url` and `allowNavigation` as primarily development facilities; this project deliberately retains the previously selected online website wrapper rather than representing it as an offline production-native app.

## Update the existing Windows project

Keep the existing app ID and signing key when replacing an installed app. If its ID differs from `com.focus24.news`, retain its existing ID in the JSON file. Back up local edits before updating the checkout.

After downloading the latest repository changes, run these commands in PowerShell from the project directory. Old `.ts` or `.js` config files take precedence over the new JSON, so preserve them as backups outside their recognized filenames:

```powershell
Set-Location C:\Users\ASUS\focus-marathi-newsroom

if (Test-Path .\capacitor.config.ts) {
    Move-Item .\capacitor.config.ts .\capacitor.config.ts.backup -Force
}
if (Test-Path .\capacitor.config.js) {
    Move-Item .\capacitor.config.js .\capacitor.config.js.backup -Force
}

npx cap sync android
Get-Content .\android\app\src\main\assets\capacitor.config.json
npx cap open android
```

Check that the copied Android configuration shows `server.url` as `https://news.homemuse.in` and `allowNavigation` contains only `news.homemuse.in`. If it shows the old address, do not build yet: check for another local Capacitor configuration or failed sync.

In Android Studio, finish Gradle sync and generate a new APK using Build → Build Bundle(s) / APK(s) → Build APK(s), or the equivalent Generate APKs menu in your version. Install that newly generated APK on the phone. Updating/publishing the website alone cannot replace the configuration embedded in an existing APK.

## Device acceptance check

1. Close the app completely and open it from its launcher icon.
2. Confirm the newsroom opens without Chrome or a browser address bar.
3. Open Public, Journalist, and Admin, and sign in using the email form; navigation should stay inside the same app.
4. Close and reopen it again to confirm startup stays inside the app.

External links to unrelated services are intentionally not forced into the app. Native APK execution cannot be verified in the Lovable browser preview. If the newly built APK still opens a browser, inspect its copied configuration and provide its startup Logcat output and `MainActivity` source; custom native navigation overrides are maintained in the local Android project, not this checkout.