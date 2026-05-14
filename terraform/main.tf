terraform {
  required_version = ">= 1.5"

  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 3.0"
    }
  }
}

provider "docker" {
  host = var.docker_host
}

locals {
  source_root = abspath("${path.module}/..")

  mongodb_uri = "mongodb://${var.mongo_container_name}:27017/${var.mongodb_database}"

  app_env = {
    PORT                     = tostring(var.app_port)
    MONGODB_URI              = local.mongodb_uri
    JWT_SECRET               = var.jwt_secret
    JWT_EXPIRES_IN           = var.jwt_expires_in
    NODE_ENV                 = var.node_env
    NOTIFICATION_CRON        = var.notification_cron
    NOTIFICATION_MAX_RETRIES = tostring(var.notification_max_retries)
  }
}

resource "docker_network" "app" {
  name = var.network_name
}

resource "docker_volume" "mongo_data" {
  name = var.mongo_volume_name
}

resource "docker_image" "mongo" {
  name = var.mongo_image
}

resource "null_resource" "app_image" {
  triggers = {
    always_rebuild = timestamp()
  }

  provisioner "local-exec" {
    working_dir = local.source_root
    command     = "docker build -t ${var.image_name}:${var.image_tag} -f ${var.dockerfile} ."
  }
}

resource "docker_container" "mongo" {
  name  = var.mongo_container_name
  image = docker_image.mongo.image_id

  restart = "unless-stopped"

  ports {
    internal = 27017
    external = var.mongo_host_port
  }

  networks_advanced {
    name    = docker_network.app.name
    aliases = [var.mongo_container_name]
  }

  volumes {
    volume_name    = docker_volume.mongo_data.name
    container_path = "/data/db"
    read_only      = false
  }

  healthcheck {
    test         = ["CMD-SHELL", "mongosh --quiet --eval 'db.adminCommand(\"ping\").ok' || mongo --quiet --eval 'db.adminCommand(\"ping\").ok'"]
    interval     = "10s"
    timeout      = "5s"
    retries      = 5
    start_period = "20s"
  }
}

resource "docker_container" "app" {
  name  = var.app_container_name
  image = "${var.image_name}:${var.image_tag}"

  restart = "unless-stopped"

  ports {
    internal = var.app_port
    external = var.app_port
  }

  env = [for key, value in local.app_env : "${key}=${value}"]

  networks_advanced {
    name = docker_network.app.name
  }

  depends_on = [null_resource.app_image, docker_container.mongo]
}