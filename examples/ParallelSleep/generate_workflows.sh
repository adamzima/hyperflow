#!/bin/bash

lambdas=( 128 256 512 1024 2048 )
for lambda in "${lambdas[@]}"
do
  for size in `seq 10 10 100`
  do
    node sleep_generator.js $size linpack_$lambda > config/$lambda-$size.json
  done
done