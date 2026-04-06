pipeline {
    agent any

    stages {
        stage('Install dependencies') {
            steps {
                script {
                    if (isUnix()) {
                        sh 'npm install'
                    } else {
                        bat 'npm install'
                    }
                }
            }
        }

        stage('Run app') {
            steps {
                script {
                    if (isUnix()) {
                        sh '''
                            nohup npm run start > app.log 2>&1 &
                            echo $! > .app.pid
                            sleep 10
                            curl -f http://localhost:5000/
                        '''
                    } else {
                        bat '''
                            powershell -NoProfile -Command "$p = Start-Process cmd -ArgumentList '/c','npm run start' -PassThru; $p.Id | Set-Content .app.pid"
                            powershell -NoProfile -Command "Start-Sleep -Seconds 10"
                            powershell -NoProfile -Command "Invoke-WebRequest -UseBasicParsing http://localhost:5000/ | Out-Null"
                        '''
                    }
                }
            }
        }

        stage('Run tests') {
            steps {
                script {
                    if (isUnix()) {
                        sh 'npm test'
                    } else {
                        bat 'npm test'
                    }
                }
            }
        }
    }

    post {
        always {
            script {
                if (isUnix()) {
                    sh '''
                        if [ -f .app.pid ]; then
                            kill $(cat .app.pid) || true
                        fi
                    '''
                } else {
                    bat '''
                        powershell -NoProfile -Command "if (Test-Path .app.pid) { $pid = Get-Content .app.pid; Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue }"
                    '''
                }
            }
        }
    }
}
