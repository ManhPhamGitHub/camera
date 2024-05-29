#!/bin/sh
mkdir -p ~/.kube
echo "$SET_KUBECONFIG" > ~/.kube/config
export KUBECONFIG=~/.kube/config

kubectl config set-context --current --namespace=$NAMESPACE
envsubst < deployment/k8s-deployment/$CI_COMMIT_BRANCH/deployment.yml | kubectl apply -f -
