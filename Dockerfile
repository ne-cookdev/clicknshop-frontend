FROM node:20 as builder

COPY package.json package-lock.json ./
RUN npm install && mkdir /react-frontend && mv ./node_modules ./react-frontend

WORKDIR /react-frontend
COPY . .

RUN npm run build

FROM nginx:1.26

COPY --from=builder /react-frontend/dist /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY ngnix/nginx.conf /etc/nginx/conf.d
COPY setup-env.sh /docker-entrypoint.d/
RUN chmod a=rwx /docker-entrypoint.d/setup-env.sh
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]