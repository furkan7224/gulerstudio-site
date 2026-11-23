# Güler Studio sitesi: statik sayfa + beta kayıt formu (bağımlılıksız Node.js)
FROM node:22-alpine

ENV NODE_ENV=production \
    PORT=3000 \
    VERI_DIZINI=/data

WORKDIR /app
COPY server.js ./
COPY site/ ./site/

# Beta kayıtları burada tutulur; Coolify'da kalıcı depolama (volume) olarak bağla
RUN mkdir -p /data && chown node:node /data
VOLUME ["/data"]

USER node
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1:3000/saglik || exit 1

CMD ["node", "server.js"]
