

#!/bin/sh
mkdir -p ~/.kube
echo "$PROD_KUBECONFIG" > ~/.kube/config
export KUBECONFIG=~/.kube/config
echo $CI_COMMIT_TAG
echo $CI_PROJECT_NAME

kubectl config set-context --current --namespace=devops-cloud
envsubst < k8s-deployment/job.yml | kubectl delete -f -
envsubst < k8s-deployment/job.yml | kubectl apply -f -


