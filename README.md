# HandiShare 🤝

A real-time, dark-mode-first app for sharing tasks, tools, and expenses with your household or group. Groups sync live via Firebase Firestore — add a task, borrow an item, or log an expense and everyone in the group sees it instantly.

## Features

- **Groups** — create a group or join one with a 6-character invite code
- **Tasks** — shared to-do list with assignees, live status sync
- **Items** — lend/borrow tracking for shared tools and belongings
- **Expenses** — log shared costs, auto-split evenly, live balances per member
- **Auth** — email/password sign in via Firebase Authentication

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Configure Firebase (required for sign-in and real-time sync)

   Create a [Firebase project](https://console.firebase.google.com), enable **Authentication → Email/Password** and **Firestore Database**, then copy `.env.example` to `.env` and fill in your project's web app config values.

   Without this, the app still runs and shows a "Firebase isn't configured" notice on the sign-in screen, but sign-in and data sync are disabled.

3. Start the app

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

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
