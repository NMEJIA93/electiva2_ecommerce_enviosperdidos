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

# ─── ECR ─────────────────────────────────────────────────────────────────────

resource "aws_ecr_repository" "app" {
  name                 = var.ecr_repository_name
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = false
  }
}

resource "aws_ecr_lifecycle_policy" "app" {
  repository = aws_ecr_repository.app.name

  policy = jsonencode({
    rules = [{
      rulePriority = 1
      description  = "Keep only the last 5 images"
      selection = {
        tagStatus   = "any"
        countType   = "imageCountMoreThan"
        countNumber = 5
      }
      action = { type = "expire" }
    }]
  })
}

# ─── IAM Role para EC2 (acceso a ECR y SNS via Instance Role) ────────────────

resource "aws_iam_role" "ec2_role" {
  name = "electiva2-ecommerce-ec2-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect    = "Allow"
      Principal = { Service = "ec2.amazonaws.com" }
      Action    = "sts:AssumeRole"
    }]
  })
}

resource "aws_iam_role_policy" "ec2_policy" {
  name = "electiva2-ecommerce-ec2-policy"
  role = aws_iam_role.ec2_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "ecr:GetAuthorizationToken",
          "ecr:BatchCheckLayerAvailability",
          "ecr:GetDownloadUrlForLayer",
          "ecr:BatchGetImage"
        ]
        Resource = "*"
      },
      {
        Effect   = "Allow"
        Action   = ["sns:Publish"]
        Resource = aws_sns_topic.notifications.arn
      }
    ]
  })
}

resource "aws_iam_instance_profile" "ec2_profile" {
  name = "electiva2-ecommerce-ec2-profile"
  role = aws_iam_role.ec2_role.name
}

# ─── Outputs ─────────────────────────────────────────────────────────────────

output "ecr_repository_url" {
  description = "URL completa del repositorio ECR. Usar como prefijo para docker push/pull."
  value       = aws_ecr_repository.app.repository_url
}

output "iam_instance_profile_name" {
  description = "Nombre del IAM Instance Profile para adjuntar a la EC2."
  value       = aws_iam_instance_profile.ec2_profile.name
}
