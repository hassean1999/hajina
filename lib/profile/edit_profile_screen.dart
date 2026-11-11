import 'package:flutter/material.dart';
import 'profile_service.dart';

class EditProfileScreen extends StatefulWidget {
  const EditProfileScreen({super.key});
  @override
  State<EditProfileScreen> createState() => _EditProfileScreenState();
}

class _EditProfileScreenState extends State<EditProfileScreen> {
  final svc = ProfileService();
  final name = TextEditingController(), bio = TextEditingController();

  @override
  void initState() {
    super.initState();
    svc.me().first.then((p) {
      name.text = p.name;
      bio.text = p.bio;
    });
  }

  @override
  Widget build(BuildContext context) => Scaffold(
        appBar: AppBar(title: const Text('تعديل الملف')),
        body: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(children: [
            TextField(controller: name, maxLength: 24, decoration: const InputDecoration(labelText: 'الاسم', border: OutlineInputBorder())),
            const SizedBox(height: 12),
            TextField(controller: bio, maxLength: 80, decoration: const InputDecoration(labelText: 'نبذة', border: OutlineInputBorder())),
            const SizedBox(height: 16),
            FilledButton(
              onPressed: () async {
                if (name.text.trim().length < 2) return;
                await svc.update(name: name.text.trim(), bio: bio.text.trim());
                if (context.mounted) Navigator.pop(context);
              },
              child: const Text('حفظ'),
            ),
          ]),
        ),
      );
}
