# PiVPN Web

[![Build & Publish Docker Image to Docker Hub](https://github.com/WeeJeWel/pivpn-web/actions/workflows/deploy.yml/badge.svg?branch=production)](https://github.com/WeeJeWel/pivpn-web/actions/workflows/deploy.yml)
[![Docker](https://img.shields.io/docker/v/weejewel/pivpn-web/latest)](https://hub.docker.com/r/weejewel/pivpn-web)
[![Docker](https://img.shields.io/docker/pulls/weejewel/pivpn-web.svg)](https://hub.docker.com/r/weejewel/pivpn-web)
[![Sponsor](https://img.shields.io/github/sponsors/weejewel)](https://github.com/sponsors/WeeJeWel)


PiVPN Web is an open-source Web UI for PiVPN (when using WireGuard).

![](https://i.imgur.com/eUTtYWx.png)

## Features

* A beautiful & easy to use UI
* Easy installation: just one command
* List, create, delete, enable & disable users
* Show a user's QR code
* Download a user's configuration file
* See which users are connected
* Log in with your Linux username & password
* Connects to your local PiVPN installation — or remote over SSH
* Gravatar support 😏

## Requirements

* Docker installed
* PiVPN installed (WireGuard, not OpenVPN)
* SSH enabled

## Installation

### 1. Install Docker

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user 'pi' to group 'docker'
sudo usermod -aG docker pi
```

### 2. Install PiVPN

```bash
curl -L https://install.pivpn.io | bash
```

> See [https://pivpn.io](https://pivpn.io) for detailed instructions.

### 3. Install PiVPN Web

Run this command once to automatically start the service on boot.

```bash
docker run -d -p 443:443 --name pivpn-web --restart=unless-stopped iamvinku/pivpn-web
```

> 💡 Remove the `restart=always` flag to prevent auto-start on boot.

> 💡 You can set the environment variable `SSH_HOST` to a hostname/IP to connect to a different PiVPN server than PiVPN Web is running on.

> 💡 There's also a [`docker-compose.yml`](https://github.com/WeeJeWel/pivpn-web/blob/master/docker-compose.yml) file.

## Usage

Open `https://<ip-of-your-pi>` and log in with your Raspberry Pi username & password.

> 💡 The default Raspbian username is `pi` and the default password is `raspberry`.

> 💡 When a client's name is a valid Gravatar e-mail, they will be shown with their avatar.

## Updating

Run these commands to update to the latest version.

```bash
docker stop pivpn-web
docker rm pivpn-web
docker pull iamvinku/pivpn-web
sudo docker run -d -p 443:443 --name pivpn-web --restart=unless-stopped iamvinku/pivpn-web
```

## Notes on running PiVPN Web on Oracle Cloud Infrastructure

* If running on Ubuntu compute instances, make sure to attach a network security group allowing **Ingress** traffic from all source ports to destination **TCP** port **443** from source CIDR **0.0.0.0/0**. If you are only going to access the server from a static IP or a different range of IPs, allow traffic from that CIDR block instead of **0.0.0.0/0**.

* Run the following iptables command as well:

```bash
# To access PiVPN Web over HTTPS
sudo iptables -I INPUT 1 -i ens3 -p tcp -m tcp --dport 443 -m comment --comment PiVPN-Web-input-rule -j ACCEPT

# To complete the LetsEncrypt challenge (not required if you already have the certificate)
sudo iptables -I INPUT 1 -i ens3 -p tcp -m tcp --dport 80 -m comment --comment letsencrypt-input-rule -j ACCEPT
```

* To ensure the [iptables rules are saved](https://www.cyberciti.biz/faq/how-to-save-iptables-firewall-rules-permanently-on-linux/):
```
sudo iptables-save | sudo tee /etc/iptables/rules.v4
sudo service iptables restart
sudo iptables -S
```

* Mount the **LetsEncrypt** certificate files into the Docker container with:

```bash
sudo docker run -d -p 443:443 -v /etc/letsencrypt/live/yourdomain.com/fullchain.pem:/app/sslcerts/server.crt -v /etc/letsencrypt/live/yourdomain.com/privkey.pem:/app/sslcerts/server.key --name pivpn-web --restart=unless-stopped iamvinku/pivpn-web
```

* Since PiVPN Web tries to SSH to the host using SSH credentials and OCI compute hosts by default are set up to use SSH keys for login, you may need to [edit `/etc/ssh/sshd_config` to permit `root` user login and enable password authentication](https://serverpilot.io/docs/how-to-enable-ssh-password-authentication/)

```
# /etc/ssh/sshd_config
PasswordAuthentication yes
PermitRootLogin yes
```

* Once these changes are made, set a long, secure, auto-generated password for the `root` user with `sudo passwd root` and restart the ssh service with `sudo service ssh restart`. Log in to PiVPN Web using the root user and password by visiting https://yourdomain.com

* If you're using a dynamic DNS service (e.g. DuckDNS.org) visit the relevant subdomain URL (e.g. https://yoursubdomain.duckdns.org)

* Since the server would be open to the public (i.e. ingress rule allowing 0.0.0.0/0 traffic to port 443) you might get a lot of unwanted attention (e.g. brute-forcing attempts) so you may want to restrict PiVPN Web and have it only listen for connections originating from within your internal network which would mean that you'll need to have a WireGuard tunnel to the server already set up to be able to access PiVPN Web dashboard.