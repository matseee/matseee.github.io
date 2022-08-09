---
layout: post
title:  "Angular Unit-Test with Karma/Jasmine and Docker"
date: 2022-08-09 00:35:00 +0200
categories: ["Programming"]
---
To run the written Angular unit tests using Karma, a Chrome/Chromium browser is required. Karma is actually not a test framework, but only executes the tests (for example Jasmine tests). However, Karma is started via the normal test command of the Angular CLI and this is a problem in an automated CI pipeline using Docker containers, since no GUI application can be started inside a Docker container. At least not without tricks. However, there is the alternative to start the Chromium browser without GUI. The following explains how to configure the Angular project and the docker image so that karma can be run inside a docker container.

### 1. Configure package.json
```json
  "scripts": {
    "ng": "ng",
    // ...
    "test": "ng test",
    // add the following line
    //      watch=false             => single run
    //      browsers=ChromeHeadless => chromium without ui
    "test-headless": "ng test --watch=false --browsers=ChromeHeadless"
  },
```

### 2. Configure karma.conf.json
```js
module.exports = function (config) {
  config.set({
    // add the following custom launcher
    customLaunchers: {
      ChromeHeadless: {
        base: 'Chrome',
        flags: [
          '--no-sandbox',
          '--disable-gpu',
          '--headless',
          '--remote-debugging-port=9222'
        ]
      }
    },
    // ...
```

### 3. Create docker image
```Dockerfile
ARG NODE_VERSION
ARG ALPINE_VERSION
FROM node:$NODE_VERSION-alpine$ALPINE_VERSION AS node

# add chromium to image
RUN apk add chromium

# set CHROME_BIN environment variable, so that karma knows which crome should be started
ENV CHROME_BIN=/usr/bin/chromium-browser
```
[See here how this image works](https://github.com/matseee/docker-images/tree/main/node)

### 4. Use the image in you CI-pipeline and exectue the test-headless command
```yaml
# this is a part of a drone ci pipeline
kind: pipeline
type: docker
name: build

steps:
- name: test-angular
  image: matseee/golang-node:go1.19.0-node18.7.0-alpine3.16
  commands:
    - cd angular-app/
    - npm install
    - npm run test-headless
```