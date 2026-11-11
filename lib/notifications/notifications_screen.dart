import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';

class NotificationsScreen extends StatelessWidget {
  const NotificationsScreen({super.key});
  @override
  Widget build(BuildContext context) => Scaffold(
        appBar: AppBar(title: const Text('الإشعارات')),
        body: StreamBuilder<QuerySnapshot<Map<String, dynamic>>>(
          stream: FirebaseFirestore.instance
              .collection('users')
              .doc(FirebaseAuth.instance.currentUser!.uid)
              .collection('notifs')
              .orderBy('ts', descending: true)
              .limit(50)
              .snapshots(),
          builder: (c, s) {
            final docs = s.data?.docs ?? [];
            if (docs.isEmpty) return const Center(child: Text('ماكو إشعارات'));
            return ListView(children: [for (final d in docs) ListTile(title: Text('${d['text'] ?? ''}'))]);
          },
        ),
      );
}
