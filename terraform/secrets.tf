# Better Auth Secret
resource "aws_secretsmanager_secret" "better_auth_secret" {
  name                    = "${var.project_name}/better-auth/secret"
  description             = "Better Auth secret key"
  recovery_window_in_days = 7

  tags = {
    Name = "${var.project_name}-better-auth-secret"
  }
}

resource "aws_secretsmanager_secret_version" "better_auth_secret" {
  secret_id     = aws_secretsmanager_secret.better_auth_secret.id
  secret_string = var.better_auth_secret
}

# Resend API Key
resource "aws_secretsmanager_secret" "resend_api_key" {
  name                    = "${var.project_name}/resend/api-key"
  description             = "Resend API key for email"
  recovery_window_in_days = 7

  tags = {
    Name = "${var.project_name}-resend-api-key"
  }
}

resource "aws_secretsmanager_secret_version" "resend_api_key" {
  secret_id     = aws_secretsmanager_secret.resend_api_key.id
  secret_string = var.resend_api_key
}
