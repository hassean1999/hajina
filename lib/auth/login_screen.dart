import 'package:flutter/material.dart';
import '../core/router.dart';
import 'auth_service.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});
  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final auth = AuthService();
  final phone = TextEditingController();
  final otp = TextEditingController();
  bool sent = false, busy = false;

  void _toast(String m) => ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(m)));

  @override
  void initState() {
    super.initState();
    if (auth.user != null) {
      WidgetsBinding.instance.addPostFrameCallback((_) => Navigator.pushReplacementNamed(context, Routes.main));
    }
  }

  Future<void> _next() async {
    setState(() => busy = true);
    try {
      if (!sent) {
        // international format, e.g. +9647XXXXXXXXX
        await auth.sendCode(phone.text.trim(),
            onError: _toast, onSent: () => setState(() => sent = true));
      } else {
        await auth.verify(otp.text.trim());
        if (mounted) Navigator.pushReplacementNamed(context, Routes.main);
      }
    } catch (e) {
      _toast('$e');
    } finally {
      if (mounted) setState(() => busy = false);
    }
  }

  @override
  Widget build(BuildContext context) => Scaffold(
        body: SafeArea(
          child: Padding(
            padding: const EdgeInsets.all(24),
            child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
              const Text('تسجيل الدخول', style: TextStyle(fontSize: 26)),
              const SizedBox(height: 24),
              TextField(
                controller: phone,
                keyboardType: TextInputType.phone,
                decoration: const InputDecoration(labelText: 'رقم الهاتف (+964...)', border: OutlineInputBorder()),
              ),
              if (sent) ...[
                const SizedBox(height: 12),
                TextField(
                  controller: otp,
                  keyboardType: TextInputType.number,
                  decoration: const InputDecoration(labelText: 'رمز التحقق', border: OutlineInputBorder()),
                ),
              ],
              const SizedBox(height: 16),
              FilledButton(onPressed: busy ? null : _next, child: Text(sent ? 'دخول' : 'إرسال الرمز')),
            ]),
          ),
        ),
      );
}
