# Güler Studio sitesi: statik dosyaları nginx ile sunar.
FROM nginx:1.27-alpine

RUN rm /etc/nginx/conf.d/default.conf && mkdir -p /etc/nginx/snippets
COPY nginx/guvenlik.conf /etc/nginx/snippets/guvenlik.conf
COPY nginx/site.conf /etc/nginx/conf.d/site.conf

COPY site/ /usr/share/nginx/html/

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1/saglik || exit 1
