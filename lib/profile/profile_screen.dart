import 'package:flutter/material.dart';
import '../core/router.dart';
import 'profile_service.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});
  @override
  Widget build(BuildContext context) => StreamBuilder<Profile>(
        stream: ProfileService().me(),
        builder: (c, s) {
          final p = s.data;
          return Scaffold(
            appBar: AppBar(title: const Text('حسابي'), actions: [
              IconButton(icon: const Icon(Icons.settings), onPressed: () => Navigator.pushNamed(context, Routes.settings)),
            ]),
            body: p == null
                ? const Center(child: CircularProgressIndicator())
                : ListView(children: [
                    const SizedBox(height: 16),
                    const Center(child: CircleAvatar(radius: 40, child: Icon(Icons.person, size: 40))),
                    const SizedBox(height: 8),
                    Center(child: Text(p.name, style: Theme.of(context).textTheme.titleLarge)),
                    Center(child: Text(p.bio)),
                    Row(mainAxisAlignment: MainAxisAlignment.spaceEvenly, children: [
                      Column(children: [Text('${p.diamonds}'), const Text('ألماس')]),
                      Column(children: [Text('${p.silver}'), const Text('فضة')]),
                      Column(children: [Text('${p.level}'), const Text('المستوى')]),
                    ]),
                    const Divider(),
                    ListTile(leading: const Icon(Icons.edit), title: const Text('تعديل الملف'), onTap: () => Navigator.pushNamed(context, Routes.editProfile)),
                    ListTile(leading: const Icon(Icons.account_balance_wallet), title: const Text('المحفظة'), onTap: () => Navigator.pushNamed(context, Routes.wallet)),
                    ListTile(leading: const Icon(Icons.military_tech), title: const Text('المستوى والمهام'), onTap: () => Navigator.pushNamed(context, Routes.level)),
                  ]),
          );
        },
      );
}
