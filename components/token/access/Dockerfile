FROM richarvey/nginx-php-fpm:latest
LABEL Name="tmi-access" Version=0.0.1

# Add drupal codebase
WORKDIR /var/www/html
COPY drupal .
RUN composer install

# Configure NGINX
WORKDIR /etc/nginx/sites-enabled
COPY access.nginx.conf .

# HTTPS
# ADD ssl /etc/ssl/access

CMD service nginx stop
CMD ["nginx", "-g", "daemon off;"]