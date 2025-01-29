# $hackathon Token App 🚀

This is a React Native Expo app that serves as the interface for the $hackathon ecosystem. The app currently functions as a Farcaster Frame, with plans to evolve into a full mobile application.

## Production Build

## Mission

To provide hackers with an intuitive interface to interact with the $hackathon system, enabling seamless participation in weekly hackathons and community engagement.

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/weeklyhackathon/new-app hackathontokenapp
   ```

2. Navigate to project directory:

   ```bash
   cd hackathontokenapp
   ```

3. Install dependencies:

```bash
npm install
```

4. Create a new branch:

```bash
git checkout -b your-branch-name
```

5. Start the development server:

```bash
npm start
```

6. Press `w` to open the web version at localhost:8081

## Building and deploying to production via orbiter

1. Build your app for web:

   ```bash
   npx expo export --platform web
   ```

2. Create an account on [orbiter](https://orbiter.host) and upload the "dist" folder to a new project inside it.

3. There are other frame magic that you need to do before this, and i will add the proper documentation soon. (Feel free to do it yourself and submit a PR)

## Testing Farcaster Frames

For testing the app as a Farcaster Frame, I recommend using [ngrok](https://ngrok.com).
