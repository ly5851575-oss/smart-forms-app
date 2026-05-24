import React, { useEffect } from 'react';
import { ScrollView, Text, View, Pressable, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useAuth } from '@/lib/auth-context';
import { useColors } from '@/hooks/use-colors';
import { logout } from '@/lib/_core/auth-service';
import { Timestamp } from 'firebase/firestore';

type FirebaseDateLike = Timestamp | Date | string | number | null | undefined | { toDate?: () => Date };

function toSafeDate(value: FirebaseDateLike): Date | null {
  try {
    if (!value) return null;

    if (value instanceof Date) {
      return Number.isNaN(value.getTime()) ? null : value;
    }

    if (value instanceof Timestamp) {
      return value.toDate();
    }

    if (typeof value === 'object' && typeof value.toDate === 'function') {
      const date = value.toDate();
      return date instanceof Date && !Number.isNaN(date.getTime()) ? date : null;
    }

    if (typeof value === 'string' || typeof value === 'number') {
      const date = new Date(value);
      return Number.isNaN(date.getTime()) ? null : date;
    }

    return null;
  } catch {
    return null;
  }
}

function formatArabicDate(value: FirebaseDateLike): string {
  const date = toSafeDate(value);
  if (!date) return 'غير متوفر';
  return date.toLocaleDateString('ar-SA');
}

export default function HomeScreen() {
  const router = useRouter();
  const colors = useColors();
  const { user, userData, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getTrialDaysRemaining = (): number => {
    const endDate = toSafeDate(userData?.trialEndsAt as FirebaseDateLike);
    if (!endDate) return 0;

    const now = new Date();
    const daysRemaining = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, daysRemaining);
  };

  if (loading) {
    return (
      <ScreenContainer className="bg-background items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
      </ScreenContainer>
    );
  }

  if (!user || !userData) {
    return (
      <ScreenContainer className="bg-background items-center justify-center">
        <Text className="text-foreground">جاري التحميل...</Text>
      </ScreenContainer>
    );
  }

  const subscriptionLabel =
    userData.subscriptionStatus === 'trial'
      ? 'تجربة مجانية'
      : userData.subscriptionStatus === 'active'
        ? 'مشترك'
        : userData.subscriptionStatus === 'expired'
          ? 'منتهية'
          : 'غير معروف';

  return (
    <ScreenContainer className="bg-background p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 gap-6">
          <View className="items-center gap-2">
            <Text className="text-4xl font-bold text-foreground">مرحباً</Text>
            <Text className="text-lg text-muted">{userData.displayName || userData.email || user.email}</Text>
          </View>

          <View className="w-full bg-surface rounded-2xl p-6 border border-border gap-4">
            <View className="gap-2">
              <Text className="text-sm text-muted">البريد الإلكتروني</Text>
              <Text className="text-base font-semibold text-foreground">{userData.email || user.email}</Text>
            </View>

            <View className="h-px bg-border" />

            <View className="gap-2">
              <Text className="text-sm text-muted">طريقة الدخول</Text>
              <Text className="text-base font-semibold text-foreground">
                {userData.loginProvider === 'google' ? 'Google' : 'البريد الإلكتروني'}
              </Text>
            </View>

            <View className="h-px bg-border" />

            <View className="gap-2">
              <Text className="text-sm text-muted">حالة البريد</Text>
              <View className="flex-row items-center gap-2">
                <View
                  className={`w-3 h-3 rounded-full ${
                    user.emailVerified ? 'bg-success' : 'bg-warning'
                  }`}
                />
                <Text className="text-base font-semibold text-foreground">
                  {user.emailVerified ? 'مفعّل' : 'غير مفعّل'}
                </Text>
              </View>
            </View>
          </View>

          <View className="w-full bg-primary/10 rounded-2xl p-6 border border-primary gap-4">
            <View className="gap-2">
              <Text className="text-sm text-muted">حالة الاشتراك</Text>
              <Text className="text-2xl font-bold text-primary">{subscriptionLabel}</Text>
            </View>

            {userData.subscriptionStatus === 'trial' && (
              <View className="gap-2">
                <Text className="text-sm text-muted">الأيام المتبقية</Text>
                <Text className="text-lg font-semibold text-foreground">
                  {getTrialDaysRemaining()} أيام
                </Text>
              </View>
            )}

            <View className="gap-2">
              <Text className="text-sm text-muted">تنتهي في</Text>
              <Text className="text-base font-semibold text-foreground">
                {formatArabicDate(userData.trialEndsAt as FirebaseDateLike)}
              </Text>
            </View>
          </View>

          <View className="w-full bg-surface rounded-2xl p-6 border border-border gap-2">
            <Text className="text-sm text-muted">تاريخ إنشاء الحساب</Text>
            <Text className="text-base font-semibold text-foreground">
              {formatArabicDate(userData.createdAt as FirebaseDateLike)}
            </Text>
          </View>

          <Pressable
            onPress={handleLogout}
            style={({ pressed }) => [{
              opacity: pressed ? 0.7 : 1,
              backgroundColor: colors.error,
              paddingVertical: 12,
              paddingHorizontal: 24,
              borderRadius: 8,
              alignItems: 'center',
              marginTop: 8,
            }]}
          >
            <Text className="text-background font-semibold text-base">تسجيل الخروج</Text>
          </Pressable>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
