/// No secrets in the repo. Pass at build time:
/// flutter run --dart-define=AGORA_APP_ID=xxxx
/// The Agora *certificate* must NEVER be in the app: tokens are issued by the
/// `agoraToken` Cloud Function (see functions/index.js).
class AppConfig {
  static const agoraAppId = String.fromEnvironment('AGORA_APP_ID');
}
