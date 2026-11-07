// إعدادات حجينه
window.HAJINA_CONFIG = {
  firebase: {
    apiKey: "AIzaSyDoJn4_Z7hWpc5JDZdoMI5IjYsBajd-VoE",
    authDomain: "hajina-84598.firebaseapp.com",
    projectId: "hajina-84598",
    storageBucket: "hajina-84598.firebasestorage.app",
    messagingSenderId: "615591936540",
    appId: "1:615591936540:web:9b46d54cecf8da705255d9"
  },
  // App ID من console.agora.io 
  agoraAppId: "9792e1399a65415b9fc29153715a6700",
  // Primary Certificate من Agora
  agoraCert: "22dfc13ea2c34fb5aea90c2ec329f84d",
  // معلومات الشحن (تكدر تغيرها أي وقت)
  recharge: {
    telegram: "HsN58",   // اسم المستخدم بالتلكرام بدون @
    balanceNetwork: "آسياسيل",
    balanceNumber: "07XX XXX XXXX",
    cardLabel: "ماستر كارد (كي كارد)",
    cardNumber: "",
    packages: [
      { d: 100, p: "1,000 دينار" },
      { d: 500, p: "5,000 دينار" },
      { d: 1000, p: "10,000 دينار" },
      { d: 5000, p: "48,000 دينار" },
      { d: 10000, p: "95,000 دينار" }
    ]
  },
  // مستويات VIP حسب مجموع الماسات المشحونة
  vipLevels: [1000, 5000, 20000],
  // مفتاح YouTube Data API (اختياري، للبحث بيوتيوب)
  youtubeKey: "",
  // العملات الفضية المجانية (ما تنشحن، بس هدايا فضية)
  // أرباح المضيفين: كل نقطة جاذبية (💗) تساوي ماسة وحدة استلمها الشخص
  earnings: { minWithdraw: 10000, rateText: "كل 10,000 نقطة = 7,000 دينار" },
  welcomeSilver: 100,
  dailySilver: 100
};
