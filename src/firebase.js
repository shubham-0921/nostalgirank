import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyD32L8-6NYQlbaP-fh3ww9_EDgEfp_3ymM",
  authDomain: "nostalgirank.firebaseapp.com",
  databaseURL: "https://nostalgirank-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "nostalgirank",
  storageBucket: "nostalgirank.firebasestorage.app",
  messagingSenderId: "855809935704",
  appId: "1:855809935704:web:aea23b2bbcd18a11c87d2d",
  measurementId: "G-DYGH3YGX57"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };
