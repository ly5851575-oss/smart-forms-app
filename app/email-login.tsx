import React, { useState } from 'react';
import { ScrollView, Text, View, Pressable, ActivityIndicator, Alert, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { signInWithEmail } from '@/lib/_core/auth-service';
import { isValidEmail, getEmailError, getPasswordError } from '@/lib/validators';

export default function EmailLoginScreen() {
  const router = useRouter();
  const colors = useColors();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const validateForm = (): boolean => {
    const emailErr = getEmailError(email);
    const passwordErr = getPasswordError(password);
    
    setEmailError(emailErr);
    setPasswordError(passwordErr);
    
    return !emailErr && !passwordErr;
  };

  const handleSignIn = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      setError(null);
      const user = await signInWithEmail(email, password);
      
      if (!user.emailVerified) {
        router.replace(`/email-verification?email=${email}`);
      } else {
        router.replace('/(tabs)');
      }
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
        <View className="flex-1 items-center justify-center px-6 gap-6">
          {/* Header */}
          <View className="items-center gap-2 w-full">
            <Pressable onPress={() => router.back()}>
              <Text className="text-primary font-semibold text-base">← العودة</Text>
            </Pressable>
            <Text className="text-3xl font-bold text-foreground mt-4">تسجيل الدخول</Text>
            <Text className="text-base text-muted text-center">أدخل بيانات حسابك</Text>
          </View>

          {/* Error Message */}
          {error && (
            <View className="w-full bg-error/10 border border-error rounded-lg p-3">
              <Text className="text-error text-center text-sm">{error}</Text>
            </View>
          )}

          {/* Email Input */}
          <View className="w-full gap-2">
            <Text className="text-foreground font-semibold text-sm">البريد الإلكتروني</Text>
            <TextInput
              placeholder="example@email.com"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setEmailError(null);
              }}
              placeholderTextColor={colors.muted}
              keyboardType="email-address"
              autoCapitalize="none"
              style={{
                borderWidth: 1,
                borderColor: emailError ? colors.error : colors.border,
                borderRadius: 8,
                paddingHorizontal: 12,
                paddingVertical: 10,
                color: colors.foreground,
                fontSize: 16,
              }}
            />
            {emailError && <Text className="text-error text-xs">{emailError}</Text>}
          </View>

          {/* Password Input */}
          <View className="w-full gap-2">
            <Text className="text-foreground font-semibold text-sm">كلمة المرور</Text>
            <TextInput
              placeholder="••••••••"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setPasswordError(null);
              }}
              placeholderTextColor={colors.muted}
              secureTextEntry
              style={{
                borderWidth: 1,
                borderColor: passwordError ? colors.error : colors.border,
                borderRadius: 8,
                paddingHorizontal: 12,
                paddingVertical: 10,
                color: colors.foreground,
                fontSize: 16,
              }}
            />
            {passwordError && <Text className="text-error text-xs">{passwordError}</Text>}
          </View>

          {/* Forgot Password Link */}
          <Pressable onPress={() => router.push('/forgot-password')}>
            <Text className="text-primary font-semibold text-sm">نسيت كلمة المرور؟</Text>
          </Pressable>

          {/* Sign In Button */}
          <Pressable
            disabled={loading}
            onPress={handleSignIn}
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
              <Text className="text-background font-semibold text-base">تسجيل الدخول</Text>
            )}
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

