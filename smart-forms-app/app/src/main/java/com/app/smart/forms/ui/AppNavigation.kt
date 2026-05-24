package com.app.smart.forms.ui

import androidx.compose.runtime.Composable

sealed class Screen(val route: String) {
    data object Login : Screen("login")
    data object EmailLogin : Screen("email_login")
    data object Register : Screen("register")
    data object ForgotPassword : Screen("forgot_password")
    data object Home : Screen("home")
}

@Composable
fun AppNavigation() {
    LoginScreen(
        onGoogleLoginClick = {},
        onEmailLoginClick = {},
        onRegisterClick = {}
    )
}
