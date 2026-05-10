# Generate random password
resource "random_password" "db_password" {
  length  = 32
  special = true
  # Exclude special characters that might cause issues in connection strings
  override_special = "!#$%&*()-_=+[]{}<>:?"
}
