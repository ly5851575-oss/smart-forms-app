# دليل إعداد تطبيق نماذج ذكية

## نظرة عامة

تطبيق جوال متكامل "نماذج ذكية" مع نظام مصادقة Firebase كامل يدعم:
- تسجيل الدخول عبر Google
- إنشاء حساب بالبريد الإلكتروني مع التحقق البريدي
- نظام التجربة المجانية 3 أيام
- واجهة عربية RTL

## المتطلبات

- Node.js 18+
- pnpm 9.12.0+
- Firebase Project (تم إعداده بالفعل)

## خطوات الإعداد

### 1. تثبيت المكتبات

```bash
cd smart-forms
pnpm install
```

### 2. إعداد Firebase

تم تضمين ملف `google-services.json` بالفعل في المشروع. البيانات:
- **Project ID**: flutter-ai-playground-2e118
- **Package**: com.app.smart.forms
- **API Key**: AIzaSyAsYpyywNrvt3lkZx9F74jbPdlp_y4O6Zo

### 3. تفعيل Firebase Authentication

في لوحة Firebase:

1. اذهب إلى **Authentication**
2. فعّل **Google Sign-In**:
   - اضغط على "Google"
   - اضغط "Enable"
   - اختر مشروع Google (سيتم اختياره تلقائياً)
   - اضغط "Save"

3. فعّل **Email/Password**:
   - اضغط على "Email/Password"
   - اضغط "Enable"
   - اضغط "Save"

### 4. إعداد Firestore

في لوحة Firebase:

1. اذهب إلى **Firestore Database**
2. اضغط "Create Database"
3. اختر "Start in test mode" (للتطوير)
4. اختر المنطقة (مثل: us-central1)
5. اضغط "Create"

### 5. تشغيل التطبيق

```bash
# للويب
pnpm dev:metro

# للـ Android
pnpm android

# للـ iOS
pnpm ios
```

## هيكل المشروع

```
app/
├── (tabs)/
│   ├── _layout.tsx      # Tab bar configuration
│   └── index.tsx        # Home screen (authenticated)
├── _layout.tsx          # Root layout with providers
├── login.tsx            # Login screen (Google + Email options)
├── email-login.tsx      # Email login screen
├── register.tsx         # Registration screen
├── email-verification.tsx # Email verification screen
└── forgot-password.tsx  # Password reset screen

lib/
├── _core/
│   ├── firebase.ts      # Firebase configuration
│   ├── auth-service.ts  # Authentication logic
│   └── theme.ts         # Theme configuration
├── auth-context.tsx     # Authentication provider
└── validators.ts        # Form validation utilities
```

## الميزات المطبقة

### المصادقة
- ✅ تسجيل الدخول بـ Google
- ✅ إنشاء حساب بالبريد الإلكتروني
- ✅ التحقق من البريد الإلكتروني
- ✅ استعادة كلمة المرور
- ✅ تسجيل الخروج

### Firestore
- ✅ حفظ بيانات المستخدم
- ✅ تتبع حالة الاشتراك
- ✅ نظام التجربة المجانية 3 أيام
- ✅ تحديث آخر وقت دخول

### Firebase Analytics
- ✅ login_google
- ✅ signup_email
- ✅ login_email
- ✅ email_verification_sent
- ✅ email_verified
- ✅ password_reset_sent

### الواجهة
- ✅ دعم اللغة العربية RTL
- ✅ جميع الرسائل بالعربية
- ✅ تصميم متجاوب
- ✅ رسائل خطأ واضحة

## بيانات المستخدم في Firestore

```typescript
interface UserData {
  uid: string;
  email: string;
  displayName: string;
  photoUrl?: string;
  loginProvider: 'google' | 'email';
  emailVerified: boolean;
  role: 'user' | 'admin';
  subscriptionStatus: 'trial' | 'active' | 'expired';
  trialStartAt?: Timestamp;
  trialEndsAt?: Timestamp;
  createdAt: Timestamp;
  lastLoginAt: Timestamp;
}
```

## اختبار التطبيق

### اختبار تسجيل الدخول بـ Google
1. اضغط "تسجيل الدخول بـ Google"
2. اختر حسابك
3. يجب أن تنتقل إلى الصفحة الرئيسية

### اختبار إنشاء حساب
1. اضغط "إنشاء حساب جديد"
2. أدخل البيانات
3. اضغط "إنشاء الحساب"
4. تحقق من بريدك وافتح رابط التفعيل
5. عد للتطبيق واضغط "تحققت من البريد"

### اختبار استعادة كلمة المرور
1. من شاشة تسجيل الدخول، اضغط "نسيت كلمة المرور؟"
2. أدخل بريدك الإلكتروني
3. تحقق من بريدك وافتح رابط الاستعادة

## الأخطاء الشائعة وحلولها

### خطأ: "Google Sign-In failed"
- تأكد من تفعيل Google Sign-In في Firebase
- تحقق من أن package name صحيح (com.app.smart.forms)

### خطأ: "Email verification not working"
- تأكد من تفعيل Email/Password في Firebase
- تحقق من أن البريد الإلكتروني صحيح

### خطأ: "Firestore permission denied"
- استخدم "Start in test mode" للتطوير
- في الإنتاج، اضبط قواعد الأمان

## النشر

### بناء APK للـ Android
```bash
eas build --platform android --local
```

### بناء IPA للـ iOS
```bash
eas build --platform ios --local
```

## الدعم والمساعدة

للمزيد من المعلومات:
- [Firebase Documentation](https://firebase.google.com/docs)
- [Expo Documentation](https://docs.expo.dev)
- [React Native Documentation](https://reactnative.dev)

---

تم إنشاؤه بواسطة Manus
