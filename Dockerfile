# Use the official AWS Lambda adapter image to handle the Lambda runtime
FROM public.ecr.aws/awsguru/aws-lambda-adapter:0.8.4 AS aws-lambda-adapter

# Use the official Bun image to run the application
FROM oven/bun:1-debian AS base

# Copy the Lambda adapter into the container
COPY --from=aws-lambda-adapter /lambda-adapter /opt/extensions/lambda-adapter

# Set the port to 8080. This is required for the AWS Lambda adapter.
ENV PORT=8080
ENV NODE_ENV=production

# Set the work directory to /var/task. This is the default work directory for Lambda.
WORKDIR /var/task

# Copy package files
COPY package.json bun.lock ./
COPY bunfig.toml ./

# Install production dependencies only
RUN bun install --production --frozen-lockfile

# Copy backend source
COPY backend ./backend
COPY tsconfig.json ./
COPY bun-env.d.ts ./

# Copy pre-built frontend (build locally before Docker)
COPY dist ./dist

# Run the application
CMD ["bun", "run", "backend/src/server.ts"]
