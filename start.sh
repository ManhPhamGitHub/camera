#!/bin/bash
openvpn --cd /vpn --config /vpn/hoangtv-prod.ovpn --script-security 2 --redirect-gateway def1 &
sleep 15
ip route | head -n 1 > temp
ip route del $(cat temp)
yarn start
