# meeting-room-traffic-lights
System for having colored lights that can act as cues to indicate that meetings should be starting and ending

## Deploying

Deploys are done using [serverless](https://github.com/serverless/serverless). You just need to run the deploy command in an environment with valid AWS credentials.

```bash
serverless deploy       # Deploy using serverless
```

## Development

### Google Calendar API
A "service account" is used to communicate with the Google Calendar API.

#### Useful Links
- [Google Cloud Dashboard](https://console.cloud.google.com/home/dashboard)
