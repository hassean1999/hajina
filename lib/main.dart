import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'core/router.dart';
import 'core/theme.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  // Needs google-services.json / GoogleService-Info.plist (see README).
  await Firebase.initializeApp();
  runApp(const LiveApp());
}

class LiveApp extends StatelessWidget {
  const LiveApp({super.key});
  @override
  Widget build(BuildContext context) => MaterialApp(
        title: 'Live App',
        debugShowCheckedModeBanner: false,
        theme: AppTheme.dark,
        locale: const Locale('ar'),
        supportedLocales: const [Locale('ar'), Locale('en')],
        localizationsDelegates: const [
          GlobalMaterialLocalizations.delegate,
          GlobalWidgetsLocalizations.delegate,
          GlobalCupertinoLocalizations.delegate,
        ],
        initialRoute: Routes.login,
        routes: appRoutes,
      );
}
