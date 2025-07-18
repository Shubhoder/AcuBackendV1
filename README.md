# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Features

### Automatic Recording Interruption Handling

The app now includes intelligent interruption handling for audio recording:

- **Background/Foreground Transitions**: When the app goes to background (e.g., switching to another app), recording automatically pauses. When you return to the app, recording resumes automatically.

- **Call Interruptions**: When a call comes in while recording, the app automatically pauses recording. When the call ends, recording resumes automatically - just like app switching!

- **Audio Session Monitoring**: The app continuously monitors the audio session state to detect any interruptions (calls, notifications, other apps using audio) and handles them seamlessly.

- **Visual Feedback**: Users see clear notifications when recording is paused due to interruptions and when it resumes.

- **Manual Resume**: Users can manually resume recording using the resume button if needed.

- **Status Indicators**: The recording status text shows the current state and reason for any pause.

This ensures that users never lose their recordings due to unexpected interruptions and provides a seamless recording experience that works exactly like app switching for both background transitions and call interruptions.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
