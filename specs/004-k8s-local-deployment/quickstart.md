# Quickstart: Local Kubernetes Deployment

**Feature**: 004-k8s-local-deployment
**Prerequisites**: Docker Desktop, Minikube, kubectl, Helm v3

## 1. Prerequisites Check

```bash
# Verify all tools are installed
docker --version          # Docker Desktop 4.53+
minikube version          # Minikube installed
kubectl version --client  # kubectl installed
helm version              # Helm v3
```

## 2. Start Minikube

```bash
minikube start --cpus=4 --memory=8192
minikube status
kubectl get nodes
```

## 3. Configure Docker to Use Minikube's Docker Daemon

```bash
eval $(minikube docker-env)
```

This ensures images built locally are available to Minikube without a registry.

## 4. Build Docker Images

```bash
# From repository root
docker build -t todo-backend:v1 -f infra/docker/backend.Dockerfile .

docker build -t todo-frontend:v1 \
  --build-arg NEXT_PUBLIC_API_BASE_URL=http://$(minikube ip):30080/api \
  --build-arg NEXT_PUBLIC_BETTER_AUTH_URL=http://$(minikube ip):30030 \
  -f infra/docker/frontend.Dockerfile .
```

## 5. Create Kubernetes Secret

```bash
kubectl create secret generic todo-secrets \
  --from-literal=NEON_DB_URL='<your-neon-db-url>' \
  --from-literal=BETTER_AUTH_SECRET='<your-auth-secret>' \
  --from-literal=COHERE_API_KEY='<your-cohere-api-key>'
```

## 6. Deploy with Helm

```bash
helm install todo-backend infra/helm/todo-backend
helm install todo-frontend infra/helm/todo-frontend
```

## 7. Verify Deployment

```bash
# Check pods (expect 4 pods: 2 backend, 2 frontend)
kubectl get pods

# Check services
kubectl get svc

# Wait for all pods to be ready
kubectl wait --for=condition=ready pod -l app=todo-backend --timeout=120s
kubectl wait --for=condition=ready pod -l app=todo-frontend --timeout=120s
```

## 8. Access the Application

```bash
# Get frontend URL
minikube service todo-frontend --url

# Get backend URL
minikube service todo-backend --url
```

Open the frontend URL in your browser to use the Todo AI Chatbot.

## 9. Validate Functionality

1. Sign up / sign in through the UI
2. Create a task via the chatbot
3. List tasks
4. Complete a task
5. Delete a task
6. Verify all operations work identically to local development

## 10. Scaling (Optional)

```bash
# Scale via Helm
helm upgrade todo-backend infra/helm/todo-backend --set replicaCount=3
helm upgrade todo-frontend infra/helm/todo-frontend --set replicaCount=3
```

## 11. Cleanup

```bash
helm uninstall todo-backend
helm uninstall todo-frontend
kubectl delete secret todo-secrets
minikube stop
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Pods in CrashLoopBackOff | Check logs: `kubectl logs <pod-name>` |
| ImagePullBackOff | Run `eval $(minikube docker-env)` and rebuild images |
| Cannot reach frontend | Run `minikube service todo-frontend --url` |
| Database connection errors | Verify `NEON_DB_URL` in secret is correct |
| Build fails | Check Dockerfile paths; ensure build context is repo root |
