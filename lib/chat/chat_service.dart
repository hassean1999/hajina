import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';

class ChatSummary {
  final String cid, peerUid, peerName, last;
  const ChatSummary(this.cid, this.peerUid, this.peerName, this.last);
}

class ChatService {
  final _db = FirebaseFirestore.instance;
  String get uid => FirebaseAuth.instance.currentUser!.uid;

  static String cidFor(String a, String b) => ([a, b]..sort()).join('_');

  Stream<List<ChatSummary>> chats() => _db.collection('chats').where('members', arrayContains: uid).snapshots().map((s) {
        final list = [
          for (final d in s.docs)
            () {
              final names = Map<String, dynamic>.from(d['names'] ?? {});
              final peer = (d['members'] as List).firstWhere((m) => m != uid) as String;
              return ChatSummary(d.id, peer, '${names[peer] ?? ''}', '${d['last'] ?? ''}');
            }()
        ];
        return list;
      });

  Future<String> open(String peerUid, String peerName, String myName) async {
    final cid = cidFor(uid, peerUid);
    await _db.collection('chats').doc(cid).set({
      'members': [uid, peerUid],
      'names': {uid: myName, peerUid: peerName},
    }, SetOptions(merge: true));
    return cid;
  }

  Stream<List<Map<String, dynamic>>> messages(String cid) =>
      _db.collection('chats').doc(cid).collection('messages').orderBy('ts', descending: true).limit(100).snapshots().map(
            (s) => [for (final d in s.docs) d.data()],
          );

  Future<void> send(String cid, String text) async {
    final ref = _db.collection('chats').doc(cid);
    await ref.collection('messages').add({'uid': uid, 'text': text, 'ts': FieldValue.serverTimestamp()});
    await ref.update({'last': text});
  }
}
