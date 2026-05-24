package com.app.smart.forms.ui

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable
fun LoginScreen(
    onGoogleLoginClick: () -> Unit = {},
    onEmailLoginClick: () -> Unit = {},
    onRegisterClick: () -> Unit = {}
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(24.dp),
            elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
        ) {
            Column(
                modifier = Modifier.padding(24.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Text(
                    text = "نماذج ذكية",
                    fontSize = 30.sp,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.primary,
                    textAlign = TextAlign.Center
                )
                Spacer(modifier = Modifier.height(12.dp))
                Text(
                    text = "أنشئ نماذجك بسهولة واحترافية. التسجيل الحقيقي سيتم تفعيله في المراحل التالية.",
                    textAlign = TextAlign.Center,
                    style = MaterialTheme.typography.bodyLarge
                )
                Spacer(modifier = Modifier.height(28.dp))
                Button(
                    onClick = onGoogleLoginClick,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text("تسجيل الدخول بحساب Google")
                }
                Spacer(modifier = Modifier.height(12.dp))
                Button(
                    onClick = onEmailLoginClick,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text("تسجيل الدخول بالبريد الإلكتروني")
                }
                Spacer(modifier = Modifier.height(12.dp))
                OutlinedButton(
                    onClick = onRegisterClick,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text("إنشاء حساب جديد")
                }
                Spacer(modifier = Modifier.height(18.dp))
                Text(
                    text = "باستخدامك التطبيق فأنت توافق على الشروط وسياسة الخصوصية.",
                    textAlign = TextAlign.Center,
                    style = MaterialTheme.typography.bodySmall
                )
            }
        }
    }
}
