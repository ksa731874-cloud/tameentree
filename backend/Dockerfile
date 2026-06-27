# ============================================
# Tree Insurance - Secure Dockerfile
# ============================================
# This Dockerfile is used by Railway for deployment
# Sensitive data (TELEGRAM_TOKEN, etc.) are loaded from
# environment variables set in Railway dashboard

FROM node:18-alpine

# Set working directory
WORKDIR /app

# Default NIXPACKS_PATH (prevents undefined variable warning)
ENV NIXPACKS_PATH=/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy application files
COPY . .

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1))"

# Start server
CMD ["node", "server.js"]
