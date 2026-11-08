# La aplicación no necesita instalar dependencias ni compilarse.
# Esta etapa comprueba la sintaxis antes de preparar la imagen final.
FROM node:24.22.2-alpine3.24 AS verify
WORKDIR /app
COPY servidor.cjs main.js music.js ./
RUN node --check servidor.cjs && node --check main.js && node --check music.js
COPY index.html style.css ./*.glb ./

FROM node:24.22.2-alpine3.24 AS runtime
ENV NODE_ENV=production HOST=0.0.0.0 PORT=4173
WORKDIR /app
COPY --from=verify --chown=node:node /app/ ./
USER node
EXPOSE 4173
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://127.0.0.1:'+(process.env.PORT||4173)+'/',r=>process.exit(r.statusCode===200?0:1)).on('error',()=>process.exit(1))"
CMD ["node", "servidor.cjs"]

