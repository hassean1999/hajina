import 'package:flutter/material.dart';
import '../profile/profile_service.dart';

class LevelScreen extends StatelessWidget {
  const LevelScreen({super.key});
  @override
  Widget build(BuildContext context) => Scaffold(
        appBar: AppBar(title: const Text('المستوى والمهام')),
        body: StreamBuilder<Profile>(
          stream: ProfileService().me(),
          builder: (c, s) {
            final p = s.data;
            if (p == null) return const Center(child: CircularProgressIndicator());
            return ListView(padding: const EdgeInsets.all(16), children: [
              Text('المستوى ${p.level}', style: Theme.of(c).textTheme.headlineSmall),
              const SizedBox(height: 8),
              LinearProgressIndicator(value: p.levelProgress),
              Text('${p.charm} نقطة'),
              const Divider(height: 32),
              ListTile(
                leading: const Icon(Icons.event_available),
                title: const Text('تسجيل الحضور اليومي (+100 فضة)'),
                onTap: () async {
                  final ok = await ProfileService().checkin();
                  if (c.mounted) {
                    ScaffoldMessenger.of(c).showSnackBar(SnackBar(content: Text(ok ? 'تم! +100 فضة' : 'سجلت حضورك اليوم')));
                  }
                },
              ),
            ]);
          },
        ),
      );
}
