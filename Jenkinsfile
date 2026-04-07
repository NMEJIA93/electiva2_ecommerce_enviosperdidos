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

        stage('Start mongo') {
            steps {
                script {
                    if (isUnix()) {
                        sh '''
                            if [ ! -f .env ] && [ -f .env.example ]; then
                                cp .env.example .env
                            fi
                            docker compose down || true
                            docker compose up -d mongo
                        '''
                    } else {
                        bat '''
                            if not exist .env if exist .env.example copy /Y .env.example .env
                            cmd /c "docker compose down" || echo "Nothing to stop"
                            docker compose up -d mongo
                        '''
                    }
                }
            }
        }

        stage('Run app') {
            steps {
                script {
                    if (isUnix()) {
                        withEnv([
                            'PORT=5000',
                            'JWT_SECRET=jenkins_ci_secret_key_at_least_32_chars_long',
                            'JWT_EXPIRES_IN=24h',
                            'MONGODB_URI=mongodb://127.0.0.1:27017/ecommerce_enviosperdidos',
                            'NOTIFICATION_CRON=*/5 * * * *',
                            'NOTIFICATION_MAX_RETRIES=3',
                            'NODE_ENV=development'
                        ]) {
                            sh '''
                                nohup npm run start > app.log 2>&1 &
                                echo $! > .app.pid
                                for i in $(seq 1 30); do
                                    if curl -fsS http://localhost:5000/ >/dev/null; then
                                        exit 0
                                    fi
                                    sleep 2
                                done
                                echo "[CI] App did not start in time. Recent logs:"
                                tail -n 200 app.log || true
                                exit 1
                            '''
                        }
                    } else {
                        withEnv([
                            'PORT=5000',
                            'JWT_SECRET=jenkins_ci_secret_key_at_least_32_chars_long',
                            'JWT_EXPIRES_IN=24h',
                            'MONGODB_URI=mongodb://127.0.0.1:27017/ecommerce_enviosperdidos',
                            'NOTIFICATION_CRON=*/5 * * * *',
                            'NOTIFICATION_MAX_RETRIES=3',
                            'NODE_ENV=development'
                        ]) {
                            bat '''
                                powershell -NoProfile -Command "$proc = Start-Process cmd -ArgumentList '/c','npm run start > app.log 2>&1' -PassThru; $proc.Id | Set-Content .app.pid"
                                powershell -NoProfile -Command "$ok = $false; for ($i=0; $i -lt 30; $i++) { try { Invoke-WebRequest -UseBasicParsing http://localhost:5000/ | Out-Null; $ok = $true; break } catch { Start-Sleep -Seconds 2 } }; if (-not $ok) { Write-Host '[CI] App did not start in time. Recent logs:'; if (Test-Path app.log) { Get-Content app.log -Tail 200 }; exit 1 }"
                            '''
                        }
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
                        if [ ! -f .env ] && [ -f .env.example ]; then
                            cp .env.example .env
                        fi
                        docker compose down || true
                    '''
                } else {
                    bat '''
                        powershell -NoProfile -Command "if (Test-Path .app.pid) { $appPid = (Get-Content .app.pid -Raw).Trim(); if ($appPid) { Stop-Process -Id $appPid -Force -ErrorAction SilentlyContinue } }"
                        if not exist .env if exist .env.example copy /Y .env.example .env
                        cmd /c "docker compose down"
                    '''
                }
            }
        }
    }
}
