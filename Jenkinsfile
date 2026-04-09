pipeline {
    agent any

    options {
        timestamps()
    }

    stages {
        stage('Install dependencies') {
            steps {
                echo '[CI] Stage: Install dependencies - running npm install'
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
                echo '[CI] Stage: Start mongo - ensuring .env and starting Mongo container'
                script {
                    if (isUnix()) {
                        sh '''
                            if [ ! -f .env ] && [ -f .env.example ]; then
                                cp .env.example .env
                            fi
                            docker compose down --remove-orphans || true
                            MONGO_PORT=27018 docker compose up -d mongo
                        '''
                    } else {
                        bat '''
                            if not exist .env if exist .env.example copy /Y .env.example .env
                            cmd /c "docker compose down --remove-orphans"
                            set MONGO_PORT=27018&& docker compose up -d mongo
                        '''
                    }
                }
            }
        }

        stage('Run app') {
            steps {
                echo '[CI] Stage: Run app - starting API and waiting for health check'
                script {
                    if (isUnix()) {
                        withEnv([
                            'PORT=5000',
                            'JWT_SECRET=jenkins_ci_secret_key_at_least_32_chars_long',
                            'JWT_EXPIRES_IN=24h',
                            'MONGODB_URI=mongodb://127.0.0.1:27018/ecommerce_enviosperdidos',
                            'NOTIFICATION_CRON=*/5 * * * *',
                            'NOTIFICATION_MAX_RETRIES=3',
                            'NODE_ENV=development'
                        ]) {
                            sh '''
                                echo "[CI] Starting application process"
                                nohup npm run start > app.log 2>&1 &
                                echo $! > .app.pid
                                echo "[CI] Waiting for app readiness on http://localhost:5000/"
                                for i in $(seq 1 30); do
                                    if curl -fsS http://localhost:5000/ >/dev/null; then
                                        echo "[CI] App is up and reachable"
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
                            'MONGODB_URI=mongodb://127.0.0.1:27018/ecommerce_enviosperdidos',
                            'NOTIFICATION_CRON=*/5 * * * *',
                            'NOTIFICATION_MAX_RETRIES=3',
                            'NODE_ENV=development'
                        ]) {
                            bat '''
                                echo [CI] Starting application process
                                powershell -NoProfile -Command "$proc = Start-Process cmd -ArgumentList '/c','npm run start > app.log 2>&1' -PassThru; $proc.Id | Set-Content .app.pid"
                                echo [CI] Waiting for app readiness on http://localhost:5000/
                                powershell -NoProfile -Command "$ok = $false; for ($i=0; $i -lt 30; $i++) { try { Invoke-WebRequest -UseBasicParsing http://localhost:5000/ | Out-Null; $ok = $true; break } catch { Start-Sleep -Seconds 2 } }; if (-not $ok) { Write-Host '[CI] App did not start in time. Recent logs:'; if (Test-Path app.log) { Get-Content app.log -Tail 200 }; exit 1 }"
                                echo [CI] App is up and reachable
                            '''
                        }
                    }
                }
            }
        }

        stage('Run tests') {
            steps {
                echo '[CI] Stage: Run tests - executing npm test'
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
                        echo "[CI] Post: stopping app process and cleaning containers"
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
                        echo [CI] Post: stopping app process and cleaning containers
                        powershell -NoProfile -Command "if (Test-Path .app.pid) { $appPid = (Get-Content .app.pid -Raw).Trim(); if ($appPid) { Stop-Process -Id $appPid -Force -ErrorAction SilentlyContinue } }"
                        if not exist .env if exist .env.example copy /Y .env.example .env
                        cmd /c "docker compose down"
                    '''
                }
            }
        }
    }
}
