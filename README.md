# Ebisu's Bay Web

## Add submodule(s)

### First time
```
git submodule add -b "develop" --name submodules/eb-pancake-frontend "https://<username>@bitbucket.org/ebisusbay/eb_pancake_frontend.git" "submodules/eb-pancake-frontend"
```
### After initialization
```
git submodule update --init --recursive
```
### (Only if required) - Reset submodule configuration
```
rm -rf ./submodules
rm -rf .git/modules/submodules
git rm -r ./submodules
git config -f .git/config --remove-section submodule.submodules/eb-pancake-frontend

git submodule add -b "develop" --name submodules/eb-pancake-frontend "https://<username>@bitbucket.org/ebisusbay/eb_pancake_frontend.git" "submodules/eb-pancake-frontend"
```

## Run locally (Windows)

### Step 1: Install dependencies
If previously using `npm`, you will likely need to delete node_modules

#### On Windows:
```
rd /s /q node_modules
```
Then install dependencies:
```
pnpm i
```
To set env vars, please refer to .env.example

### Step 2: Run
```
pnpm dev
```

## Run locally (Docker)

```
cd /<pathtorepository>/eb_web
```

### MacOS
#### Build and run

NOTE: Make sure that your Docker "Memory limit" is over 20GB as it will consume a lot of memory during the build!

```
./run-local-docker-compose.sh
```

Verify:
```
curl -i http://localhost:8080/api/health
```

Check running containers:
```
% docker ps
CONTAINER ID   IMAGE                        COMMAND                  CREATED         STATUS                   PORTS                            NAMES
d5f8c8b9d4f0   eb_web_ebisusbay-web-nginx   "/entrypoint.sh"         7 minutes ago   Up 7 minutes (healthy)   80/tcp, 0.0.0.0:8080->8080/tcp   ebisusbay-web-nginx
e9e130ef19bc   eb_web_ebisusbay-web         "docker-entrypoint.s…"   7 minutes ago   Up 7 minutes (healthy)   0.0.0.0:3000->3000/tcp           ebisusbay-web
```

To shutdown stack:
```
CTRL+C
```
or
```
docker compose -f docker-compose.yml down
```

Logs:
```
tail -f ./volumes/ebisusbay-web-nginx_logs/access.log
tail -f ./volumes/ebisusbay-web-nginx_logs/error.log
tail -f ./volumes/ebisusbay-web_logs/nodejs.log
```

Connect to individual container via "SSH":
```
docker exec -it ebisusbay-web-nginx /bin/bash
docker exec -it ebisusbay-web /bin/bash
```

Useful commands:
Delete:
  - all stopped containers
  - all networks not used by at least one container
  - all images without at least one container associated to them
  - all build cache
```
docker system prune -a
```

Delete:
  - Same as above + "all volumes not used by at least one container"
```
docker system prune -a --volumes
```

## Connecting to EC2 instance(s)
Instructions: https://docs.ebisusbay.com/Accessing-EC2-instance-with-SSM-primary-c1fcb8401f604b44b7e7c8701065ab95

Retrieve an AWS SSO access token for CLI usage:
```
aws sso login --profile ebisusbay-core
```

Starting a session:

```
aws ssm start-session \
    --target <DOCKER_HOST_INSTANCE_ID> \
    --region us-east-1 --profile ebisusbay-core
```