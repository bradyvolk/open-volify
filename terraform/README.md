# Terraform AWS Infrastructure for Open Volify

This Terraform configuration deploys AWS infrastructure for the Open Volify application.

## Architecture

- **Backend (Lambda)**: Fastify API running in Lambda with ARM64 architecture
- **Frontend (S3 + CloudFront)**: React SPA served via CloudFront CDN
- **Database (RDS)**: PostgreSQL db.t4g.micro instance
- **API Gateway**: HTTP API with Lambda proxy integration
- **Networking**: VPC with public/private subnets, NAT Gateway
- **Secrets**: AWS Secrets Manager

## Prerequisites

1. **AWS Account** with appropriate permissions
2. **Terraform** >= 1.0 installed
3. **AWS CLI** configured with credentials
4. **Docker** for building Lambda images
5. **Bun** for building the application

## Cost Optimization

This setup is optimized for minimal cost:

- RDS db.t4g.micro with 1-year reserved instance (~$7-8/month)
- Lambda ARM64 (Graviton2) with free tier
- HTTP API (cheaper than REST API)
- CloudFront free tier (1TB/month)
- Single-AZ database deployment
- No RDS Proxy or CloudWatch DB insights
- **No NAT Gateway** - RDS is publicly accessible for now to avoid NAT Gateway costs.

## Deployment Steps

### 1. Initial Setup

```bash
cd terraform

# Copy and customize variables
cp terraform.tfvars.example terraform.tfvars

# Edit terraform.tfvars and set required variables:
# - better_auth_secret
# - resend_api_key
```

### 2. Initialize Terraform

```bash
terraform init
```

### 3. Plan Infrastructure

```bash
terraform plan
```

### 4. Deploy Infrastructure

```bash
terraform apply
```

This will create:

- VPC and networking resources
- RDS PostgreSQL instance
- ECR repository for Docker images
- Lambda function
- API Gateway
- S3 bucket for frontend
- CloudFront distribution
- Security groups and IAM roles

**Note**: After applying, save the outputs. You'll need them for deployment.

### 5. Build and Deploy Backend (Lambda)

```bash
# Return to project root
cd ..

# Login to ECR (replace with your actual ECR URL from terraform output)
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <ECR_REPOSITORY_URL>

# Build Docker image for ARM64
docker build --platform linux/arm64 -t <ECR_REPOSITORY_URL>:latest .

# Push to ECR
docker push <ECR_REPOSITORY_URL>:latest

# Update Lambda function
aws lambda update-function-code \
  --function-name open-volify-api \
  --image-uri <ECR_REPOSITORY_URL>:latest \
  --region us-east-1
```

### 6. Build and Deploy Frontend

```bash
# Build frontend
cd frontend
bun run build.ts

# Sync to S3 (replace with your actual S3 bucket name)
aws s3 sync ../dist s3://<S3_BUCKET_NAME> --delete

# Invalidate CloudFront cache (replace with your distribution ID)
aws cloudfront create-invalidation \
  --distribution-id <CLOUDFRONT_DISTRIBUTION_ID> \
  --paths "/*"
```

### 7. Database Migration

After deployment, run your database migrations:

```bash
# Set DATABASE_URL from terraform output
export DATABASE_URL="postgresql://..."

# Run migrations
cd backend
bun run drizzle-kit push
```

## Environment Variables

The Lambda function automatically receives these environment variables from Terraform:

- `NODE_ENV=production`
- `DATABASE_URL` - Constructed from RDS endpoint
- `BETTER_AUTH_SECRET_ARN` - ARN to fetch secret from Secrets Manager
- `RESEND_API_KEY_ARN` - ARN to fetch secret from Secrets Manager
- `BETTER_AUTH_URL` - API Gateway endpoint

## Outputs

After successful deployment, Terraform outputs:

- `cloudfront_distribution_domain` - Your application URL
- `api_gateway_endpoint` - Backend API endpoint
- `ecr_repository_url` - Docker image repository
- `s3_bucket_name` - Frontend static files bucket
- `deployment_instructions` - Complete deployment commands

## Custom Domain

To use a custom domain:

1. Create an SSL certificate in **ACM (us-east-1 region for CloudFront)**
2. Update `terraform.tfvars`:
   ```hcl
   domain_name         = "app.yourdomain.com"
   acm_certificate_arn = "arn:aws:acm:us-east-1:..."
   ```
3. Run `terraform apply`
4. Create a CNAME record in your DNS pointing to the CloudFront domain

## Updating the Application

### Backend Updates

```bash
# Build and push new image
docker build --platform linux/arm64 -t <ECR_REPOSITORY_URL>:latest .
docker push <ECR_REPOSITORY_URL>:latest

aws lambda update-function-code \
  --function-name open-volify-api \
  --image-uri <ECR_REPOSITORY_URL>:latest
```

### Frontend Updates

```bash
cd frontend
bun run build.ts
aws s3 sync ../dist s3://<S3_BUCKET_NAME> --delete
aws cloudfront create-invalidation --distribution-id <ID> --paths "/*"
```

## Monitoring

- **Lambda Logs**: CloudWatch Logs group `/aws/lambda/open-volify-api`
- **API Gateway Logs**: CloudWatch Logs group `/aws/apigateway/open-volify`
- **RDS Metrics**: CloudWatch

## Cleanup

To destroy all resources:

```bash
cd terraform
terraform destroy
```

**Warning**: This will delete all resources including the database. Make sure to backup any important data first.
