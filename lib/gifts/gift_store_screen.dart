import 'package:flutter/material.dart';
import '../core/models.dart';

const _gifts = [Gift('وردة', 10), Gift('قلب', 50), Gift('تاج', 500), Gift('سيارة', 2000)];

class GiftStoreScreen extends StatelessWidget {
  const GiftStoreScreen({super.key});
  @override
  Widget build(BuildContext context) => Scaffold(
        appBar: AppBar(title: const Text('الهدايا')),
        body: GridView.count(crossAxisCount: 3, children: [
          for (final g in _gifts)
            InkWell(
              onTap: () => ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('أُرسلت ${g.name}'))),
              child: Card(
                child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
                  const Icon(Icons.card_giftcard, size: 36),
                  Text(g.name),
                  Text('${g.price} عملة'),
                ]),
              ),
            ),
        ]),
      );
}
