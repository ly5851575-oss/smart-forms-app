import React, { useState } from 'react';
import { ScrollView, Text, View, Pressable, ActivityIndicator, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { auth } from '@/lib/_core/firebase';
import { sendVerificationEmail, logEmailVerified, createUserDocument } from '@/lib/_core/auth-service';
import { getAnalytics, logEvent } from 'firebase/analytics';

export default function EmailVerificationScreen() {
  const router = useRouter();
  const colors = useColors();
  const { email } = useLocalSearchParams<{ email: string }>();
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [resendSuccess, setResendSuccess] = useState(false);

  const handleVerifyEmail = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccessMessage(null);

      const user = auth.currentUser;
      if (!user) {
        setError('لم يتم العثور على المستخدم');
        return;
      }

      // Reload user to get updated email verification status
      await user.reload();

      if (user.emailVerified) {
        // Create user document if not exists
        try {
          await createUserDocument(user, 'email');
        } catch (err) {
          console.log('User document already exists or error creating it');
        }

        // Log analytics event
        const analytics = await getAnalytics();
        if (analytics) {
          logEvent(analytics, 'email_verified', {
            email: user.email,
            timestamp: new Date().toISOString(),
          });
        }

        setSuccessMessage('تم تفعيل البريد بنجاح! جاري الانتقال...');
        setTimeout(() => {
          router.replace('/(tabs)');
        }, 1500);
      } else {
        setError('لم يتم تفعيل البريد بعد. يرجى التحقق من بريدك الإلكتروني.');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'حدث خطأ غير متوقع';
      setError(errorMessage);
      Alert.alert('خطأ', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = async () => {
    try {
      setResendLoading(true);
      setError(null);
      setResendSuccess(false);

      const user = auth.currentUser;
      if (!user) {
        setError('لم يتم العثور على المستخدم');
        return;
      }

      await sendVerificationEmail(user);
      setResendSuccess(true);
      Alert.alert('نجح', 'تم إرسال رسالة التحقق مرة أخرى');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'فشل إعادة إرسال الرسالة';
      setError(errorMessage);
      Alert.alert('خطأ', errorMessage);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
        <View className="flex-1 items-center justify-center px-6 gap-6">
          {/* Header */}
          <View className="items-center gap-2 w-full">
            <Text className="text-3xl font-bold text-foreground">تحقق من بريدك</Text>
            <Text className="text-base text-muted text-center">لقد أرسلنا رسالة تحقق إلى:</Text>
            <Text className="text-base font-semibold text-foreground text-center">{email}</Text>
          </View>

          {/* Info Box */}
          <View className="w-full bg-primary/10 border border-primary rounded-lg p-4">
            <Text className="text-foreground text-sm leading-relaxed text-center">
              افتح بريدك الإلكتروني واضغط على رابط التفعيل، ثم عد إلى التطبيق واضغط على "تحققت من البريد"
            </Text>
          </View>

          {/* Error Message */}
          {error && (
            <View className="w-full bg-error/10 border border-error rounded-lg p-3">
              <Text className="text-error text-center text-sm">{error}</Text>
            </View>
          )}

          {/* Success Message */}
          {successMessage && (
            <View className="w-full bg-success/10 border border-success rounded-lg p-3">
              <Text className="text-success text-center text-sm">{successMessage}</Text>
            </View>
          )}

          {/* Resend Success Message */}
          {resendSuccess && (
            <View className="w-full bg-success/10 border border-success rounded-lg p-3">
              <Text className="text-success text-center text-sm">تم إرسال الرسالة بنجاح</Text>
            </View>
          )}

          {/* Verify Button */}
          <Pressable
            disabled={loading}
            onPress={handleVerifyEmail}
            style={({ pressed }) => [{
              opacity: pressed ? 0.7 : 1,
              backgroundColor: colors.primary,
              paddingVertical: 12,
              paddingHorizontal: 24,
              borderRadius: 8,
              width: '100%',
              alignItems: 'center',
              marginTop: 8,
            }]}
          >
            {loading ? (
              <ActivityIndicator color={colors.background} />
            ) : (
              <Text className="text-background font-semibold text-base">تحققت من البريد</Text>
            )}
          </Pressable>

          {/* Resend Button */}
          <Pressable
            disabled={resendLoading}
            onPress={handleResendEmail}
            style={({ pressed }) => [{
              opacity: pressed ? 0.7 : 1,
              backgroundColor: colors.surface,
              paddingVertical: 12,
              paddingHorizontal: 24,
              borderRadius: 8,
              width: '100%',
              alignItems: 'center',
              borderWidth: 1,
              borderColor: colors.border,
            }]}
          >
            {resendLoading ? (
              <ActivityIndicator color={colors.primary} />
            ) : (
              <Text className="text-foreground font-semibold text-base">إعادة إرسال الرسالة</Text>
            )}
          </Pressable>

          {/* Back Link */}
          <Pressable onPress={() => router.back()}>
            <Text className="text-primary font-semibold text-sm">← العودة</Text>
          </Pressable>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

