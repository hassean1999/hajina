import 'package:flutter/material.dart';
import '../core/router.dart';
import 'data/mock_rooms.dart';
import 'search_screen.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});
  @override
  Widget build(BuildContext context) => Scaffold(
        appBar: AppBar(title: const Text('البثوث المباشرة'), actions: [
          IconButton(
            icon: const Icon(Icons.search),
            onPressed: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const SearchScreen())),
          ),
          IconButton(
            icon: const Icon(Icons.notifications),
            onPressed: () => Navigator.pushNamed(context, Routes.notifications),
          ),
        ]),
        body: GridView.count(
          crossAxisCount: 2,
          padding: const EdgeInsets.all(12),
          crossAxisSpacing: 12,
          mainAxisSpacing: 12,
          children: [
            for (final r in mockRooms)
              InkWell(
                onTap: () => Navigator.pushNamed(context, Routes.live),
                child: Card(
                  child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
                    const Icon(Icons.live_tv, size: 40),
                    Text(r.title),
                    Text('${r.host.name} • ${r.viewers} مشاهد'),
                  ]),
                ),
              ),
          ],
        ),
      );
}
