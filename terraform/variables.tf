variable "aws_region" {
  description = "AWS region for resources"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment name (e.g., dev, staging, production)"
  type        = string
  default     = "production"
}

variable "project_name" {
  description = "Project name for resource naming"
  type        = string
  default     = "open-volify"
}

# Database variables
variable "db_name" {
  description = "Name of the PostgreSQL database"
  type        = string
  default     = "openvolify"
}

variable "db_username" {
  description = "Master username for the database"
  type        = string
  default     = "dbadmin"
}

variable "db_instance_class" {
  description = "RDS instance class"
  type        = string
  default     = "db.t4g.micro"
}

variable "db_allocated_storage" {
  description = "Allocated storage in GB"
  type        = number
  default     = 20
}

variable "db_backup_retention_period" {
  description = "Number of days to retain backups"
  type        = number
  default     = 7
}

# Lambda variables
variable "lambda_memory_size" {
  description = "Lambda function memory size in MB"
  type        = number
  default     = 512
}

variable "lambda_timeout" {
  description = "Lambda function timeout in seconds"
  type        = number
  default     = 30
}

# Secrets
variable "better_auth_secret" {
  description = "Better Auth secret key"
  type        = string
  sensitive   = true
}

variable "resend_api_key" {
  description = "Resend API key for email"
  type        = string
  sensitive   = true
}

# Domain (optional)
variable "domain_name" {
  description = "Custom domain name for CloudFront (optional)"
  type        = string
  default     = "open-volify.org"
}

variable "acm_certificate_arn" {
  description = "ARN of ACM certificate for custom domain (optional)"
  type        = string
  default     = ""
}
