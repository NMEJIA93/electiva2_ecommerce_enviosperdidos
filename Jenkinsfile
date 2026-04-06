pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                git branch: 'feature/pipeline',
                    credentialsId: 'github-pat',
                    url: 'https://github.com/NMEJIA93/electiva2_ecommerce_enviosperdidos.git'
            }
        }

        stage('Install dependencies') {
            steps {
                script {
                    if (isUnix()) {
                        sh 'npm ci'
                    } else {
                        bat 'npm ci'
                    }
                }
            }
        }

        stage('Build') {
            steps {
                script {
                    if (isUnix()) {
                        sh 'npm run build'
                    } else {
                        bat 'npm run build'
                    }
                }
            }
        }
    }
}
