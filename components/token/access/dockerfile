FROM ubuntu:18.04

LABEL Name="tmi_access_token" Version=0.0.1

# Prep
RUN apt-get update && \
    DEBIAN_FRONTEND=noninteractive \
    apt-get install -y software-properties-common curl git unzip vim

# MariaDB
RUN apt-key adv \
    --recv-keys \
    --keyserver hkp://keyserver.ubuntu.com:80 0xF1656F24C74CD1D8
RUN add-apt-repository 'deb [arch=amd64,arm64,ppc64el]\
    http://ftp.utexas.edu/mariadb/repo/10.3/ubuntu bionic main'
RUN apt-get update  && \
    DEBIAN_FRONTEND=noninteractive \
    apt-get -y install mariadb-server && \
    apt-get autoclean
ADD build/mysql.config.sh .
RUN rm -rf /var/lib/apt/lists/* && \
    sed -i 's/^\(bind-address\s.*\)/# \1/' /etc/mysql/my.cnf
RUN bash mysql.config.sh && rm -f mysql.config.sh

# Nginx
RUN apt-add-repository ppa:ondrej/nginx
RUN apt-get update && apt-get install -y nginx && apt-get autoclean
ADD build/nginx.conf /etc/nginx/nginx.conf

# PHP & PHP-FPM
RUN apt-add-repository ppa:ondrej/php
RUN apt-get update && \
    DEBIAN_FRONTEND=noninteractive \
    apt-get install -y \
        php7.4 \
        php7.4-fpm \
        php7.4-cli \
        php7.4-mbstring \
        php7.4-xml \
        php7.4-gd \
        php7.4-mysql && \
    apt-get autoclean
RUN echo 'listen.owner = www-data' >> /etc/php/7.4/fpm/pool.d/www.conf
RUN echo 'listen.group = www-data' >> /etc/php/7.4/fpm/pool.d/www.conf

# Composer
RUN curl -sS https://getcomposer.org/installer -o composer-setup.php
RUN php \
    composer-setup.php --install-dir=/usr/local/bin --filename=composer &&\
    rm composer-setup.php

# Drupal
WORKDIR /var/www/html
ADD build/drupal drupal
RUN chown -R www-data:www-data /var/www/html/drupal
WORKDIR /var/www/html/drupal
RUN composer install
RUN composer require drush/drush

# Startup
ENTRYPOINT \
    service mysql start && \
    service php7.4-fpm start && \
    nginx -g "daemon off;"
