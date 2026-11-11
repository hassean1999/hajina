const { onCall, HttpsError } = require('firebase-functions/v2/https');
const { defineSecret } = require('firebase-functions/params');
const { RtcTokenBuilder, RtcRole } = require('agora-token');

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
