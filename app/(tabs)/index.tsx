import React, { useEffect } from 'react';
import { ScrollView, Text, View, Pressable, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useAuth } from '@/lib/auth-context';
import { useColors } from '@/hooks/use-colors';
import { logout } from '@/lib/_core/auth-service';
import { Timestamp } from 'firebase/firestore';

export default function HomeScreen() {
  const router = useRouter();
  const colors = useColors();
  const { user, userData, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading]);

  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getTrialDaysRemaining = (): number => {
    if (!userData?.trialEndsAt) return 0;
    const trialEnd = userData.trialEndsAt as Timestamp;
    const now = new Date();
    const endDate = trialEnd.toDate();
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

  return (
    <ScreenContainer className="bg-background p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 gap-6">
          {/* Welcome Header */}
          <View className="items-center gap-2">
            <Text className="text-4xl font-bold text-foreground">مرحباً</Text>
            <Text className="text-lg text-muted">{userData.displayName || userData.email}</Text>
          </View>

          {/* User Info Card */}
          <View className="w-full bg-surface rounded-2xl p-6 border border-border gap-4">
            <View className="gap-2">
              <Text className="text-sm text-muted">البريد الإلكتروني</Text>
              <Text className="text-base font-semibold text-foreground">{userData.email}</Text>
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

          {/* Subscription Info Card */}
          <View className="w-full bg-primary/10 rounded-2xl p-6 border border-primary gap-4">
            <View className="gap-2">
              <Text className="text-sm text-muted">حالة الاشتراك</Text>
              <Text className="text-2xl font-bold text-primary">
                {userData.subscriptionStatus === 'trial' ? 'تجربة مجانية' : 'مشترك'}
              </Text>
            </View>

            {userData.subscriptionStatus === 'trial' && (
              <View className="gap-2">
                <Text className="text-sm text-muted">الأيام المتبقية</Text>
                <Text className="text-lg font-semibold text-foreground">
                  {getTrialDaysRemaining()} أيام
                </Text>
              </View>
            )}

            {userData.trialEndsAt && (
              <View className="gap-2">
                <Text className="text-sm text-muted">تنتهي في</Text>
                <Text className="text-base font-semibold text-foreground">
                  {userData.trialEndsAt.toDate().toLocaleDateString('ar-SA')}
                </Text>
              </View>
            )}
          </View>

          {/* Account Created Date */}
          <View className="w-full bg-surface rounded-2xl p-6 border border-border gap-2">
            <Text className="text-sm text-muted">تاريخ إنشاء الحساب</Text>
            <Text className="text-base font-semibold text-foreground">
              {userData.createdAt.toDate().toLocaleDateString('ar-SA')}
            </Text>
          </View>

          {/* Logout Button */}
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

