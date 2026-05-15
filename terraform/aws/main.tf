terraform {
  required_version = ">= 1.5"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

resource "aws_sns_topic" "notifications" {
  name = var.sns_topic_name
}

resource "aws_sns_topic_subscription" "email" {
  count     = var.sns_email_subscription != "" ? 1 : 0
  topic_arn = aws_sns_topic.notifications.arn
  protocol  = "email"
  endpoint  = var.sns_email_subscription
}

output "sns_topic_arn" {
  description = "ARN del topic SNS. Copia este valor en AWS_SNS_TOPIC_ARN del .env y del pipeline."
  value       = aws_sns_topic.notifications.arn
}
