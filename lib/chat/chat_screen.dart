import 'package:flutter/material.dart';
import '../core/models.dart';

class ChatScreen extends StatefulWidget {
  const ChatScreen({super.key});
  @override
  State<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {
  final msgs = <Message>[const Message('ليلى', 'مرحبا!')];
  final ctrl = TextEditingController();

  void _send() {
    if (ctrl.text.trim().isEmpty) return;
    setState(() => msgs.add(Message('أنا', ctrl.text.trim(), mine: true)));
    ctrl.clear();
  }

  @override
  Widget build(BuildContext context) => Scaffold(
        appBar: AppBar(title: const Text('محادثة')),
        body: Column(children: [
          Expanded(
            child: ListView(children: [
              for (final m in msgs)
                Align(
                  alignment: m.mine ? Alignment.centerLeft : Alignment.centerRight,
                  child: Card(child: Padding(padding: const EdgeInsets.all(10), child: Text(m.text))),
                ),
            ]),
          ),
          Padding(
            padding: const EdgeInsets.all(8),
            child: Row(children: [
              Expanded(child: TextField(controller: ctrl, decoration: const InputDecoration(border: OutlineInputBorder()))),
              IconButton(icon: const Icon(Icons.send), onPressed: _send),
            ]),
          ),
        ]),
      );
}
