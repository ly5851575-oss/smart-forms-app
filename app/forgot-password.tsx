import React, { useState } from 'react';
import { ScrollView, Text, View, Pressable, ActivityIndicator, Alert, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { resetPassword } from '@/lib/_core/auth-service';
import { getEmailError } from '@/lib/validators';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const colors = useColors();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleResetPassword = async () => {
    const emailErr = getEmailError(email);
    setEmailError(emailErr);

    if (emailErr) return;

    try {
      setLoading(true);
      setError(null);
      await resetPassword(email);
      setSuccessMessage('تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني');
      setTimeout(() => {
        router.replace('/email-login');
      }, 2000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'فشل إرسال الرابط';
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
            <Text className="text-3xl font-bold text-foreground mt-4">استعادة كلمة المرور</Text>
            <Text className="text-base text-muted text-center">أدخل بريدك الإلكتروني لاستعادة كلمة المرور</Text>
          </View>

          {/* Info Box */}
          <View className="w-full bg-primary/10 border border-primary rounded-lg p-4">
            <Text className="text-foreground text-sm leading-relaxed text-center">
              سنرسل لك رابط لإعادة تعيين كلمة المرور إلى بريدك الإلكتروني
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
              editable={!successMessage}
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

          {/* Reset Button */}
          <Pressable
            disabled={loading || !!successMessage}
            onPress={handleResetPassword}
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
              <Text className="text-background font-semibold text-base">إرسال رابط الاستعادة</Text>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

