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

## Known gaps
- Withdraw runs as a client transaction that touches `pendingW`, which the
  included rules forbid; move it to a callable Cloud Function before release.
- Gifts/charm crediting must also be done server-side.
- Live room screen still uses mock UI; wire AgoraService.join/leave into it.
