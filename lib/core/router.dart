import 'package:flutter/material.dart';
import '../auth/login_screen.dart';
import '../home/main_shell.dart';
import '../live/live_room_screen.dart';
import '../chat/chat_screen.dart';
import '../gifts/gift_store_screen.dart';
import '../wallet/wallet_screen.dart';
import '../level/level_screen.dart';
import '../notifications/notifications_screen.dart';
import '../settings/settings_screen.dart';
import '../profile/edit_profile_screen.dart';

class Routes {
  static const login = '/login';
  static const main = '/main';
  static const live = '/live';
  static const chat = '/chat';
  static const gifts = '/gifts';
  static const wallet = '/wallet';
  static const level = '/level';
  static const notifications = '/notifications';
  static const settings = '/settings';
  static const editProfile = '/edit-profile';
}

final Map<String, WidgetBuilder> appRoutes = {
  Routes.login: (_) => const LoginScreen(),
  Routes.main: (_) => const MainShell(),
  Routes.live: (_) => const LiveRoomScreen(),
  Routes.chat: (_) => const ChatScreen(),
  Routes.gifts: (_) => const GiftStoreScreen(),
  Routes.wallet: (_) => const WalletScreen(),
  Routes.level: (_) => const LevelScreen(),
  Routes.notifications: (_) => const NotificationsScreen(),
  Routes.settings: (_) => const SettingsScreen(),
  Routes.editProfile: (_) => const EditProfileScreen(),
};
