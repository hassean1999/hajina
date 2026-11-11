import 'package:flutter/material.dart';

class NotificationsScreen extends StatelessWidget {
  const NotificationsScreen({super.key});
  @override
  Widget build(BuildContext context) => Scaffold(
        appBar: AppBar(title: const Text('الإشعارات')),
        body: ListView(children: const [
          ListTile(leading: Icon(Icons.person_add), title: Text('ليلى بدأت متابعتك')),
          ListTile(leading: Icon(Icons.live_tv), title: Text('أحمد بدأ بثًا مباشرًا')),
        ]),
      );
}
