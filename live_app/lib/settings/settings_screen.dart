import 'package:flutter/material.dart';

class SettingsScreen extends StatelessWidget {
  const SettingsScreen({super.key});
  @override
  Widget build(BuildContext context) => Scaffold(
        appBar: AppBar(title: const Text('الإعدادات')),
        body: ListView(children: [
          const ListTile(leading: Icon(Icons.language), title: Text('اللغة')),
          const ListTile(leading: Icon(Icons.lock), title: Text('الخصوصية')),
          const ListTile(leading: Icon(Icons.block), title: Text('قائمة الحظر')),
          const ListTile(leading: Icon(Icons.report), title: Text('الإبلاغ عن مشكلة')),
          ListTile(
            leading: const Icon(Icons.logout),
            title: const Text('تسجيل الخروج'),
            onTap: () => Navigator.pushNamedAndRemoveUntil(context, '/login', (_) => false),
          ),
        ]),
      );
}
