variable "aws_region" {
  description = "AWS region for SNS."
  type        = string
  default     = "us-east-1"
}

variable "sns_topic_name" {
  description = "Name for the SNS notifications topic."
  type        = string
  default     = "electiva2-ecommerce-notifications"
}

variable "sns_email_subscription" {
  description = "Email address to subscribe to the SNS topic. Leave empty to skip."
  type        = string
  default     = ""
}

variable "ecr_repository_name" {
  description = "Name for the ECR repository that stores the app Docker image."
  type        = string
  default     = "electiva2-ecommerce-api"
}
