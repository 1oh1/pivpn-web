Place SSL certificates here
====

1. Place [LetsEncrypt](https://letsencrypt.org/) self-signed SSL certificates in here and name them `server.key` and `server.crt` for the private key and certificate respectively

1. If you're using self-signed certificates, check out [mkcert](https://github.com/FiloSottile/mkcert) for the most painless way to generate self-signed certificates

1. If you're using [LetsEncrypt certificates](https://flaviocopes.com/express-letsencrypt-ssl/), run `sudo apt-get install certbot` and then `certbot certonly --manual` on your web server to generate the certificates. Once generated, place a copy in here and name them `server.key` and `server.crt` for the private key and certificate respectively