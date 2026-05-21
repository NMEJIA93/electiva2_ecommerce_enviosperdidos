variable "aws_region" {
  description = "AWS region where EC2 is deployed."
  type        = string
  default     = "us-east-1"
}

variable "instance_type" {
  description = "EC2 instance type."
  type        = string
  default     = "t3.micro"
}

variable "ami_id" {
  description = "AMI ID for Amazon Linux 2023 in us-east-1."
  type        = string
  default     = "ami-0c02fb55956c7d316"
}

variable "key_pair_name" {
  description = "Name of the EC2 Key Pair created in AWS for SSH access."
  type        = string
  default     = "electiva2-ecommerce-key"
}

variable "ssh_private_key_path" {
  description = "Local path to the SSH private key (.pem) used by Terraform remote-exec."
  type        = string
  default     = "/tmp/ec2-key.pem"
}

variable "iam_instance_profile_name" {
  description = "Name of the IAM Instance Profile that allows EC2 to pull from ECR and publish to SNS."
  type        = string
  default     = "electiva2-ecommerce-ec2-profile"
}

variable "ecr_repository_url" {
  description = "Full ECR repository URL without tag, e.g. 123456789012.dkr.ecr.us-east-1.amazonaws.com/electiva2-ecommerce-api"
  type        = string
}

variable "image_tag" {
  description = "Docker image tag to pull from ECR."
  type        = string
  default     = "latest"
}

variable "app_port" {
  description = "Port the API container listens on."
  type        = number
  default     = 5001
}

variable "mongo_container_name" {
  description = "Name for the MongoDB container on the EC2 instance."
  type        = string
  default     = "mongo"
}

variable "mongo_volume_name" {
  description = "Docker volume name for MongoDB data persistence on EC2."
  type        = string
  default     = "mongo-data"
}

variable "mongodb_database" {
  description = "MongoDB database name used by the API."
  type        = string
  default     = "ecommerce_enviosperdidos"
}

variable "jwt_secret" {
  description = "JWT secret for the API."
  type        = string
  sensitive   = true
}

variable "jwt_expires_in" {
  description = "JWT expiration duration."
  type        = string
  default     = "24h"
}

variable "node_env" {
  description = "NODE_ENV value injected into the API container."
  type        = string
  default     = "production"
}

variable "notification_cron" {
  description = "Cron expression for the notification retry job."
  type        = string
  default     = "*/5 * * * *"
}

variable "notification_max_retries" {
  description = "Max retries for notification jobs."
  type        = number
  default     = 3
}

variable "aws_sns_topic_arn" {
  description = "ARN of the SNS topic for notifications."
  type        = string
}
