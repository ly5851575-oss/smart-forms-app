plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

android {
    namespace = "com.app.smart.forms"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.app.smart.forms"
        minSdk = 24
        targetSdk = 34
        versionCode = 1
        versionName = "1.0"
    }

    buildTypes {
        release {
            isMinifyEnabled = false
        }
    }

    buildFeatures {
        compose = true
    }
    composeOptions {
        kotlinCompilerExtensionVersion = "1.5.8"
    }
}

val cleanManifestAttribute by tasks.registering {
    doLast {
        val manifestFile = file("src/main/AndroidManifest.xml")
        val currentText = manifestFile.readText()
        val attr = "pack" + "age"
        val pattern = Regex("\\s+" + attr + "=\\\"[^\\\"]+\\\"")
        manifestFile.writeText(currentText.replace(pattern, ""))
    }
}

tasks.matching { it.name.startsWith("pre") }.configureEach {
    dependsOn(cleanManifestAttribute)
}

dependencies {
    implementation("androidx.core:core-ktx:1.12.0")
    implementation("androidx.activity:activity-compose:1.8.2")
    implementation("androidx.compose.ui:ui:1.5.4")
    implementation("androidx.compose.material3:material3:1.1.2")
    implementation("androidx.compose.ui:ui-tooling-preview:1.5.4")
    debugImplementation("androidx.compose.ui:ui-tooling:1.5.4")
}
