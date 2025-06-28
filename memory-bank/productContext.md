# Product Context: NGINX Service Orchestrator

## Why This Project Exists

### Problem Statement
In microservices architectures, managing routing and proxy configurations becomes increasingly complex as the number of services grows. Traditional approaches require:
- Manual NGINX configuration updates for each service addition/removal
- Version management across multiple API endpoints
- Repetitive proxy setup for similar service patterns
- Time-consuming deployment processes

### Solution Value
The NGINX Service Orchestrator eliminates these pain points by:
- **Automating Configuration**: Generate NGINX configs from simple YAML definitions
- **Version Management**: Built-in support for API versioning with automatic routing
- **Declarative Setup**: Define services once, deploy everywhere
- **Rapid Deployment**: Containerized solution with minimal setup time

## How It Should Work

### User Experience Flow
1. **Define Services**: User creates/updates `services.yml` with service definitions
2. **Generate Config**: Node.js orchestrator reads YAML and generates NGINX configuration
3. **Deploy**: Docker Compose starts both orchestrator and NGINX containers
4. **Route Traffic**: NGINX automatically routes requests to appropriate microservices

### Service Definition Pattern
```yaml
http:
  - host: 'host.docker.internal'
    api:
      v1:
        - service1:
            port: 9011
        - service2:
            port: 9012
```

### Request Routing Pattern
- `/api/v1/service1` → `http://host.docker.internal:9011`
- `/api/v1/service2` → `http://host.docker.internal:9012`

## User Experience Goals

### For Developers
- **Simple Configuration**: Minimal YAML syntax for service definitions
- **Fast Iteration**: Quick updates to service configurations
- **Clear Logging**: Understandable logs for debugging
- **Predictable Behavior**: Consistent routing patterns

### For DevOps
- **Containerized**: Easy deployment with Docker Compose
- **Stateless**: No persistent state to manage
- **Reliable**: Robust error handling and logging
- **Scalable**: Support for multiple hosts and services

### For Operations
- **Monitoring**: Access and error logs for traffic analysis
- **Maintenance**: Simple restart procedures
- **Troubleshooting**: Clear error messages and logging
- **Updates**: Easy configuration updates without service interruption

## Success Metrics
- **Time to Deploy**: New service addition takes < 5 minutes
- **Configuration Accuracy**: 100% correct NGINX config generation
- **Uptime**: 99.9% availability for routing requests
- **Developer Satisfaction**: Reduced configuration management overhead