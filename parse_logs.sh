#!/bin/bash
echo task start end duration
cat log40.txt | grep 'AWS Lambda Function' | cut -d " " -f 2,9,11,13