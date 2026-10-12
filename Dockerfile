# Stage 1: Build Frontend React application
FROM node:20-alpine AS client-builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

# Stage 2: Setup Server & Final Runtime
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

# Install server dependencies
COPY server/package*.json ./server/
RUN cd server && npm install --omit=dev

# Copy server source code and demo data
COPY server/ ./server/
COPY data/ ./data/

# Copy built frontend assets from Stage 1 into client/dist
COPY --from=client-builder /app/client/dist ./client/dist

# Expose server port
EXPOSE 5000

# Start DhanKhoj server
CMD ["node", "server/src/index.js"]
