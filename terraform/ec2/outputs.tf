output "ec2_public_ip" {
  description = "IP pública de la instancia EC2 donde corre la API."
  value       = aws_instance.app.public_ip
}

output "ec2_public_dns" {
  description = "DNS público de la instancia EC2."
  value       = aws_instance.app.public_dns
}

output "api_url" {
  description = "URL base de la API desplegada en EC2."
  value       = "http://${aws_instance.app.public_ip}:${var.app_port}/"
}
