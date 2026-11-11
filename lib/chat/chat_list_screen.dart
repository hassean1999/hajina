import 'package:flutter/material.dart';
import '../core/router.dart';

class ChatListScreen extends StatelessWidget {
  const ChatListScreen({super.key});
  @override
  Widget build(BuildContext context) => Scaffold(
        appBar: AppBar(title: const Text('الرسائل')),
        body: ListView(children: [
          for (final n in ['ليلى', 'أحمد', 'سارة'])
            ListTile(
              leading: CircleAvatar(child: Text(n[0])),
              title: Text(n),
              subtitle: const Text('آخر رسالة...'),
              onTap: () => Navigator.pushNamed(context, Routes.chat),
            ),
        ]),
      );
}
