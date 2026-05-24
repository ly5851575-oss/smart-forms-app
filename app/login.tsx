import React, { useState } from 'react';
import { ScrollView, Text, View, Pressable, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { signInWithGoogle } from '@/lib/_core/auth-service';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const router = useRouter();
  const colors = useColors();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: '904312838032-17rg0okkkv5opcnqf7uj3g4of2nbvulq.apps.googleusercontent.com',
    iosClientId: '904312838032-17rg0okkkv5opcnqf7uj3g4of2nbvulq.apps.googleusercontent.com',
    androidClientId: '904312838032-17rg0okkkv5opcnqf7uj3g4of2nbvulq.apps.googleusercontent.com',
  });

  React.useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      handleGoogleSignIn(id_token);
    }
  }, [response]);

  const handleGoogleSignIn = async (idToken: string) => {
    try {
      setLoading(true);
      setError(null);
      await signInWithGoogle(idToken);
      router.replace('/(tabs)');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'فشل تسجيل الدخول';
      setError(errorMessage);
      Alert.alert('خطأ', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
        <View className="flex-1 items-center justify-center px-6 gap-8">
          {/* Header */}
          <View className="items-center gap-2">
            <Text className="text-4xl font-bold text-foreground">نماذج ذكية</Text>
            <Text className="text-base text-muted text-center">إدارة النماذج بذكاء</Text>
          </View>

          {/* Error Message */}
          {error && (
            <View className="w-full bg-error/10 border border-error rounded-lg p-3">
              <Text className="text-error text-center text-sm">{error}</Text>
            </View>
          )}

          {/* Google Sign In Button */}
          <Pressable
            disabled={loading || !request}
            onPress={() => promptAsync()}
            style={({ pressed }) => [{
              opacity: pressed ? 0.7 : 1,
              backgroundColor: colors.primary,
              paddingVertical: 12,
              paddingHorizontal: 24,
              borderRadius: 8,
              width: '100%',
              alignItems: 'center',
            }]}
          >
            {loading ? (
              <ActivityIndicator color={colors.background} />
            ) : (
              <Text className="text-background font-semibold text-base">تسجيل الدخول بـ Google</Text>
            )}
          </Pressable>

          {/* Email Sign In Button */}
          <Pressable
            onPress={() => router.push('/email-login')}
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
            <Text className="text-foreground font-semibold text-base">تسجيل الدخول بالبريد الإلكتروني</Text>
          </Pressable>

          {/* Register Link */}
          <View className="flex-row items-center justify-center gap-1">
            <Text className="text-muted text-sm">ليس لديك حساب؟</Text>
            <Pressable onPress={() => router.push('/register')}>
              <Text className="text-primary font-semibold text-sm">إنشاء حساب</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

