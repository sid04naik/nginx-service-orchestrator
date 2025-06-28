# Technical Context: NGINX Service Orchestrator

## Technology Stack

### Core Technologies
- **Node.js 22**: Runtime environment for the orchestrator
- **NGINX Alpine**: Lightweight web server and reverse proxy
- **Docker Compose**: Container orchestration and deployment
- **YAML**: Configuration format for service definitions

### Dependencies
```json
{
  "js-yaml": "^4.1.0"  // YAML parsing library
}
```

### Runtime Requirements
- **Node.js**: Version 22.x (specified in package.json engines)
- **Docker**: For containerized deployment
- **Docker Compose**: For multi-container orchestration

## Development Setup

### Prerequisites
1. **Node.js 22**: Install Node.js version 22.x
2. **Docker**: Install Docker Desktop or Docker Engine
3. **Docker Compose**: Usually included with Docker installation

### Local Development
```bash
# Install dependencies
npm install

# Run orchestrator locally
npm start

# Or run with Docker Compose
docker-compose up
```

### File Structure
```
nginx-service-orchestrator/
├── index.js              # Main orchestrator logic
├── services.yml          # Service definitions
├── nginx.conf           # Generated NGINX configuration
├── docker-compose.yml   # Container orchestration
├── package.json         # Node.js dependencies
├── logs/               # NGINX log files
│   └── nginx/
│       ├── access.log
│       └── error.log
└── memory-bank/        # Project documentation
```

## Technical Constraints

### Performance Constraints
- **Single Worker Process**: NGINX configured with `worker_processes 1`
- **Connection Limit**: 1024 worker connections per worker
- **Keepalive Timeout**: 65 seconds for connection persistence

### Configuration Constraints
- **Static Generation**: NGINX config generated at startup, not runtime
- **YAML Format**: Strict YAML structure required for parsing
- **Host Resolution**: Relies on Docker host networking (`host.docker.internal`)

### Deployment Constraints
- **Port Binding**: NGINX binds to port 80 only
- **Volume Mounting**: Requires specific volume mounts for config and logs
- **Container Dependencies**: NGINX depends on Node.js container completion

## Architecture Components

### 1. Node.js Orchestrator (`index.js`)
**Purpose**: Configuration generation engine
**Key Functions**:
- `loadApiEndpoints()`: Parse YAML service definitions
- `generateNginxConfig()`: Transform YAML to NGINX configuration
- `writeConfig()`: Write generated config to file system

**Error Handling**:
- YAML parsing errors → Exit with error message
- File writing errors → Log error and continue
- Invalid configuration → Graceful degradation

### 2. NGINX Configuration (`nginx.conf`)
**Purpose**: Reverse proxy routing rules
**Structure**:
```nginx
worker_processes 1;
events {
    worker_connections 1024;
}
http {
    # Global settings
    server {
        listen 80;
        server_name host.docker.internal;
        # Dynamic location blocks
    }
}
```

### 3. Service Definitions (`services.yml`)
**Purpose**: Declarative service configuration
**Schema**:
```yaml
http:
  - host: string
    api:
      version: string
        - service_name:
            port: number
```

### 4. Docker Compose (`docker-compose.yml`)
**Purpose**: Container orchestration
**Services**:
- **nodejs**: Configuration generator
- **nginx**: Reverse proxy server

## Network Configuration

### Container Networking
- **Network Type**: Bridge network (`bridge`)
- **Host Resolution**: `host.docker.internal` for host machine access
- **Port Exposure**: Port 80 exposed to host machine

### Service Communication
- **Proxy Headers**: Standard NGINX proxy headers included
  - `Host`: Original host header
  - `X-Real-IP`: Client IP address
  - `X-Forwarded-For`: Forwarded IP chain
  - `X-Forwarded-Proto`: Original protocol

## Logging and Monitoring

### Log Configuration
- **Access Log**: `/var/log/nginx/access.log`
- **Error Log**: `/var/log/nginx/error.log`
- **Log Volume**: Mounted from host `./logs/nginx/`

### Log Format
- **Access Log**: Standard NGINX access log format
- **Error Log**: NGINX error messages and warnings
- **Application Logs**: Console output from Node.js orchestrator

## Security Considerations

### Current Security Model
- **No Authentication**: Basic reverse proxy without authentication
- **No SSL/TLS**: HTTP-only communication
- **No Rate Limiting**: No request throttling implemented
- **No CORS**: No cross-origin resource sharing configuration

### Security Constraints
- **Container Isolation**: Services run in separate containers
- **Network Isolation**: Bridge network for inter-container communication
- **File Permissions**: Standard Docker file permissions

## Scalability Considerations

### Current Limitations
- **Single NGINX Instance**: No load balancing across multiple NGINX instances
- **Static Configuration**: No dynamic service discovery
- **Single Host**: Limited to single host configuration

### Scalability Patterns
- **Horizontal Scaling**: Can run multiple NGINX instances behind a load balancer
- **Service Addition**: Easy to add new services via YAML configuration
- **Version Management**: Support for multiple API versions

## Error Handling and Recovery

### Error Scenarios
1. **YAML Parsing Errors**: Invalid YAML syntax
2. **File System Errors**: Permission or disk space issues
3. **Container Startup Errors**: Port conflicts or resource issues
4. **NGINX Configuration Errors**: Invalid NGINX syntax

### Recovery Strategies
- **Configuration Validation**: Validate YAML before processing
- **Graceful Degradation**: Continue operation with partial configuration
- **Logging**: Comprehensive error logging for troubleshooting
- **Restart Policies**: Docker Compose restart policies for container recovery