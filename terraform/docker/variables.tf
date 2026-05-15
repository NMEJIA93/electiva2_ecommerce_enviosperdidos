variable "docker_host" {
  description = "Docker daemon socket. On Windows use the npipe socket; on Linux/macOS use the unix socket."
  type        = string
  default     = "npipe:////./pipe/docker_engine"
}

variable "network_name" {
  description = "Name of the Docker network created by Terraform."
  type        = string
  default     = "electiva2-ecommerce-network"
}

variable "image_name" {
  description = "Name for the locally built API image."
  type        = string
  default     = "electiva2-ecommerce-enviosperdidos-api"
}

variable "image_tag" {
  description = "Tag for the locally built API image."
  type        = string
  default     = "local"
}

variable "dockerfile" {
  description = "Dockerfile used to build the API image."
  type        = string
  default     = "Dockerfile"
}

variable "app_container_name" {
  description = "Name of the API container."
  type        = string
  default     = "electiva2-ecommerce-api-local"
}

variable "app_port" {
  description = "Port exposed by the API on the host machine."
  type        = number
  default     = 5000
}

variable "mongo_image" {
  description = "MongoDB image to run locally."
  type        = string
  default     = "mongo:7"
}

variable "mongo_container_name" {
  description = "Name of the MongoDB container."
  type        = string
  default     = "electiva2-ecommerce-mongo"
}

variable "mongo_volume_name" {
  description = "Docker volume used to persist MongoDB data."
  type        = string
  default     = "electiva2-ecommerce-mongo-data"
}

variable "mongo_host_port" {
  description = "Optional MongoDB port exposed on the host for debugging."
  type        = number
  default     = 27017
}

variable "mongodb_database" {
  description = "Database name used by the API inside MongoDB."
  type        = string
  default     = "ecommerce_enviosperdidos"
}

variable "jwt_secret" {
  description = "JWT secret used by the API."
  type        = string
  sensitive   = true
  default     = "change_this_for_local_learning_min_32_chars"
}

variable "jwt_expires_in" {
  description = "JWT expiration configured for the API."
  type        = string
  default     = "24h"
}

variable "node_env" {
  description = "Node environment value passed to the container."
  type        = string
  default     = "development"
}

variable "notification_cron" {
  description = "Cron expression for notification retry jobs."
  type        = string
  default     = "*/2 * * * *"
}

variable "notification_max_retries" {
  description = "Maximum number of retries for notification jobs."
  type        = number
  default     = 3
}

variable "aws_region" {
  description = "AWS region passed to the app container."
  type        = string
  default     = "us-east-1"
}

variable "aws_sns_topic_arn" {
  description = "ARN del topic SNS creado por el modulo terraform/aws. Se inyecta al contenedor como variable de entorno."
  type        = string
  default     = ""
}

variable "aws_access_key_id" {
  description = "AWS Access Key ID passed to the app container."
  type        = string
  sensitive   = true
  default     = ""
}

variable "aws_secret_access_key" {
  description = "AWS Secret Access Key passed to the app container."
  type        = string
  sensitive   = true
  default     = ""
}
