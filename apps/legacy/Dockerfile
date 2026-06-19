# Stage 1: Build the AngularJS app with Node 10 (compatible with gulp 3.x)
FROM node:10-buster-slim AS builder

WORKDIR /app

COPY package.json ./
RUN npm install --loglevel=error

COPY . .

# Run gulp build (html + browserify + uglify → dist/)
RUN ./node_modules/.bin/gulp build

# Stage 2: Serve the compiled output with Nginx (no BrowserSync needed)
FROM nginx:1.27-alpine AS runner

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 4201

# Serve on port 4201 to match the proxy upstream expectation
RUN printf 'server {\n\
    listen 4201;\n\
    root /usr/share/nginx/html;\n\
    index index.html;\n\
    location / {\n\
        try_files $uri $uri/ /index.html;\n\
    }\n\
}\n' > /etc/nginx/conf.d/default.conf
