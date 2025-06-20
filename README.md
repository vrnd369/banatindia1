# Banat India - E-commerce Platform

A modern e-commerce platform for premium toothbrushes, built with React and Firebase.

## Features

### Authentication
- **Phone Authentication**: Sign up and login using mobile number and OTP verification
- **Email/Password Authentication**: Traditional email and password login
- **Social Login**: Google and Facebook authentication
- **User Profile Management**: Complete user profile with personal information

### Phone Authentication Setup

The application now supports phone authentication with the following features:

1. **Signup Process**:
   - Enter mobile number (10 digits)
   - Receive OTP via SMS
   - Verify OTP
   - Complete profile with name and email (optional)

2. **Login Process**:
   - Choose between Email or Phone authentication
   - For phone: Enter mobile number → Receive OTP → Verify OTP
   - For email: Traditional email/password login

3. **User Profile**:
   - User data is stored in Firebase Realtime Database
   - Profile includes: name, email, phone number, creation date, last login

## Testing Phone Authentication

### Prerequisites
1. Firebase project with Phone Authentication enabled
2. Test phone numbers added to Firebase Console
3. reCAPTCHA verification configured

### Test Phone Numbers
To test phone authentication, you need to add test phone numbers in your Firebase Console:

1. Go to Firebase Console → Authentication → Sign-in method
2. Enable Phone Authentication
3. Add test phone numbers:
   - Format: +91XXXXXXXXXX (for India)
   - Example: +919876543210

### Testing Steps

1. **Start the application**:
   ```bash
   npm start
   ```

2. **Test Signup**:
   - Navigate to `/signup`
   - Enter a test phone number (e.g., 9876543210)
   - Click "Send OTP"
   - Complete reCAPTCHA verification
   - Enter the OTP received in Firebase Console
   - Fill in your name and email
   - Complete signup

3. **Test Login**:
   - Navigate to `/login`
   - Click "Phone" tab
   - Enter the same test phone number
   - Verify OTP
   - Should redirect to dashboard

### Firebase Configuration

Make sure your Firebase configuration includes:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project-default-rtdb.firebaseio.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id",
  measurementId: "your-measurement-id"
};
```

### Important Notes

1. **reCAPTCHA**: The app uses reCAPTCHA verification for phone authentication
2. **Country Code**: Currently set to +91 (India). Modify in `src/firebase/config.js` for other countries
3. **Test Mode**: In development, use test phone numbers from Firebase Console
4. **Production**: For production, remove test phone numbers and use real SMS verification

## Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Configure Firebase settings
4. Start development server: `npm start`

## Technologies Used

- React.js
- Firebase Authentication
- Firebase Realtime Database
- React Router
- CSS3

## Project Structure

```
src/
├── components/          # Reusable components
├── contexts/           # React contexts (AuthContext)
├── firebase/           # Firebase configuration and utilities
├── pages/              # Page components
├── assets/             # Images and static files
└── App.js              # Main application component
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
