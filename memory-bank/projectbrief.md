# Project Brief: NGINX Service Orchestrator

## Project Overview
The NGINX Service Orchestrator is a dynamic reverse proxy and service gateway generator designed for microservices environments. It automatically generates NGINX configuration files based on service definitions, enabling seamless routing and load balancing across microservices.

## Core Requirements

### Primary Goals
1. **Dynamic Configuration Generation**: Automatically generate NGINX configuration from YAML service definitions
2. **Microservices Gateway**: Provide a unified entry point for multiple microservices
3. **Versioned API Support**: Support multiple API versions (v1, v2, etc.) with proper routing
4. **Docker Integration**: Containerized deployment with Docker Compose
5. **Real-time Configuration Updates**: Generate fresh NGINX config on each run

### Functional Requirements
- Parse YAML service definitions (`services.yml`)
- Generate valid NGINX configuration (`nginx.conf`)
- Support multiple hosts and API versions
- Include proper proxy headers for microservices communication
- Provide logging and error handling
- Containerized deployment with Node.js orchestrator and NGINX proxy

### Technical Requirements
- Node.js 22 runtime
- YAML parsing capabilities (js-yaml)
- NGINX reverse proxy configuration
- Docker Compose orchestration
- File system operations for config generation

## Success Criteria
- Successfully generate NGINX configuration from YAML definitions
- Route requests to appropriate microservices based on API version and service name
- Maintain proper proxy headers for service communication
- Provide containerized deployment solution
- Support multiple services and API versions simultaneously

## Project Scope
- **In Scope**: Configuration generation, basic reverse proxy setup, Docker deployment
- **Out of Scope**: Service discovery, health checks, advanced load balancing, SSL/TLS termination