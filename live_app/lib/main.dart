import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'core/router.dart';
import 'core/theme.dart';

void main() => runApp(const LiveApp());

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
