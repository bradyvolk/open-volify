# Security Group for RDS
# NOTE: RDS is publicly accessible, so we restrict access by CIDR blocks
# Lambda runs outside VPC and accesses RDS via public internet
resource "aws_security_group" "rds" {
  name        = "${var.project_name}-rds-sg"
  description = "Security group for RDS PostgreSQL (publicly accessible)"
  vpc_id      = aws_vpc.main.id

  # Allow PostgreSQL access from anywhere
  # Lambda IP addresses are not static, so we must allow broad access
  # SECURITY NOTE: This is not ideal but necessary without NAT Gateway
  # Consider using AWS NAT Gateway or restricting to known IP ranges in production
  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]  # Consider restricting this in production
    description = "Allow PostgreSQL from Lambda (no static IPs)"
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Allow all outbound traffic"
  }

  tags = {
    Name = "${var.project_name}-rds-sg"
  }
}
