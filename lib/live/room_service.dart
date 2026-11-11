import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:cloud_functions/cloud_functions.dart';
import 'package:firebase_auth/firebase_auth.dart';

class RoomInfo {
  final String id, title, ownerName;
  final int viewers;
  const RoomInfo(this.id, this.title, this.ownerName, this.viewers);
}

class RoomService {
  final _db = FirebaseFirestore.instance;
  String get uid => FirebaseAuth.instance.currentUser!.uid;

  Stream<List<RoomInfo>> rooms() => _db.collection('rooms').orderBy('viewers', descending: true).limit(30).snapshots().map(
        (s) => [
          for (final d in s.docs)
            RoomInfo(d.id, d['title'] ?? '', d['ownerName'] ?? '', (d['viewers'] as num?)?.toInt() ?? 0)
        ],
      );

  Future<String> create(String title) async {
    final ref = await _db.collection('rooms').add({
      'title': title,
      'ownerUid': uid,
      'ownerName': FirebaseAuth.instance.currentUser?.displayName ?? '',
      'viewers': 0,
      'ts': FieldValue.serverTimestamp(),
    });
    return ref.id;
  }

  Stream<List<Map<String, dynamic>>> messages(String roomId) => _db
      .collection('rooms')
      .doc(roomId)
      .collection('messages')
      .orderBy('ts', descending: true)
      .limit(50)
      .snapshots()
      .map((s) => [for (final d in s.docs) d.data()]);

  Future<void> say(String roomId, String text) => _db.collection('rooms').doc(roomId).collection('messages').add({
        'type': 'text',
        'uid': uid,
        'text': text,
        'ts': FieldValue.serverTimestamp(),
      });

  Future<void> sendGift(String roomId, String giftId, String toUid) =>
      FirebaseFunctions.instance.httpsCallable('sendGift').call({'giftId': giftId, 'toUid': toUid, 'roomId': roomId});

  Future<String> ownerOf(String roomId) async => (await _db.collection('rooms').doc(roomId).get())['ownerUid'] as String;
}
