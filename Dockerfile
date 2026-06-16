# Usa uma imagem do Node 14 que já tem o ambiente configurado
FROM node:10-buster-slim

# Define a pasta de trabalho dentro do container
WORKDIR /app

# Copia os arquivos de dependência
COPY package.json ./

# Instala as dependências
RUN npm install --loglevel=error

# Copia o restante do código
COPY . .

# Expõe a porta que o seu projeto usa (geralmente 8080 ou 3000)
EXPOSE 8080

# Comando para iniciar o servidor
CMD ["./node_modules/.bin/gulp"]