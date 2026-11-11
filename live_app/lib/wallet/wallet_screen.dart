import 'package:flutter/material.dart';

// TODO: real payments must go through Google Play Billing / a payment backend.
class WalletScreen extends StatelessWidget {
  const WalletScreen({super.key});
  @override
  Widget build(BuildContext context) => Scaffold(
        appBar: AppBar(title: const Text('المحفظة')),
        body: ListView(padding: const EdgeInsets.all(16), children: [
          const Card(child: ListTile(title: Text('الرصيد'), trailing: Text('1,250 عملة'))),
          const SizedBox(height: 8),
          FilledButton(onPressed: () {}, child: const Text('شحن')),
          OutlinedButton(onPressed: () {}, child: const Text('سحب')),
          const Divider(),
          const ListTile(title: Text('سجل المعاملات')),
          const ListTile(title: Text('شحن'), trailing: Text('+500')),
          const ListTile(title: Text('هدية وردة'), trailing: Text('-10')),
        ]),
      );
}
