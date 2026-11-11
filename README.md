# live_app

Flutter voice-room app: Firebase (auth, Firestore) + Agora (audio).

## Setup
1. `flutter create . --platforms=android,ios`
2. `dart pub global activate flutterfire_cli && flutterfire configure` (or add google-services.json)
3. Enable Phone sign-in in Firebase Auth.
4. Deploy functions + rules:
   `firebase functions:secrets:set AGORA_APP_ID`, `firebase functions:secrets:set AGORA_CERT`,
   `firebase deploy --only functions,firestore:rules`
5. `flutter run --dart-define=AGORA_APP_ID=<your app id>`

Use NEW Agora credentials: the old certificate was public on GitHub.

## Done
Phone login, rooms (Firestore), live audio (Agora + token function), text chat,
gifts and withdrawals (server-side Cloud Functions), wallet from Firestore.

## Known gaps
- Top-up is admin-only via the `adminRecharge` function (needs the admin claim)
- PK battles, families, VIP and the store are not built yet.
- Not compiled or tested in CI yet.

## Download the APK (GitHub Actions)
1. Firebase console: add an Android app with package `com.hajina.live_app`, download `google-services.json`.
2. GitHub repo > Settings > Secrets and variables > Actions, add:
   - `GOOGLE_SERVICES_JSON_BASE64` = `base64 -w0 google-services.json`
   - `AGORA_APP_ID` = your NEW Agora app id
3. Actions > "Build APK" > Run workflow. When it finishes, open the run and download
   the `LiveApp-APK` artifact (contains app-release.apk).
Release signing uses the debug key; add a real keystore before publishing to Play.
