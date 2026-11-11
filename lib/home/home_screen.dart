import 'package:flutter/material.dart';
import '../core/router.dart';
import '../live/room_service.dart';
import 'search_screen.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});
  @override
  Widget build(BuildContext context) {
    final svc = RoomService();
    return Scaffold(
      appBar: AppBar(title: const Text('البثوث المباشرة'), actions: [
        IconButton(
          icon: const Icon(Icons.search),
          onPressed: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const SearchScreen())),
        ),
        IconButton(icon: const Icon(Icons.notifications), onPressed: () => Navigator.pushNamed(context, Routes.notifications)),
      ]),
      body: StreamBuilder<List<RoomInfo>>(
        stream: svc.rooms(),
        builder: (c, s) {
          final list = s.data ?? const <RoomInfo>[];
          if (list.isEmpty) return const Center(child: Text('ماكو غرف الآن، ابدأ بثك'));
          return GridView.count(
            crossAxisCount: 2,
            padding: const EdgeInsets.all(12),
            crossAxisSpacing: 12,
            mainAxisSpacing: 12,
            children: [
              for (final r in list)
                InkWell(
                  onTap: () => Navigator.pushNamed(context, Routes.live, arguments: r.id),
                  child: Card(
                    child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
                      const Icon(Icons.live_tv, size: 40),
                      Text(r.title),
                      Text('${r.ownerName} • ${r.viewers} مشاهد'),
                    ]),
                  ),
                ),
            ],
          );
        },
      ),
    );
  }
}
