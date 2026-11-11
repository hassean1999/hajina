import 'package:flutter/material.dart';

class EditProfileScreen extends StatelessWidget {
  const EditProfileScreen({super.key});
  @override
  Widget build(BuildContext context) => Scaffold(
        appBar: AppBar(title: const Text('تعديل الملف')),
        body: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(children: [
            const TextField(decoration: InputDecoration(labelText: 'الاسم', border: OutlineInputBorder())),
            const SizedBox(height: 12),
            const TextField(decoration: InputDecoration(labelText: 'نبذة', border: OutlineInputBorder())),
            const SizedBox(height: 16),
            FilledButton(onPressed: () => Navigator.pop(context), child: const Text('حفظ')),
          ]),
        ),
      );
}
