import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyBUbMABghq8lqtcLYV43isjnPmXM9W0W1s",
    authDomain: "refill-impact-dashboard.firebaseapp.com",
    databaseURL: "https://refill-impact-dashboard-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "refill-impact-dashboard",
    storageBucket: "refill-impact-dashboard.appspot.com",
    messagingSenderId: "673395383094",
    appId: "1:673395383094:web:dc44c5a139eb0d52187197"
};

const firebaseApp = initializeApp(firebaseConfig);
export default firebaseApp;