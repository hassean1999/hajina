import 'package:agora_rtc_engine/agora_rtc_engine.dart';
import 'package:cloud_functions/cloud_functions.dart';
import 'package:permission_handler/permission_handler.dart';
import '../core/app_config.dart';

/// Voice room over Agora. Tokens come from the `agoraToken` Cloud Function.
class AgoraService {
  RtcEngine? _engine;

  Future<void> join(String roomId, int uid) async {
    await Permission.microphone.request();
    final res = await FirebaseFunctions.instance.httpsCallable('agoraToken').call({'channel': roomId, 'uid': uid});
    final e = createAgoraRtcEngine();
    await e.initialize(const RtcEngineContext(appId: AppConfig.agoraAppId));
    await e.setChannelProfile(ChannelProfileType.channelProfileLiveBroadcasting);
    await e.enableAudio();
    await e.joinChannel(
      token: res.data['token'] as String,
      channelId: roomId,
      uid: uid,
      options: const ChannelMediaOptions(clientRoleType: ClientRoleType.clientRoleAudience),
    );
    _engine = e;
  }

  Future<void> setSpeaker(bool on) async => _engine?.updateChannelMediaOptions(ChannelMediaOptions(
      clientRoleType: on ? ClientRoleType.clientRoleBroadcaster : ClientRoleType.clientRoleAudience));

  Future<void> mute(bool m) async => _engine?.muteLocalAudioStream(m);

  Future<void> leave() async {
    await _engine?.leaveChannel();
    await _engine?.release();
    _engine = null;
  }
}
