#!/bin/bash

lambda=2048
for size in `seq 10 10 100`
do
    echo "Start workflow $size for $lambda"
    bin/hflow run examples/ParallelSleep/config/$lambda-$size.json > azure_results/$lambda-$size
done
