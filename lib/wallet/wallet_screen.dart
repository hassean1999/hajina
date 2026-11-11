import 'package:flutter/material.dart';
import 'data/firestore_wallet_repository.dart';
import 'data/wallet_repository.dart';

class WalletScreen extends StatefulWidget {
  const WalletScreen({super.key});
  @override
  State<WalletScreen> createState() => _WalletScreenState();
}

class _WalletScreenState extends State<WalletScreen> {
  final WalletRepository repo = FirestoreWalletRepository();
  late Future<WalletState> future = repo.load();
  String method = WalletRepository.withdrawMethods.first;
  final account = TextEditingController();

  Future<void> _withdraw() async {
    if (account.text.trim().length < 6) {
      _toast('اكتب رقم المحفظة أو البطاقة');
      return;
    }
    try {
      await repo.requestWithdraw(method: method, account: account.text.trim());
      _toast('وصل طلب السحب للإدارة');
      setState(() => future = repo.load());
    } on StateError {
      _toast('الرصيد ما يكفي');
    }
  }

  void _toast(String m) => ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(m)));

  @override
  Widget build(BuildContext context) => Scaffold(
        appBar: AppBar(title: const Text('المحفظة')),
        body: FutureBuilder<WalletState>(
          future: future,
          builder: (c, snap) {
            if (!snap.hasData) return const Center(child: CircularProgressIndicator());
            final s = snap.data!;
            final can = s.available >= WalletRepository.minWithdraw;
            return ListView(padding: const EdgeInsets.all(16), children: [
              Card(child: ListTile(title: const Text('الألماس ◆'), trailing: Text('${s.diamonds}'))),
              Card(child: ListTile(title: const Text('الفضة 🪙'), trailing: Text('${s.silver}'))),
              const Divider(height: 32),
              Text('أرباحي 💗  ${s.available}', style: Theme.of(c).textTheme.titleLarge),
              Text('الكل ${s.charm} • قيد السحب ${s.pendingW} • انسحب ${s.withdrawn}'),
              const SizedBox(height: 12),
              DropdownButtonFormField<String>(
                value: method,
                items: [for (final m in WalletRepository.withdrawMethods) DropdownMenuItem(value: m, child: Text(m))],
                onChanged: (v) => setState(() => method = v ?? method),
                decoration: const InputDecoration(labelText: 'طريقة الاستلام', border: OutlineInputBorder()),
              ),
              const SizedBox(height: 12),
              TextField(
                controller: account,
                decoration: const InputDecoration(labelText: 'رقم المحفظة أو البطاقة', border: OutlineInputBorder()),
              ),
              const SizedBox(height: 12),
              FilledButton(
                onPressed: can ? _withdraw : null,
                child: Text(can ? 'اطلب سحب' : 'تحتاج ${WalletRepository.minWithdraw - s.available} نقطة بعد'),
              ),
            ]);
          },
        ),
      );
}
