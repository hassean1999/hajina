import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'wallet_repository.dart';

/// users/{uid}: diamonds, silver, charm, withdrawn, pendingW
/// withdrawals/{id}: uid, amount, method, account, status, ts
class FirestoreWalletRepository implements WalletRepository {
  final _db = FirebaseFirestore.instance;
  String get _uid => FirebaseAuth.instance.currentUser!.uid;

  WalletState _from(Map<String, dynamic>? d) {
    int n(String k) => (d?[k] as num?)?.toInt() ?? 0;
    return WalletState(
        diamonds: n('diamonds'), silver: n('silver'), charm: n('charm'), withdrawn: n('withdrawn'), pendingW: n('pendingW'));
  }

  @override
  Future<WalletState> load() async => _from((await _db.collection('users').doc(_uid).get()).data());

  @override
  Future<void> requestWithdraw({required String method, required String account}) {
    final me = _db.collection('users').doc(_uid);
    return _db.runTransaction((tx) async {
      final s = _from((await tx.get(me)).data());
      if (s.available < WalletRepository.minWithdraw) throw StateError('low');
      tx.update(me, {'pendingW': s.pendingW + s.available});
      tx.set(_db.collection('withdrawals').doc(), {
        'uid': _uid,
        'amount': s.available,
        'method': method,
        'account': account,
        'status': 'pending',
        'ts': DateTime.now().millisecondsSinceEpoch,
      });
    });
  }
}
