# DevTrack - Learn React

DevTrack is a beginner-friendly React app with Firebase authentication, Firestore-backed progress tracking, a React learning module, and a built-in study timer.

## Stack

- React functional components
- React Router
- Firebase Authentication and Firestore
- Tailwind CSS

## Setup

1. Copy [.env.example](./.env.example) to `.env`.
2. Fill in your Firebase project values.
3. Run `npm install` if needed.
4. Start the app with `npm run dev`.

## Notes

- The dashboard and topic detail page are protected behind Firebase login.
- If Firebase is not configured, the app still builds and shows a setup notice on the auth pages.
- Progress and study-timer data are stored in Firestore under the logged-in user.
