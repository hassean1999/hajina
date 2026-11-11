import 'package:flutter_test/flutter_test.dart';
import 'package:live_app/main.dart';

void main() {
  testWidgets('shows login', (t) async {
    await t.pumpWidget(const LiveApp());
    expect(find.text('تسجيل الدخول'), findsOneWidget);
  });
}
