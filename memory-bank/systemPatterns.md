# System Patterns: NGINX Service Orchestrator

## Architecture Overview

### High-Level Architecture
```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   services.yml  │───▶│  Node.js         │───▶│   nginx.conf    │
│   (Input)       │    │  Orchestrator    │    │   (Output)      │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌──────────────────┐
                       │  Docker Compose  │
                       │  (Deployment)    │
                       └──────────────────┘
                                │
                                ▼
                       ┌──────────────────┐
                       │  NGINX Container │
                       │  (Runtime)       │
                       └──────────────────┘
```

## Key Technical Decisions

### 1. YAML Configuration Format
**Decision**: Use YAML for service definitions
**Rationale**:
- Human-readable and writable
- Hierarchical structure matches service organization
- Widely supported in DevOps toolchains
- Less verbose than JSON for configuration

### 2. Node.js Orchestrator
**Decision**: Use Node.js for configuration generation
**Rationale**:
- Fast file I/O operations
- Excellent YAML parsing libraries (js-yaml)
- Simple deployment with Docker
- Good error handling capabilities

### 3. Static Configuration Generation
**Decision**: Generate static NGINX config files
**Rationale**:
- Simpler than dynamic configuration
- Better performance (no runtime parsing)
- Easier debugging and validation
- Compatible with all NGINX versions

### 4. Docker Compose Deployment
**Decision**: Use Docker Compose for orchestration
**Rationale**:
- Consistent environment across deployments
- Easy service dependency management
- Volume mounting for configuration sharing
- Simple restart and update procedures

## Design Patterns

### 1. Configuration-Driven Pattern
```javascript
// Load configuration from external source
const apiEndpoints = loadApiEndpoints(gatewayPath);
// Generate system behavior from configuration
const nginxConfig = generateNginxConfig(apiEndpoints);
```

### 2. Template Generation Pattern
```javascript
// Define template structure
const config = [
    'worker_processes 1;',
    'events {',
    '    worker_connections 1024;',
    '}',
    // ... dynamic content insertion
];
```

### 3. Separation of Concerns
- **Configuration**: `services.yml` (what services exist)
- **Generation**: `index.js` (how to create NGINX config)
- **Runtime**: `nginx.conf` (how to route requests)
- **Deployment**: `docker-compose.yml` (how to run the system)

### 4. Error Handling Pattern
```javascript
try {
    return yaml.load(fs.readFileSync(filePath, 'utf8'));
} catch (err) {
    console.error('Failed to load YAML:', err);
    process.exit(1);
}
```

## Component Relationships

### Data Flow
1. **Input Layer**: `services.yml` defines service topology
2. **Processing Layer**: `index.js` transforms YAML to NGINX config
3. **Output Layer**: `nginx.conf` provides routing rules
4. **Runtime Layer**: NGINX container executes routing logic

### Configuration Hierarchy
```
services.yml
├── http
│   └── host (e.g., 'host.docker.internal')
│       └── api
│           └── version (e.g., 'v1')
│               └── service
│                   └── port
```

### NGINX Configuration Structure
```
nginx.conf
├── worker_processes
├── events
└── http
    ├── global settings
    └── server
        ├── listen
        ├── server_name
        └── location blocks (one per service)
```

## Integration Patterns

### 1. File System Integration
- **Input**: Read YAML configuration file
- **Output**: Write NGINX configuration file
- **Logging**: Write to standard output and error streams

### 2. Container Integration
- **Volume Mounting**: Share configuration files between containers
- **Dependency Management**: Node.js container runs before NGINX
- **Network Communication**: Bridge network for inter-container communication

### 3. Service Discovery Pattern
- **Static Discovery**: Services defined in YAML configuration
- **Host Resolution**: Use Docker host networking (`host.docker.internal`)
- **Port Mapping**: Direct port mapping for service communication

## Error Handling Strategy

### 1. Configuration Errors
- **YAML Parsing**: Exit with error message if YAML is invalid
- **Missing Files**: Graceful handling of missing configuration files
- **Invalid Structure**: Validation of required configuration fields

### 2. Runtime Errors
- **File Writing**: Error handling for configuration file generation
- **Container Startup**: Dependency management in Docker Compose
- **NGINX Errors**: Logging to error log files

### 3. Recovery Patterns
- **Restart Strategy**: Docker Compose restart policies
- **Configuration Validation**: Validate generated NGINX config
- **Logging**: Comprehensive logging for troubleshooting