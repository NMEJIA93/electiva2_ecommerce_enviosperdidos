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

# ─── Trigger de recreación de EC2 por cambio de imagen ───────────────────────

resource "terraform_data" "image_tag" {
  input = var.image_tag
}

# ─── Security Group ───────────────────────────────────────────────────────────

resource "aws_security_group" "app" {
  name        = "electiva2-ecommerce-sg"
  description = "Allow SSH and API port inbound; all outbound"

  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "API"
    from_port   = var.app_port
    to_port     = var.app_port
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# ─── EC2 Instance ─────────────────────────────────────────────────────────────

resource "aws_instance" "app" {
  ami                         = var.ami_id
  instance_type               = var.instance_type
  key_name                    = var.key_pair_name
  vpc_security_group_ids      = [aws_security_group.app.id]
  iam_instance_profile        = var.iam_instance_profile_name
  associate_public_ip_address = true

  tags = {
    Name = "electiva2-ecommerce-api"
  }

  lifecycle {
    replace_triggered_by = [terraform_data.image_tag]
  }

  connection {
    type        = "ssh"
    user        = "ec2-user"
    private_key = file(var.ssh_private_key_path)
    host        = self.public_ip
    timeout     = "5m"
  }

  provisioner "remote-exec" {
    inline = [
      # ── Instalar Docker ────────────────────────────────────────────────────
      "sudo dnf update -y -q",
      "sudo dnf install -y docker",
      "sudo systemctl start docker",
      "sudo systemctl enable docker",

      # ── Login a ECR usando el Instance Role (sin credenciales hardcodeadas) ──
      "aws ecr get-login-password --region ${var.aws_region} | sudo docker login --username AWS --password-stdin ${var.ecr_repository_url}",

      # ── Limpiar contenedores existentes para idempotencia en re-deploys ───
      "sudo docker stop app ${var.mongo_container_name} 2>/dev/null || true",
      "sudo docker rm   app ${var.mongo_container_name} 2>/dev/null || true",

      # ── Red interna entre contenedores ────────────────────────────────────
      "sudo docker network create app-net 2>/dev/null || true",

      # ── Volumen para persistencia de MongoDB ──────────────────────────────
      "sudo docker volume create ${var.mongo_volume_name} 2>/dev/null || true",

      # ── Iniciar MongoDB ───────────────────────────────────────────────────
      "sudo docker run -d --name ${var.mongo_container_name} --network app-net --restart unless-stopped -v ${var.mongo_volume_name}:/data/db mongo:7",

      # ── Esperar a que MongoDB esté listo ──────────────────────────────────
      "for i in $(seq 1 30); do sudo docker exec ${var.mongo_container_name} mongosh --quiet --eval 'db.adminCommand(\"ping\").ok' 2>/dev/null && break || sleep 3; done",

      # ── Pull de la imagen de la app desde ECR ────────────────────────────
      "sudo docker pull ${var.ecr_repository_url}:${var.image_tag}",

      # ── Iniciar contenedor de la API ──────────────────────────────────────
      "sudo docker run -d --name app --network app-net --restart unless-stopped -p ${var.app_port}:${var.app_port} -e PORT=${var.app_port} -e MONGODB_URI=mongodb://${var.mongo_container_name}:27017/${var.mongodb_database} -e JWT_SECRET='${var.jwt_secret}' -e JWT_EXPIRES_IN=${var.jwt_expires_in} -e NODE_ENV=${var.node_env} -e 'NOTIFICATION_CRON=${var.notification_cron}' -e NOTIFICATION_MAX_RETRIES=${var.notification_max_retries} -e AWS_REGION=${var.aws_region} -e AWS_SNS_TOPIC_ARN=${var.aws_sns_topic_arn} ${var.ecr_repository_url}:${var.image_tag}"
    ]
  }
}
