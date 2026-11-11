import 'package:flutter/material.dart';
import '../core/router.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});
  @override
  Widget build(BuildContext context) => Scaffold(
        appBar: AppBar(title: const Text('حسابي'), actions: [
          IconButton(icon: const Icon(Icons.settings), onPressed: () => Navigator.pushNamed(context, Routes.settings)),
        ]),
        body: ListView(children: [
          const SizedBox(height: 16),
          const Center(child: CircleAvatar(radius: 40, child: Icon(Icons.person, size: 40))),
          const SizedBox(height: 8),
          const Center(child: Text('اسم المستخدم')),
          const Row(mainAxisAlignment: MainAxisAlignment.spaceEvenly, children: [
            Column(children: [Text('120'), Text('متابِع')]),
            Column(children: [Text('80'), Text('يتابع')]),
          ]),
          const Divider(),
          ListTile(leading: const Icon(Icons.edit), title: const Text('تعديل الملف'), onTap: () => Navigator.pushNamed(context, Routes.editProfile)),
          ListTile(leading: const Icon(Icons.account_balance_wallet), title: const Text('المحفظة'), onTap: () => Navigator.pushNamed(context, Routes.wallet)),
          ListTile(leading: const Icon(Icons.military_tech), title: const Text('المستوى والمهام'), onTap: () => Navigator.pushNamed(context, Routes.level)),
        ]),
      );
}
