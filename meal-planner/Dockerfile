FROM ubuntu as builder

WORKDIR /usr/share/app/meal-planner
COPY . .


RUN apt update -y \
&& curl -sL https://deb.nodesource.com/setup_14.x | bash - \ 
&& apt install nodejs -y \
&& apt -y install gcc g++ make \
&& apt install npm -y

RUN npm i
RUN npm run build

FROM nginx:1.16.0-alpine
RUN rm /etc/nginx/conf.d/default.conf 
COPY ./default.conf /etc/nginx/conf.d/nginx.conf
COPY --from=builder /usr/share/app/meal-planner/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

