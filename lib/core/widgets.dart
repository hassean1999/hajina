import 'package:flutter/material.dart';

class Section extends StatelessWidget {
  final String title;
  final List<Widget> children;
  const Section(this.title, this.children, {super.key});
  @override
  Widget build(BuildContext c) => Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
            child: Text(title, style: Theme.of(c).textTheme.titleMedium),
          ),
          ...children,
        ],
      );
}
