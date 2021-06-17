# Reading Pal UI Dockerfile

FROM nginx:1.13.1-alpine

COPY www/ /usr/share/nginx/html
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

ENV TZ "America/Boise"
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

