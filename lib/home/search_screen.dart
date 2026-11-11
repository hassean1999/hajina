import 'package:flutter/material.dart';
import '../chat/chat_service.dart';
import '../core/router.dart';
import '../profile/profile_service.dart';

class SearchScreen extends StatefulWidget {
  const SearchScreen({super.key});
  @override
  State<SearchScreen> createState() => _SearchScreenState();
}

class _SearchScreenState extends State<SearchScreen> {
  final svc = ProfileService();
  List<Profile> results = [];

  Future<void> _open(Profile p) async {
    final me = await svc.me().first;
    final chat = ChatService();
    final cid = await chat.open(p.uid, p.name, me.name);
    if (!mounted) return;
    Navigator.pushNamed(context, Routes.chat, arguments: ChatSummary(cid, p.uid, p.name, ''));
  }

  @override
  Widget build(BuildContext context) => Scaffold(
        appBar: AppBar(
          title: TextField(
            decoration: const InputDecoration(hintText: 'ابحث عن مستخدم بالاسم'),
            onSubmitted: (q) async {
              final r = await svc.search(q.trim());
              setState(() => results = r);
            },
          ),
        ),
        body: ListView(children: [
          for (final p in results)
            ListTile(
              leading: CircleAvatar(child: Text(p.name.isEmpty ? '?' : p.name[0])),
              title: Text(p.name),
              subtitle: Text('المستوى ${p.level}'),
              onTap: () => _open(p),
            ),
        ]),
      );
}
