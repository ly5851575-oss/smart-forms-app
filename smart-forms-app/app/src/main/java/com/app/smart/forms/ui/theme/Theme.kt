package com.app.smart.forms.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable

private val LightColors = lightColorScheme(
    primary = SmartPrimary,
    secondary = SmartSecondary,
    background = SmartBackground
)

private val DarkColors = darkColorScheme(
    primary = SmartPrimaryDark,
    secondary = SmartPrimaryDark
)

@Composable
fun SmartFormsTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    MaterialTheme(
        colorScheme = if (darkTheme) DarkColors else LightColors,
        content = content
    )
}
