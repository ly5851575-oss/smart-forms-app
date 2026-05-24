# Dialogflow Backend for Cloud Run

Backend API for Flutter to call Dialogflow safely without putting Google credentials inside the mobile app.

## Endpoints

- `GET /` — health check.
- `GET /chat` — simple browser check.
- `POST /chat` — send JSON `{ "message": "مرحبا" }` and receive `{ "reply": "..." }`.

## Deploy to Cloud Run

From Cloud Shell:

```bash
gcloud config set project flutter-ai-playground-2e118
gcloud run deploy dialogflow-backend \
  --source dialogflow-backend \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars PROJECT_ID=flutter-ai-playground-2e118,DIALOGFLOW_LANGUAGE=ar
```

After deployment, use the Cloud Run Service URL with `/chat` in Flutter.

## Important

Do not commit service account JSON files to GitHub.
