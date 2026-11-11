import 'package:flutter/material.dart';
import 'chat_service.dart';

class ChatScreen extends StatefulWidget {
  const ChatScreen({super.key});
  @override
  State<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {
  final svc = ChatService();
  final ctrl = TextEditingController();

  @override
  Widget build(BuildContext context) {
    final ch = ModalRoute.of(context)!.settings.arguments as ChatSummary;
    return Scaffold(
      appBar: AppBar(title: Text(ch.peerName)),
      body: Column(children: [
        Expanded(
          child: StreamBuilder<List<Map<String, dynamic>>>(
            stream: svc.messages(ch.cid),
            builder: (c, s) => ListView(reverse: true, children: [
              for (final m in s.data ?? const [])
                Align(
                  alignment: m['uid'] == svc.uid ? Alignment.centerLeft : Alignment.centerRight,
                  child: Card(child: Padding(padding: const EdgeInsets.all(10), child: Text('${m['text']}'))),
                ),
            ]),
          ),
        ),
        Padding(
          padding: const EdgeInsets.all(8),
          child: Row(children: [
            Expanded(child: TextField(controller: ctrl, decoration: const InputDecoration(border: OutlineInputBorder()))),
            IconButton(
              icon: const Icon(Icons.send),
              onPressed: () {
                final t = ctrl.text.trim();
                if (t.isEmpty) return;
                svc.send(ch.cid, t);
                ctrl.clear();
              },
            ),
          ]),
        ),
      ]),
    );
  }
}
