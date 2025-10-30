# Imagem base do Nginx slim
FROM nginx:stable-alpine

# Remove o arquivo de configuração padrão do Nginx
RUN rm /etc/nginx/conf.d/default.conf

## Configurações customizadas
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia todos os arquivos para o diretorio de serviço do nginx
COPY . /usr/share/nginx/html

EXPOSE 80


## == Comandos

# docker build -t --no-cache front-end:latest .
# docker run -d -p 80:80 --name front-end-web front-end:latest 

# docker build -t front . && docker run -d -p 80:80 front:latest 