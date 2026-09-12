pipeline {
    agent any
    stages {
        stage('Checkout') {
            steps {
                // Pulls the latest code from your repository and branch
                checkout scm
            }
        }
        stage('Install Dependencies') {
            steps {
                // Installs Node modules needed for your React/Vite app
                sh 'npm install'
            }
        }
        stage('Build') {
            steps {
                // Compiles the production-ready build for your dashboard
                sh 'npm run build'
            }
        }
    }
    post {
        success {
            echo 'Build completed successfully!'
        }
        failure {
            echo 'Build failed. Check the console logs.'
        }
    }
}