FROM node:18-alpine As build
RUN npm install -g pnpm
# Create app directory
WORKDIR /usr/app
COPY --chown=node:node package.json pnpm-lock.yaml ./
# Install dependencies
RUN pnpm i --frozen-lockfile
# Bundle app source
COPY --chown=node:node . .
# Generate Prisma Client
RUN npx prisma generate
# Build the app
RUN pnpm build

FROM node:18-alpine As prod-dependencies
RUN npm install -g pnpm
# Create app directory
WORKDIR /usr/app
COPY --chown=node:node package.json pnpm-lock.yaml ./
# Install production dependencies
RUN pnpm i --frozen-lockfile --production

FROM node:18-alpine As production
RUN npm install -g pnpm
# Create app directory
WORKDIR /usr/app
# Copy the bundled code from the build stage to the production image
COPY --chown=node:node package.json pnpm-lock.yaml ./
COPY --chown=node:node prisma ./prisma
COPY --chown=node:node --from=prod-dependencies /usr/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/app/dist ./dist
# Generate Prisma Client
RUN npx prisma generate
# Start the server using the production build
CMD ["node", "dist/main.js"]
