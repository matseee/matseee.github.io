---
layout: post
title:  "Docker commands"
date: 2022-02-20 08:35:00 +0200
categories: ["Programming"]
---
1. [Inspect image directory structure](#inspect-image-directory-structure)

## inspect image directory structure

1. Replace `ENTRYPOINT` / `CMD` command with
    ```
    ENTRYPOINT ["sleep", "3600"]
    ```

1. Build image
1. Start container, get the container-id and exec `shell`/`bash`
    ```
    docker build . -f dev.Dockerfile -t test
    docker run test:latest
    docker container ls
    docker exec -it 12c23fad6baf sh # or bash
    ```
