# PromptRefiner

A high-performance Next.js application designed to transform rough ideas into structured, professional AI prompts.

## How to Save and Deploy Your Code

To save this project to your own repository and set up automatic deployments, follow these steps:

### 1. Initialize Git and Push to GitHub
If you haven't already, you can push this code to a new repository on GitHub:

1. Create a new, empty repository on [GitHub](https://github.com/new).
2. Open your terminal in this project's root directory.
3. Run the following commands:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```

### 2. Connect to Firebase App Hosting
To host your Next.js app with automatic "push-to-deploy" functionality:

1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Select your project.
3. In the left-hand menu, click on **Build** -> **App Hosting**.
4. Click **Get started** and connect your GitHub account.
5. Select the repository you just created.
6. Follow the prompts to configure your deployment settings (the default `apphosting.yaml` is already included in this project).
7. Once set up, every time you `git push` to your repository, Firebase will automatically build and deploy your app.

### 3. Local Development
To run the project locally for further testing:

```bash
npm install
npm run dev
```

The app will be available at `http://localhost:9002`.# PromptRef
