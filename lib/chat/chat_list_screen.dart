import 'package:flutter/material.dart';
import '../core/router.dart';
import 'chat_service.dart';

class ChatListScreen extends StatelessWidget {
  const ChatListScreen({super.key});
  @override
  Widget build(BuildContext context) => Scaffold(
        appBar: AppBar(title: const Text('الرسائل')),
        body: StreamBuilder<List<ChatSummary>>(
          stream: ChatService().chats(),
          builder: (c, s) {
            final list = s.data ?? const <ChatSummary>[];
            if (list.isEmpty) return const Center(child: Text('ماكو محادثات، ابحث عن مستخدم وراسله'));
            return ListView(children: [
              for (final ch in list)
                ListTile(
                  leading: CircleAvatar(child: Text(ch.peerName.isEmpty ? '?' : ch.peerName[0])),
                  title: Text(ch.peerName),
                  subtitle: Text(ch.last, maxLines: 1, overflow: TextOverflow.ellipsis),
                  onTap: () => Navigator.pushNamed(context, Routes.chat, arguments: ch),
                ),
            ]);
          },
        ),
      );
}
