import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:cloud_functions/cloud_functions.dart';
import 'package:firebase_auth/firebase_auth.dart';

class Profile {
  final String uid, name, bio;
  final int diamonds, silver, charm;
  const Profile(this.uid, this.name, this.bio, this.diamonds, this.silver, this.charm);

  /// Level grows with total gifts received (charm): 0-99 => 1, then every 100*level^2 ... simple curve.
  int get level {
    var l = 1;
    while (charm >= 100 * l * l) {
      l++;
    }
    return l;
  }

  double get levelProgress {
    final lo = 100 * (level - 1) * (level - 1), hi = 100 * level * level;
    return ((charm - lo) / (hi - lo)).clamp(0.0, 1.0);
  }

  factory Profile.from(String uid, Map<String, dynamic>? d) {
    int n(String k) => (d?[k] as num?)?.toInt() ?? 0;
    return Profile(uid, d?['name'] ?? '', d?['bio'] ?? '', n('diamonds'), n('silver'), n('charm'));
  }
}

class ProfileService {
  final _db = FirebaseFirestore.instance;
  String get uid => FirebaseAuth.instance.currentUser!.uid;

  Future<void> ensure() => FirebaseFunctions.instance.httpsCallable('ensureProfile').call();

  Stream<Profile> me() => _db.collection('users').doc(uid).snapshots().map((s) => Profile.from(uid, s.data()));

  Future<void> update({required String name, required String bio}) =>
      _db.collection('users').doc(uid).update({'name': name, 'bio': bio});

  Future<bool> checkin() async {
    try {
      await FirebaseFunctions.instance.httpsCallable('dailyCheckin').call();
      return true;
    } on FirebaseFunctionsException {
      return false;
    }
  }

  Future<List<Profile>> search(String q) async {
    final s = await _db
        .collection('users')
        .where('name', isGreaterThanOrEqualTo: q)
        .where('name', isLessThan: '$q\uf8ff')
        .limit(20)
        .get();
    return [for (final d in s.docs) if (d.id != uid) Profile.from(d.id, d.data())];
  }
}
