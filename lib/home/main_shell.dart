import 'package:flutter/material.dart';
import 'home_screen.dart';
import '../chat/chat_list_screen.dart';
import '../profile/profile_screen.dart';
import '../core/router.dart';

class MainShell extends StatefulWidget {
  const MainShell({super.key});
  @override
  State<MainShell> createState() => _MainShellState();
}

class _MainShellState extends State<MainShell> {
  int i = 0;
  static const pages = [HomeScreen(), ChatListScreen(), ProfileScreen()];
  @override
  Widget build(BuildContext context) => Scaffold(
        body: pages[i],
        floatingActionButton: FloatingActionButton.extended(
          onPressed: () => Navigator.pushNamed(context, Routes.live),
          icon: const Icon(Icons.videocam),
          label: const Text('ابدأ بثًا'),
        ),
        bottomNavigationBar: NavigationBar(
          selectedIndex: i,
          onDestinationSelected: (v) => setState(() => i = v),
          destinations: const [
            NavigationDestination(icon: Icon(Icons.home), label: 'الرئيسية'),
            NavigationDestination(icon: Icon(Icons.chat), label: 'الرسائل'),
            NavigationDestination(icon: Icon(Icons.person), label: 'حسابي'),
          ],
        ),
      );
}
