const { onCall, HttpsError } = require('firebase-functions/v2/https');
const { defineSecret } = require('firebase-functions/params');
const { RtcTokenBuilder, RtcRole } = require('agora-token');
const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();
const FieldValue = admin.firestore.FieldValue;

const MIN_WITHDRAW = 10000;
const METHODS = ['زين كاش', 'آسياسيل (رصيد)', 'ماستر كارد / كي كارد', 'FIB'];
// Gift catalog lives on the server so clients cannot fake prices.
const GIFTS = {
  rose: { price: 10, currency: 'silver' },
  heart: { price: 50, currency: 'silver' },
  crown: { price: 500, currency: 'diamonds' },
  car: { price: 2000, currency: 'diamonds' },
};

// firebase functions:secrets:set AGORA_APP_ID / AGORA_CERT
const APP_ID = defineSecret('AGORA_APP_ID');
const CERT = defineSecret('AGORA_CERT');

exports.agoraToken = onCall({ secrets: [APP_ID, CERT] }, (req) => {
  if (!req.auth) throw new HttpsError('unauthenticated', 'login required');
  const { channel, uid } = req.data || {};
  if (typeof channel !== 'string' || !channel) throw new HttpsError('invalid-argument', 'channel');
  const ttl = 3600;
  const token = RtcTokenBuilder.buildTokenWithUid(
    APP_ID.value(), CERT.value(), channel, Number(uid) || 0, RtcRole.PUBLISHER,
    ttl, ttl);
  return { token };
});

exports.requestWithdraw = onCall(async (req) => {
  if (!req.auth) throw new HttpsError('unauthenticated', 'login required');
  const { method, account } = req.data || {};
  if (!METHODS.includes(method)) throw new HttpsError('invalid-argument', 'method');
  if (typeof account !== 'string' || account.trim().length < 6) throw new HttpsError('invalid-argument', 'account');
  const uid = req.auth.uid;
  const me = db.collection('users').doc(uid);
  await db.runTransaction(async (tx) => {
    const d = (await tx.get(me)).data() || {};
    const avail = Math.max(0, (d.charm || 0) - (d.withdrawn || 0) - (d.pendingW || 0));
    if (avail < MIN_WITHDRAW) throw new HttpsError('failed-precondition', 'low');
    tx.update(me, { pendingW: (d.pendingW || 0) + avail });
    tx.set(db.collection('withdrawals').doc(), {
      uid, name: d.name || '', amount: avail, method, account: account.trim(),
      status: 'pending', ts: Date.now(),
    });
  });
  return { ok: true };
});

exports.sendGift = onCall(async (req) => {
  if (!req.auth) throw new HttpsError('unauthenticated', 'login required');
  const { giftId, toUid, roomId } = req.data || {};
  const gift = GIFTS[giftId];
  if (!gift) throw new HttpsError('invalid-argument', 'gift');
  if (typeof toUid !== 'string' || toUid === req.auth.uid) throw new HttpsError('invalid-argument', 'toUid');
  const from = db.collection('users').doc(req.auth.uid);
  const to = db.collection('users').doc(toUid);
  await db.runTransaction(async (tx) => {
    const f = (await tx.get(from)).data() || {};
    if ((f[gift.currency] || 0) < gift.price) throw new HttpsError('failed-precondition', 'balance');
    tx.update(from, { [gift.currency]: FieldValue.increment(-gift.price) });
    // Receiver earns "charm" points equal to the gift price.
    tx.set(to, { charm: FieldValue.increment(gift.price) }, { merge: true });
    if (roomId) {
      tx.set(db.collection('rooms').doc(roomId).collection('messages').doc(), {
        type: 'gift', giftId, uid: req.auth.uid, name: f.name || '', toUid, ts: FieldValue.serverTimestamp(),
      });
    }
  });
  return { ok: true };
});
