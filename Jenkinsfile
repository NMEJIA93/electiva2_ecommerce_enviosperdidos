def terraformLocalEnv(String dockerHost) {
    return [
        "TF_VAR_docker_host=${dockerHost}",
        'TF_VAR_network_name=electiva2-ecommerce-network-local',
        'TF_VAR_image_name=electiva2-ecommerce-enviosperdidos-api-local',
        'TF_VAR_image_tag=local',
        'TF_VAR_app_container_name=electiva2-ecommerce-api-local',
        'TF_VAR_app_port=5001',
        'TF_VAR_mongo_image=mongo:7',
        'TF_VAR_mongo_container_name=electiva2-ecommerce-mongo-local',
        'TF_VAR_mongo_volume_name=electiva2-ecommerce-mongo-data-local',
        'TF_VAR_mongo_host_port=27019',
        'TF_VAR_mongodb_database=ecommerce_enviosperdidos',
        'TF_VAR_jwt_secret=jenkins_ci_secret_key_at_least_32_chars_long',
        'TF_VAR_jwt_expires_in=24h',
        'TF_VAR_node_env=development',
        'TF_VAR_notification_cron=*/5 * * * *',
        'TF_VAR_notification_max_retries=3'
    ]
}

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

        stage('Terraform validate') {
            steps {
                echo '[CI] Stage: Terraform validate - checking Terraform module in terraform/'
                script {
                    if (isUnix()) {
                        withEnv(terraformLocalEnv('unix:///var/run/docker.sock')) {
                            sh '''
                                cd terraform
                                terraform fmt -check -recursive .
                                terraform init -backend=false
                                terraform validate
                            '''
                        }
                    } else {
                        withEnv(terraformLocalEnv('npipe:////./pipe/docker_engine')) {
                            bat '''
                                cd terraform
                                terraform fmt -check -recursive .
                                terraform init -backend=false
                                terraform validate
                            '''
                        }
                    }
                }
            }
        }

        stage('Terraform cleanup') {
            steps {
                echo '[CI] Stage: Terraform cleanup - destroying previous local Docker infrastructure before planning'
                script {
                    if (isUnix()) {
                        withEnv(terraformLocalEnv('unix:///var/run/docker.sock')) {
                            sh '''
                                cd terraform
                                terraform destroy -input=false -auto-approve || true
                            '''
                        }
                    } else {
                        withEnv(terraformLocalEnv('npipe:////./pipe/docker_engine')) {
                            bat '''
                                cd terraform
                                terraform destroy -input=false -auto-approve || true
                            '''
                        }
                    }
                }
            }
        }

        stage('Terraform plan') {
            steps {
                echo '[CI] Stage: Terraform plan - generating a local Docker plan'
                script {
                    if (isUnix()) {
                        withEnv(terraformLocalEnv('unix:///var/run/docker.sock')) {
                            sh '''
                                cd terraform
                                terraform plan -input=false -out=tfplan
                            '''
                        }
                    } else {
                        withEnv(terraformLocalEnv('npipe:////./pipe/docker_engine')) {
                            bat '''
                                cd terraform
                                terraform plan -input=false -out=tfplan
                            '''
                        }
                    }
                }
            }
        }

        stage('Terraform apply') {
            steps {
                echo '[CI] Stage: Terraform apply - creating Docker infrastructure from the saved plan'
                script {
                    if (isUnix()) {
                        withEnv(terraformLocalEnv('unix:///var/run/docker.sock')) {
                            sh '''
                                cd terraform
                                terraform apply -input=false -auto-approve tfplan
                            '''
                        }
                    } else {
                        withEnv(terraformLocalEnv('npipe:////./pipe/docker_engine')) {
                            bat '''
                                cd terraform
                                terraform apply -input=false -auto-approve tfplan
                            '''
                        }
                    }
                }
            }
        }

        stage('Verify terraform deployment') {
            steps {
                echo '[CI] Stage: Verify terraform deployment - waiting for API container to answer'
                script {
                    if (isUnix()) {
                        sh '''
                            echo "[CI] Waiting for API container on http://localhost:5001/"
                            for i in $(seq 1 30); do
                                if curl -fsS http://localhost:5001/ >/dev/null; then
                                    echo "[CI] Terraform deployment is reachable"
                                    exit 0
                                fi
                                sleep 2
                            done
                            echo "[CI] API did not become reachable in time"
                            cd terraform
                            terraform output || true
                            exit 1
                        '''
                    } else {
                        bat '''
                            echo [CI] Waiting for API container on http://localhost:5001/
                            powershell -NoProfile -Command "$ok = $false; for ($i=0; $i -lt 30; $i++) { try { Invoke-WebRequest -UseBasicParsing http://localhost:5001/ | Out-Null; $ok = $true; break } catch { Start-Sleep -Seconds 2 } }; if (-not $ok) { Write-Host '[CI] API did not become reachable in time'; Set-Location terraform; terraform output; exit 1 }"
                            echo [CI] Terraform deployment is reachable
                        '''
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
                        echo "[CI] Post: cleaning Terraform-managed infrastructure"
                    '''
                } else {
                    bat '''
                        echo [CI] Terraform-managed infrastructure left running after pipeline completion
                    '''
                }
            }
        }
    }
}
