# ============================================
# Tree Insurance - Secure Dockerfile
# ============================================
# Telegram credentials are hardcoded in server.js
# No sensitive data in this file

FROM node:18-alpine

# Set working directory
WORKDIR /app

# Define NIXPACKS_PATH to prevent undefined warning
ENV NIXPACKS_PATH=/app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production && npm cache clean --force

# Copy application source
COPY . .

# Create directories for protected pages if needed
RUN mkdir -p protected_pages

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', function(r) { process.exit(r.statusCode === 200 ? 0 : 1); });"

# Start server
CMD ["node", "server.js"]
