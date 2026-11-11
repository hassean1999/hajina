import 'package:flutter/material.dart';
import '../auth/auth_service.dart';
import '../core/router.dart';

class SettingsScreen extends StatelessWidget {
  const SettingsScreen({super.key});
  @override
  Widget build(BuildContext context) => Scaffold(
        appBar: AppBar(title: const Text('الإعدادات')),
        body: ListView(children: [
          const ListTile(leading: Icon(Icons.language), title: Text('اللغة: العربية')),
          ListTile(
            leading: const Icon(Icons.logout),
            title: const Text('تسجيل الخروج'),
            onTap: () async {
              await AuthService().signOut();
              if (context.mounted) Navigator.pushNamedAndRemoveUntil(context, Routes.login, (_) => false);
            },
          ),
        ]),
      );
}
