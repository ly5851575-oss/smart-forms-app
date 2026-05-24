import React, { useState } from 'react';
import { ScrollView, Text, View, Pressable, ActivityIndicator, Alert, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { registerWithEmail } from '@/lib/_core/auth-service';
import {
  getNameError,
  getEmailError,
  getPasswordError,
  getConfirmPasswordError,
} from '@/lib/validators';

export default function RegisterScreen() {
  const router = useRouter();
  const colors = useColors();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);

  const validateForm = (): boolean => {
    const nameErr = getNameError(fullName);
    const emailErr = getEmailError(email);
    const passwordErr = getPasswordError(password);
    const confirmErr = getConfirmPasswordError(password, confirmPassword);

    setNameError(nameErr);
    setEmailError(emailErr);
    setPasswordError(passwordErr);
    setConfirmPasswordError(confirmErr);

    return !nameErr && !emailErr && !passwordErr && !confirmErr;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      setError(null);
      await registerWithEmail(email, password, fullName);
      router.replace(`/email-verification?email=${email}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'فشل إنشاء الحساب';
      setError(errorMessage);
      Alert.alert('خطأ', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 items-center justify-center px-6 gap-6 py-8">
          {/* Header */}
          <View className="items-center gap-2 w-full">
            <Pressable onPress={() => router.back()}>
              <Text className="text-primary font-semibold text-base">← العودة</Text>
            </Pressable>
            <Text className="text-3xl font-bold text-foreground mt-4">إنشاء حساب</Text>
            <Text className="text-base text-muted text-center">أنشئ حسابك الآن</Text>
          </View>

          {/* Error Message */}
          {error && (
            <View className="w-full bg-error/10 border border-error rounded-lg p-3">
              <Text className="text-error text-center text-sm">{error}</Text>
            </View>
          )}

          {/* Full Name Input */}
          <View className="w-full gap-2">
            <Text className="text-foreground font-semibold text-sm">الاسم الكامل</Text>
            <TextInput
              placeholder="أحمد محمد"
              value={fullName}
              onChangeText={(text) => {
                setFullName(text);
                setNameError(null);
              }}
              placeholderTextColor={colors.muted}
              style={{
                borderWidth: 1,
                borderColor: nameError ? colors.error : colors.border,
                borderRadius: 8,
                paddingHorizontal: 12,
                paddingVertical: 10,
                color: colors.foreground,
                fontSize: 16,
              }}
            />
            {nameError && <Text className="text-error text-xs">{nameError}</Text>}
          </View>

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

          {/* Confirm Password Input */}
          <View className="w-full gap-2">
            <Text className="text-foreground font-semibold text-sm">تأكيد كلمة المرور</Text>
            <TextInput
              placeholder="••••••••"
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                setConfirmPasswordError(null);
              }}
              placeholderTextColor={colors.muted}
              secureTextEntry
              style={{
                borderWidth: 1,
                borderColor: confirmPasswordError ? colors.error : colors.border,
                borderRadius: 8,
                paddingHorizontal: 12,
                paddingVertical: 10,
                color: colors.foreground,
                fontSize: 16,
              }}
            />
            {confirmPasswordError && <Text className="text-error text-xs">{confirmPasswordError}</Text>}
          </View>

          {/* Register Button */}
          <Pressable
            disabled={loading}
            onPress={handleRegister}
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
              <Text className="text-background font-semibold text-base">إنشاء الحساب</Text>
            )}
          </Pressable>

          {/* Login Link */}
          <View className="flex-row items-center justify-center gap-1">
            <Text className="text-muted text-sm">لديك حساب بالفعل؟</Text>
            <Pressable onPress={() => router.push('/email-login')}>
              <Text className="text-primary font-semibold text-sm">سجل الدخول</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

