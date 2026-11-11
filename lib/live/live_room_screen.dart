import 'package:flutter/material.dart';
import 'agora_service.dart';
import 'room_service.dart';

class LiveRoomScreen extends StatefulWidget {
  const LiveRoomScreen({super.key});
  @override
  State<LiveRoomScreen> createState() => _LiveRoomScreenState();
}

class _LiveRoomScreenState extends State<LiveRoomScreen> {
  final rooms = RoomService();
  final agora = AgoraService();
  final ctrl = TextEditingController();
  String? roomId;
  bool speaking = false, muted = false;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (roomId != null) return;
    roomId = ModalRoute.of(context)!.settings.arguments as String;
    agora.join(roomId!, rooms.uid.hashCode & 0x7fffffff).catchError((e) => _toast('تعذر الدخول الصوتي: $e'));
  }

  @override
  void dispose() {
    agora.leave();
    super.dispose();
  }

  void _toast(String m) {
    if (mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(m)));
  }

  Future<void> _gift(String id) async {
    try {
      await rooms.sendGift(roomId!, id, await rooms.ownerOf(roomId!));
      _toast('أُرسلت الهدية');
    } catch (e) {
      _toast('الرصيد ما يكفي أو حدث خطأ');
    }
  }

  @override
  Widget build(BuildContext context) => Scaffold(
        appBar: AppBar(title: const Text('غرفة البث'), actions: [
          IconButton(
            icon: Icon(speaking ? Icons.mic : Icons.mic_none),
            onPressed: () async {
              speaking = !speaking;
              await agora.setSpeaker(speaking);
              setState(() {});
            },
          ),
          if (speaking)
            IconButton(
              icon: Icon(muted ? Icons.volume_off : Icons.volume_up),
              onPressed: () async {
                muted = !muted;
                await agora.mute(muted);
                setState(() {});
              },
            ),
        ]),
        body: Column(children: [
          Expanded(
            child: StreamBuilder<List<Map<String, dynamic>>>(
              stream: rooms.messages(roomId!),
              builder: (c, s) => ListView(reverse: true, children: [
                for (final m in s.data ?? const [])
                  ListTile(
                    dense: true,
                    title: Text(m['type'] == 'gift' ? '🎁 ${m['name'] ?? ''} أرسل ${m['giftId']}' : '${m['text'] ?? ''}'),
                  ),
              ]),
            ),
          ),
          SizedBox(
            height: 48,
            child: ListView(scrollDirection: Axis.horizontal, children: [
              for (final g in const ['rose', 'heart', 'crown', 'car'])
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 4),
                  child: ActionChip(label: Text(g), onPressed: () => _gift(g)),
                ),
            ]),
          ),
          Padding(
            padding: const EdgeInsets.all(8),
            child: Row(children: [
              Expanded(child: TextField(controller: ctrl, decoration: const InputDecoration(hintText: 'اكتب تعليقًا', border: OutlineInputBorder()))),
              IconButton(
                icon: const Icon(Icons.send),
                onPressed: () {
                  final t = ctrl.text.trim();
                  if (t.isEmpty) return;
                  rooms.say(roomId!, t);
                  ctrl.clear();
                },
              ),
            ]),
          ),
        ]),
      );
}
