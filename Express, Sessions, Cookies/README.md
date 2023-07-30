# Kaomoji Project - ExpressJS Emoji Website

## Introduction

Welcome to the Kaomoji Project! This is a simple web application built using ExpressJS and session management, allowing users to explore a collection of text-based emojis known as Kaomoji. Kaomoji are emoticons that originated in Japan and are created using various combinations of characters to form expressive faces.

The main functions of this website include:
1. Displaying a list of pre-existing Kaomoji for users to browse.
2. Allowing users to add new Kaomoji to the collection.
3. Enabling users to delete Kaomoji from the collection.

ExpressJS is a powerful framework for building web applications, and we have utilized session management to provide a seamless and personalized user experience. This project aims to make Kaomoji accessible and fun for users to discover and share.

## Features

- View a list of pre-existing Kaomoji.
- Add new Kaomoji to the collection.
- Delete Kaomoji from the collection.
- User-friendly and responsive interface.
- Session management for a personalized experience.

## Installation

To run this project locally, follow these steps:

1. Clone the repository:

2. Install the dependencies:

```bash
npm install
```

3. Set up environment variables:
   
   Create a `.env` file in the root directory and define the following variables:
   
```env
PORT=3000
SESSION_SECRET=your_session_secret
```

4. Start the application:

```bash
npm start
```

5. Open your web browser and visit `http://localhost:3000` to access the Kaomoji website.

## Usage

Once the Kaomoji website is up and running, you can explore the existing collection of Kaomoji and even add or delete your own.

To add a new Kaomoji:
1. Click on the "Add Kaomoji" button.
2. Enter your desired text-based emoticon in the input field.
3. Click "Submit" to add it to the collection.

To delete a Kaomoji:
1. Find the Kaomoji you want to remove from the list.
2. Click on the "Delete" button next to that Kaomoji.
3. Confirm the deletion.

Please note that only authenticated users can add or delete Kaomoji. If you're not logged in, you'll be redirected to the login page.

---

Happy Kaomoji-ing! 😄🎉
