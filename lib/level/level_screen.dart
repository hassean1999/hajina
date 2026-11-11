import 'package:flutter/material.dart';

class LevelScreen extends StatelessWidget {
  const LevelScreen({super.key});
  @override
  Widget build(BuildContext context) => Scaffold(
        appBar: AppBar(title: const Text('المستوى والمهام')),
        body: ListView(padding: const EdgeInsets.all(16), children: const [
          Text('المستوى 5'),
          SizedBox(height: 8),
          LinearProgressIndicator(value: 0.6),
          Divider(height: 32),
          ListTile(title: Text('مهمة: ادخل غرفة بث'), trailing: Icon(Icons.check_circle)),
          ListTile(title: Text('مهمة: أرسل هدية'), trailing: Icon(Icons.circle_outlined)),
          ListTile(title: Text('الشارات')),
        ]),
      );
}
