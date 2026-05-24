package com.app.smart.forms.ui

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable
fun LoginScreen() {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text(
            text = "نماذج ذكية",
            fontSize = 28.sp,
            fontWeight = FontWeight.Bold
        )
        Spacer(modifier = Modifier.height(16.dp))
        Text(text = "منصة إنشاء النماذج الذكية")
        Spacer(modifier = Modifier.height(32.dp))
        Button(onClick = { }) {
            Text("تسجيل الدخول عبر Google")
        }
        Spacer(modifier = Modifier.height(12.dp))
        Button(onClick = { }) {
            Text("تسجيل الدخول بالبريد الإلكتروني")
        }
        Spacer(modifier = Modifier.height(12.dp))
        OutlinedButton(onClick = { }) {
            Text("إنشاء حساب جديد")
        }
    }
}
