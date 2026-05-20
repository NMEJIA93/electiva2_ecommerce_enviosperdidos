def terraformEC2Env(String ecrUrl, String imageTag, String sshKeyPath) {
    return [
        // AWS / infraestructura
        "TF_VAR_aws_region=us-east-1",
        "TF_VAR_instance_type=t2.micro",
        "TF_VAR_key_pair_name=electiva2-ecommerce-key",
        "TF_VAR_ssh_private_key_path=${sshKeyPath}",
        "TF_VAR_iam_instance_profile_name=electiva2-ecommerce-ec2-profile",

        // ECR / imagen
        "TF_VAR_ecr_repository_url=${ecrUrl}",
        "TF_VAR_image_tag=${imageTag}",

        // Aplicación
        "TF_VAR_app_port=5001",
        "TF_VAR_mongo_container_name=mongo",
        "TF_VAR_mongo_volume_name=mongo-data",
        "TF_VAR_mongodb_database=ecommerce_enviosperdidos",
        'TF_VAR_jwt_secret=jenkins_ci_secret_key_at_least_32_chars_long',
        'TF_VAR_jwt_expires_in=24h',
        'TF_VAR_node_env=production',
        'TF_VAR_notification_cron=*/5 * * * *',
        'TF_VAR_notification_max_retries=3',
        'TF_VAR_aws_sns_topic_arn=arn:aws:sns:us-east-1:155190455562:electiva2-ecommerce-notifications'
    ]
}

pipeline {
    agent any

    options {
        timestamps()
        disableConcurrentBuilds()
    }

    environment {
        AWS_REGION    = 'us-east-1'
        ECR_REPO_NAME = 'electiva2-ecommerce-api'
        IMAGE_TAG     = "${env.BUILD_NUMBER}"
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

        stage('Terraform validate') {
            steps {
                echo '[CI] Stage: Terraform validate - checking terraform/ec2 module'
                script {
                    withCredentials([
                        string(credentialsId: 'aws-access-key-id',     variable: 'AWS_ACCESS_KEY_ID'),
                        string(credentialsId: 'aws-secret-access-key', variable: 'AWS_SECRET_ACCESS_KEY')
                    ]) {
                        if (isUnix()) {
                            sh '''
                                cd terraform/ec2
                                terraform fmt -check -recursive .
                                terraform init -backend=false
                                terraform validate
                            '''
                        } else {
                            bat '''
                                cd terraform/ec2
                                terraform fmt -check -recursive .
                                terraform init -backend=false
                                terraform validate
                            '''
                        }
                    }
                }
            }
        }

        stage('Build Docker image') {
            steps {
                echo '[CI] Stage: Build Docker image'
                script {
                    if (isUnix()) {
                        sh "docker build -t ${ECR_REPO_NAME}:${IMAGE_TAG} ."
                    } else {
                        bat "docker build -t ${ECR_REPO_NAME}:${IMAGE_TAG} ."
                    }
                }
            }
        }

        stage('Push to ECR') {
            steps {
                echo '[CI] Stage: Push image to Amazon ECR'
                script {
                    withCredentials([
                        string(credentialsId: 'aws-access-key-id',     variable: 'AWS_ACCESS_KEY_ID'),
                        string(credentialsId: 'aws-secret-access-key', variable: 'AWS_SECRET_ACCESS_KEY')
                    ]) {
                        def accountId = sh(
                            script: 'aws sts get-caller-identity --query Account --output text',
                            returnStdout: true
                        ).trim()
                        env.ECR_URL = "${accountId}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPO_NAME}"

                        sh """
                            aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${env.ECR_URL}
                            docker tag ${ECR_REPO_NAME}:${IMAGE_TAG} ${env.ECR_URL}:${IMAGE_TAG}
                            docker tag ${ECR_REPO_NAME}:${IMAGE_TAG} ${env.ECR_URL}:latest
                            docker push ${env.ECR_URL}:${IMAGE_TAG}
                            docker push ${env.ECR_URL}:latest
                        """
                    }
                }
            }
        }

        stage('Terraform plan') {
            steps {
                echo '[CI] Stage: Terraform plan - terraform/ec2'
                script {
                    withCredentials([
                        string(credentialsId: 'aws-access-key-id',     variable: 'AWS_ACCESS_KEY_ID'),
                        string(credentialsId: 'aws-secret-access-key', variable: 'AWS_SECRET_ACCESS_KEY'),
                        file(credentialsId: 'ec2-ssh-private-key',     variable: 'EC2_SSH_KEY_FILE')
                    ]) {
                        sh "chmod 600 ${EC2_SSH_KEY_FILE}"
                        withEnv(terraformEC2Env(env.ECR_URL, env.IMAGE_TAG, env.EC2_SSH_KEY_FILE)) {
                            sh '''
                                cd terraform/ec2
                                terraform init
                                terraform plan -input=false -out=tfplan
                            '''
                        }
                    }
                }
            }
        }

        stage('Terraform apply') {
            steps {
                echo '[CI] Stage: Terraform apply - terraform/ec2'
                script {
                    withCredentials([
                        string(credentialsId: 'aws-access-key-id',     variable: 'AWS_ACCESS_KEY_ID'),
                        string(credentialsId: 'aws-secret-access-key', variable: 'AWS_SECRET_ACCESS_KEY'),
                        file(credentialsId: 'ec2-ssh-private-key',     variable: 'EC2_SSH_KEY_FILE')
                    ]) {
                        sh "chmod 600 ${EC2_SSH_KEY_FILE}"
                        withEnv(terraformEC2Env(env.ECR_URL, env.IMAGE_TAG, env.EC2_SSH_KEY_FILE)) {
                            sh '''
                                cd terraform/ec2
                                terraform apply -input=false -auto-approve tfplan
                            '''
                        }
                    }
                }
            }
        }

        stage('Verify deployment') {
            steps {
                echo '[CI] Stage: Verify deployment - health check en EC2'
                script {
                    withCredentials([
                        string(credentialsId: 'aws-access-key-id',     variable: 'AWS_ACCESS_KEY_ID'),
                        string(credentialsId: 'aws-secret-access-key', variable: 'AWS_SECRET_ACCESS_KEY')
                    ]) {
                        def ec2Ip = sh(
                            script: 'cd terraform/ec2 && terraform output -raw ec2_public_ip',
                            returnStdout: true
                        ).trim()

                        sh """
                            echo "[CI] Waiting for API at http://${ec2Ip}:5001/"
                            for i in \$(seq 1 30); do
                                if curl -fsS http://${ec2Ip}:5001/ >/dev/null 2>&1; then
                                    echo "[CI] API is reachable at http://${ec2Ip}:5001/"
                                    exit 0
                                fi
                                echo "[CI] Attempt \$i/30 - not ready yet, waiting 10s..."
                                sleep 10
                            done
                            echo "[CI] ERROR: API did not become reachable in time"
                            exit 1
                        """
                    }
                }
            }
        }

    }

    post {
        always {
            sh 'docker image prune -f 2>/dev/null || true'
            echo '[CI] Pipeline finished. EC2 instance left running in AWS.'
        }
        success {
            script {
                withCredentials([
                    string(credentialsId: 'aws-access-key-id',     variable: 'AWS_ACCESS_KEY_ID'),
                    string(credentialsId: 'aws-secret-access-key', variable: 'AWS_SECRET_ACCESS_KEY')
                ]) {
                    def ec2Ip = sh(
                        script: 'cd terraform/ec2 && terraform output -raw ec2_public_ip 2>/dev/null || echo unknown',
                        returnStdout: true
                    ).trim()
                    echo "[CI] Deployment successful. API running at http://${ec2Ip}:5001/"
                }
            }
        }
    }
}
