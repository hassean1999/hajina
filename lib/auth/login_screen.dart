import 'package:flutter/material.dart';
import '../core/router.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});
  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final phone = TextEditingController();
  final otp = TextEditingController();
  bool sent = false;

  // TODO: connect to a real auth backend (phone OTP / Google).
  void _next() {
    if (!sent) {
      setState(() => sent = true);
    } else {
      Navigator.pushReplacementNamed(context, Routes.main);
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
                decoration: const InputDecoration(labelText: 'رقم الهاتف', border: OutlineInputBorder()),
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
              FilledButton(onPressed: _next, child: Text(sent ? 'دخول' : 'إرسال الرمز')),
              TextButton(onPressed: _next, child: const Text('المتابعة بحساب Google')),
            ]),
          ),
        ),
      );
}
