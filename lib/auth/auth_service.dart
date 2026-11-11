import 'package:firebase_auth/firebase_auth.dart';

class AuthService {
  final _auth = FirebaseAuth.instance;
  String? _verificationId;

  User? get user => _auth.currentUser;

  Future<void> sendCode(String phone, {required void Function(String) onError, required void Function() onSent}) {
    return _auth.verifyPhoneNumber(
      phoneNumber: phone,
      verificationCompleted: (cred) => _auth.signInWithCredential(cred),
      verificationFailed: (e) => onError(e.message ?? e.code),
      codeSent: (id, _) {
        _verificationId = id;
        onSent();
      },
      codeAutoRetrievalTimeout: (id) => _verificationId = id,
    );
  }

  Future<void> verify(String code) {
    final id = _verificationId;
    if (id == null) throw StateError('no-code-sent');
    return _auth.signInWithCredential(PhoneAuthProvider.credential(verificationId: id, smsCode: code));
  }

  Future<void> signOut() => _auth.signOut();
}
