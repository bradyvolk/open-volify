output "cloudfront_distribution_domain" {
  description = "CloudFront distribution domain name"
  value       = aws_cloudfront_distribution.frontend.domain_name
}

output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID"
  value       = aws_cloudfront_distribution.frontend.id
}

output "api_gateway_endpoint" {
  description = "API Gateway endpoint URL"
  value       = aws_apigatewayv2_api.main.api_endpoint
}

output "s3_bucket_name" {
  description = "S3 bucket name for frontend"
  value       = aws_s3_bucket.frontend.id
}

output "ecr_repository_url" {
  description = "ECR repository URL for Lambda Docker images"
  value       = aws_ecr_repository.lambda.repository_url
}

output "lambda_function_name" {
  description = "Lambda function name"
  value       = aws_lambda_function.api.function_name
}

output "rds_endpoint" {
  description = "RDS instance endpoint"
  value       = aws_db_instance.main.endpoint
  sensitive   = true
}

output "database_connection_string" {
  description = "Database connection string"
  value       = "postgresql://${var.db_username}:${random_password.db_password.result}@${aws_db_instance.main.address}:${aws_db_instance.main.port}/${var.db_name}"
  sensitive   = true
}

output "secrets_manager_arns" {
  description = "ARNs of secrets stored in Secrets Manager"
  value = {
    db_password         = aws_secretsmanager_secret.db_password.arn
    better_auth_secret  = aws_secretsmanager_secret.better_auth_secret.arn
    resend_api_key      = aws_secretsmanager_secret.resend_api_key.arn
  }
}

output "deployment_instructions" {
  description = "Instructions for deploying the application"
  value = <<-EOT
    
    ========================================
    Deployment Instructions
    ========================================
    
    1. Build and push Docker image:
       aws ecr get-login-password --region ${var.aws_region} | docker login --username AWS --password-stdin ${aws_ecr_repository.lambda.repository_url}
       docker build --platform linux/arm64 -t ${aws_ecr_repository.lambda.repository_url}:latest .
       docker push ${aws_ecr_repository.lambda.repository_url}:latest
    
    2. Update Lambda function:
       aws lambda update-function-code --function-name ${aws_lambda_function.api.function_name} --image-uri ${aws_ecr_repository.lambda.repository_url}:latest --region ${var.aws_region}
    
    3. Build and deploy frontend:
       cd frontend && bun run build.ts
       aws s3 sync ../dist s3://${aws_s3_bucket.frontend.id} --delete
       aws cloudfront create-invalidation --distribution-id ${aws_cloudfront_distribution.frontend.id} --paths "/*"
    
    4. Access your application:
       Frontend: https://${aws_cloudfront_distribution.frontend.domain_name}
       API: ${aws_apigatewayv2_api.main.api_endpoint}
    
    ========================================
  EOT
}
