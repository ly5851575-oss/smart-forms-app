package com.app.smart.forms

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import com.app.smart.forms.ui.LoginScreen
import com.app.smart.forms.ui.theme.SmartFormsTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            SmartFormsTheme {
                Surface(color = MaterialTheme.colorScheme.background) {
                    LoginScreen()
                }
            }
        }
    }
}
