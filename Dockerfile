# Base Image for application Buildtime
FROM 328680294982.dkr.ecr.ap-southeast-1.amazonaws.com/rapid/rapid-base:latest as build

# Set working dir to  /usr/src/app
WORKDIR /usr/src/app

# Copy application code to WORKDIR
COPY . .

# Start building artifacts
RUN npm run build

# Base Image for application Runtime
FROM 328680294982.dkr.ecr.ap-southeast-1.amazonaws.com/rapid/rapid-production:latest as prod

# Set working dir to  /usr/src/app
WORKDIR /usr/src/app

# Copy build artifact from the buildtime to runtime
COPY --from=build /usr/src/app/dist ./dist

# Set Permission to non-root user
RUN chown node:node -R /usr/src/app/dist

#  Run application using non-root user
USER node

# Application run command
CMD ["node", "dist/main"]
