import 'package:flutter/material.dart';

class SearchScreen extends StatelessWidget {
  const SearchScreen({super.key});
  @override
  Widget build(BuildContext context) => Scaffold(
        appBar: AppBar(title: const TextField(decoration: InputDecoration(hintText: 'ابحث عن مستخدم أو غرفة'))),
        body: const Center(child: Text('نتائج البحث')),
      );
}
