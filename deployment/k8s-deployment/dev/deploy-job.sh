

#!/bin/sh
mkdir -p ~/.kube
echo "$SET_KUBECONFIG" > ~/.kube/config
cat ~/.kube/config
export KUBECONFIG=~/.kube/config

kubectl config set-context --current --namespace=$NAMESPACE
envsubst < k8s-deployment/job.yml | kubectl delete -f -
envsubst < k8s-deployment/job.yml | kubectl apply -f -


