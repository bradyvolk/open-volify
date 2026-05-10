#!/bin/bash
# Helper script to export Terraform outputs as environment variables
# Usage: source terraform/export-outputs.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "Exporting Terraform outputs as environment variables..."

cd "$SCRIPT_DIR"

# Check if terraform has been initialized
if [ ! -d ".terraform" ]; then
    echo "Error: Terraform not initialized. Run 'terraform init' first."
    return 1 2>/dev/null || exit 1
fi

# Export outputs
export ECR_REPOSITORY_URL=$(terraform output -raw ecr_repository_url 2>/dev/null)
export S3_BUCKET_NAME=$(terraform output -raw s3_bucket_name 2>/dev/null)
export CLOUDFRONT_DISTRIBUTION_ID=$(terraform output -raw cloudfront_distribution_id 2>/dev/null)
export LAMBDA_FUNCTION_NAME=$(terraform output -raw lambda_function_name 2>/dev/null)
export API_GATEWAY_ENDPOINT=$(terraform output -raw api_gateway_endpoint 2>/dev/null)
export CLOUDFRONT_DOMAIN=$(terraform output -raw cloudfront_distribution_domain 2>/dev/null)
export DATABASE_URL=$(terraform output -raw database_connection_string 2>/dev/null)

echo "✓ Exported environment variables:"
echo "  ECR_REPOSITORY_URL=$ECR_REPOSITORY_URL"
echo "  S3_BUCKET_NAME=$S3_BUCKET_NAME"
echo "  CLOUDFRONT_DISTRIBUTION_ID=$CLOUDFRONT_DISTRIBUTION_ID"
echo "  LAMBDA_FUNCTION_NAME=$LAMBDA_FUNCTION_NAME"
echo "  API_GATEWAY_ENDPOINT=$API_GATEWAY_ENDPOINT"
echo "  CLOUDFRONT_DOMAIN=$CLOUDFRONT_DOMAIN"
echo "  DATABASE_URL=[hidden - contains password]"
echo ""
echo "You can now run: ../deploy.sh all"
