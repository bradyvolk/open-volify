#!/bin/bash
set -e

# Color codes for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration - Update these after running terraform
AWS_PROFILE="${AWS_PROFILE:-brady-personal}"
AWS_REGION="${AWS_REGION:-us-east-1}"
ECR_REPOSITORY_URL="${ECR_REPOSITORY_URL}"
LAMBDA_FUNCTION_NAME="${LAMBDA_FUNCTION_NAME:-open-volify-api}"
S3_BUCKET_NAME="${S3_BUCKET_NAME}"
CLOUDFRONT_DISTRIBUTION_ID="${CLOUDFRONT_DISTRIBUTION_ID}"

# Check if terraform outputs are set
if [ -z "$ECR_REPOSITORY_URL" ] || [ -z "$S3_BUCKET_NAME" ] || [ -z "$CLOUDFRONT_DISTRIBUTION_ID" ]; then
    echo -e "${RED}Error: Required environment variables not set${NC}"
    echo "Please set the following environment variables from terraform output:"
    echo "  export ECR_REPOSITORY_URL=<your-ecr-url>"
    echo "  export S3_BUCKET_NAME=<your-s3-bucket>"
    echo "  export CLOUDFRONT_DISTRIBUTION_ID=<your-cloudfront-id>"
    echo ""
    echo "Or run from terraform directory:"
    echo "  export ECR_REPOSITORY_URL=\$(terraform output -raw ecr_repository_url)"
    echo "  export S3_BUCKET_NAME=\$(terraform output -raw s3_bucket_name)"
    echo "  export CLOUDFRONT_DISTRIBUTION_ID=\$(terraform output -raw cloudfront_distribution_id)"
    exit 1
fi

echo -e "${BLUE}=================================${NC}"
echo -e "${BLUE}Open Volify Deployment Script${NC}"
echo -e "${BLUE}=================================${NC}"
echo ""

# Deploy backend (Lambda)
if [ "$1" = "backend" ] || [ "$1" = "all" ]; then
    echo -e "${GREEN}[1/3] Building and deploying backend...${NC}"
    
    # Build frontend first (required for Docker image)
    echo "Building frontend..."
    bun run build
    
    # Login to ECR
    echo "Logging into ECR..."
    aws ecr get-login-password --region $AWS_REGION --profile $AWS_PROFILE | docker login --username AWS --password-stdin $ECR_REPOSITORY_URL
    
    # Build Docker image
    echo "Building Docker image for arm64..."
    docker build --platform linux/arm64 --no-cache -t $ECR_REPOSITORY_URL:latest .
    
    # Push to ECR
    echo "Pushing image to ECR..."
    docker push $ECR_REPOSITORY_URL:latest
    
    # Update Lambda
    echo "Updating Lambda function..."
    aws lambda update-function-code \
        --profile $AWS_PROFILE \
        --function-name $LAMBDA_FUNCTION_NAME \
        --image-uri $ECR_REPOSITORY_URL:latest \
        --region $AWS_REGION \
        --profile $AWS_PROFILE
    
    echo -e "${GREEN}✓ Backend deployed successfully${NC}"
    echo ""
fi

# Deploy frontend
if [ "$1" = "frontend" ] || [ "$1" = "all" ]; then
    echo -e "${GREEN}[2/3] Building and deploying frontend...${NC}"
    
    # Build frontend
    echo "Building frontend..."
    cd frontend
    bun run build.ts
    cd ..
    
    # Sync to S3
    echo "Syncing to S3..."
    aws s3 sync dist s3://$S3_BUCKET_NAME --delete --profile $AWS_PROFILE
    
    # Invalidate CloudFront cache
    echo "Invalidating CloudFront cache..."
    aws cloudfront create-invalidation \
        --distribution-id $CLOUDFRONT_DISTRIBUTION_ID \
        --paths "/*" \
        --no-cli-pager \
        --profile $AWS_PROFILE
    
    echo -e "${GREEN}✓ Frontend deployed successfully${NC}"
    echo ""
fi

echo -e "${BLUE}=================================${NC}"
echo -e "${GREEN}Deployment complete!${NC}"
echo -e "${BLUE}=================================${NC}"

# Show application URL
CLOUDFRONT_URL=$(aws cloudfront get-distribution --id $CLOUDFRONT_DISTRIBUTION_ID --query 'Distribution.DomainName' --output text 2>/dev/null || echo "N/A")
if [ "$CLOUDFRONT_URL" != "N/A" ]; then
    echo -e "Application URL: ${GREEN}https://$CLOUDFRONT_URL${NC}"
fi
