FROM php:8.0-cli-alpine

WORKDIR /build
COPY ./ ./
RUN curl -sS https://getcomposer.org/installer | php \
 && php composer.phar --version \
#
# Build
 && php composer.phar install -o --no-dev --no-progress --prefer-dist --no-cache \
 && php composer.phar check-platform-reqs

CMD ["php", "/build/build.php"]
