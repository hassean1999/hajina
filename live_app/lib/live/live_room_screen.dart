import 'package:flutter/material.dart';
import '../core/router.dart';

// TODO: embed a licensed live video/audio SDK in the video area.
class LiveRoomScreen extends StatelessWidget {
  const LiveRoomScreen({super.key});
  @override
  Widget build(BuildContext context) => Scaffold(
        appBar: AppBar(title: const Text('غرفة البث')),
        body: Column(children: [
          const Expanded(flex: 3, child: Center(child: Icon(Icons.videocam, size: 80))),
          Expanded(
            flex: 2,
            child: ListView(children: const [
              ListTile(title: Text('مرحبا بالجميع')),
              ListTile(title: Text('أرسل هدية 🎁')),
            ]),
          ),
          Padding(
            padding: const EdgeInsets.all(8),
            child: Row(children: [
              const Expanded(child: TextField(decoration: InputDecoration(hintText: 'اكتب تعليقًا', border: OutlineInputBorder()))),
              IconButton(icon: const Icon(Icons.card_giftcard), onPressed: () => Navigator.pushNamed(context, Routes.gifts)),
              IconButton(icon: const Icon(Icons.send), onPressed: () {}),
            ]),
          ),
        ]),
      );
}
