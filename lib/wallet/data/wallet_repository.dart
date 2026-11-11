/// Mirrors the existing hajina Firestore model:
/// users/{uid}: diamonds, silver, charm (total gifts received), withdrawn, pendingW
/// withdrawals/{id}: uid, amount, method, account, status(pending|paid|rejected), ts
class WalletState {
  final int diamonds, silver, charm, withdrawn, pendingW;
  const WalletState({
    required this.diamonds,
    required this.silver,
    required this.charm,
    required this.withdrawn,
    required this.pendingW,
  });

  /// Same formula as docs/earn.js (availEarn).
  int get available {
    final v = charm - withdrawn - pendingW;
    return v < 0 ? 0 : v;
  }
}

abstract class WalletRepository {
  static const minWithdraw = 10000; // docs/config.js earnings.minWithdraw
  static const withdrawMethods = ['زين كاش', 'آسياسيل (رصيد)', 'ماستر كارد / كي كارد', 'FIB'];

  Future<WalletState> load();

  /// Creates a withdrawals/{id} doc with status "pending" and moves
  /// `available` into pendingW, atomically (Firestore transaction).
  Future<void> requestWithdraw({required String method, required String account});
}

/// In-memory implementation for development. Replace with a Firestore one.
class MockWalletRepository implements WalletRepository {
  WalletState _s = const WalletState(diamonds: 120, silver: 3400, charm: 15000, withdrawn: 2000, pendingW: 0);

  @override
  Future<WalletState> load() async => _s;

  @override
  Future<void> requestWithdraw({required String method, required String account}) async {
    final a = _s.available;
    if (a < WalletRepository.minWithdraw) throw StateError('low');
    _s = WalletState(
      diamonds: _s.diamonds,
      silver: _s.silver,
      charm: _s.charm,
      withdrawn: _s.withdrawn,
      pendingW: _s.pendingW + a,
    );
  }
}
