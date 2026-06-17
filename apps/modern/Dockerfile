# Stage 1: Build Angular 21 app using Nx inside the container
FROM node:22-alpine AS builder

WORKDIR /workspace

# Copy workspace-level Nx files
COPY package.json package-lock.json nx.json tsconfig.base.json .npmrc ./

# Copy app and libs source
COPY apps/modern/ ./apps/modern/
COPY libs/ ./libs/

# Install all workspace deps
RUN npm install --legacy-peer-deps --silent

# Build the modern app via Nx
RUN npx nx build modern --configuration=production

# Stage 2: Serve the compiled output with Nginx
FROM nginx:1.27-alpine AS runner

COPY --from=builder /workspace/dist/apps/modern/browser /usr/share/nginx/html
COPY apps/modern/nginx.app.conf /etc/nginx/conf.d/default.conf

EXPOSE 4200
