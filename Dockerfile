FROM node:18-alpine AS sk-build
WORKDIR /usr/src/app

ARG TZ=Europe/Moscow
ARG PUBLIC_HELLO
ARG CMS_URL

COPY . /usr/src/app
RUN apk --no-cache add curl tzdata
RUN cp /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN rm -rf node_modules package-lock.json

RUN npm install

RUN npm run build

FROM node:18-alpine
WORKDIR /usr/src/app

ARG TZ=Europe/Moscow
RUN apk --no-cache add curl tzdata
RUN cp /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

COPY --from=sk-build /usr/src/app/package.json /usr/src/app/package.json
COPY --from=sk-build /usr/src/app/package-lock.json /usr/src/app/package-lock.json

RUN npm ci --only=production

COPY --from=sk-build /usr/src/app/build /usr/src/app/build

ENV CMS_URL=$CMS_URL
EXPOSE 3000
CMD ["node", "build/index.js"]
