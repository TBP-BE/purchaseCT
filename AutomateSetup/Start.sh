#! /bin/bash
#
#
# SPDX-License-Identifier: Apache-2.0
#
# Exit on first error
# Obtain CONTAINER_IDS and remove them
# TODO Might want to make this optional - could clear other containers

set -e

#printf "\n---Copying Ethereum smart contract to working directory of ganache-cli docker images...---\n"

#cp -r ../SmartContracts/Ethereum/Digest ./ganache-cli/Digest

printf "\n---Bringing up docker images...---\n"

docker-compose up -d 

sleep 1
printf "\n---Sleeping 10s to allow blockchains to complete booting...---\n"

sleep 9

#printf "\n---Deploying the Digest smart contract on the ganache Ethereum simulator...---\n"

#docker exec ganache-with-truffle truffle migrate

printf "\n---Installing the sell/buy combined ticket system in smart contract ---\n"

docker exec cliTourist scripts/script.sh

printf "\n---Cleaning up. ganache-cli/Digest..---\n"

rm -rf ./ganache-cli/Digest

printf "\n---DONE!---\n"
