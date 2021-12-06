#!/usr/bin/env bash
ssh-keygen -t rsa -b 4096 -N '' -m PEM -f secrets/$1.key
openssl rsa -in secrets/$1.key -pubout -outform PEM -out secrets/$1.key.pub
