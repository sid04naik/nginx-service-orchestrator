# NGINX Service Orchestrator

A dynamic NGINX reverse proxy and service gateway generator for microservices environments. Automatically generates NGINX configuration files from YAML service definitions, enabling seamless routing and load balancing across microservices.

## 🚀 Features

- **Dynamic Configuration Generation**: Generate NGINX configs from simple YAML definitions
- **Versioned API Support**: Built-in support for multiple API versions (v1, v2, etc.)
- **Microservices Gateway**: Unified entry point for multiple microservices
- **Docker Integration**: Containerized deployment with Docker Compose
- **Real-time Updates**: Generate fresh NGINX config on each deployment
- **Proxy Headers**: Automatic inclusion of standard proxy headers
- **Logging**: Comprehensive access and error logging

## 📋 Prerequisites

- **Node.js 22.x** or higher
- **Docker** and **Docker Compose**
- **Git** (for cloning the repository)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd nginx-service-orchestrator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure services** (see Configuration section below)

4. **Deploy with Docker Compose**
   ```bash
   docker-compose up -d
   ```

## ⚙️ Configuration

### Service Definition Format

The orchestrator uses a hierarchical YAML structure to define services:

```yaml
http:
  - host: 'host.docker.internal'
    api:
      v1:
        - service1:
            port: 9011
        - service2:
            port: 9012
      v2:
        - service3:
            port: 9013
```

### Configuration Structure

- **`http`**: Root array containing host configurations
- **`host`**: Target host for services (e.g., `host.docker.internal`)
- **`api`**: API version definitions
- **`version`**: API version (e.g., `v1`, `v2`)
- **`service`**: Service name and port configuration

### Generated Routes

Based on the configuration above, the following routes are automatically generated:

- `/api/v1/service1` → `http://host.docker.internal:9011`
- `/api/v1/service2` → `http://host.docker.internal:9012`
- `/api/v2/service3` → `http://host.docker.internal:9013`

## 🚀 Usage

### Quick Start

1. **Update service definitions**
   ```bash
   # Edit services.yml with your service definitions
   nano services.yml
   ```

2. **Deploy the orchestrator**
   ```bash
   docker-compose up -d
   ```

3. **Verify deployment**
   ```bash
   # Check container status
   docker-compose ps

   # View logs
   docker-compose logs nginx
   ```

4. **Test routing**
   ```bash
   # Test service routing
   curl http://localhost/api/v1/service1
   curl http://localhost/api/v1/service2
   ```

### Development Workflow

1. **Edit Configuration**: Update `services.yml` with new service definitions
2. **Regenerate**: Run `docker-compose up` to regenerate NGINX config
3. **Deploy**: NGINX automatically starts with new configuration
4. **Test**: Verify routing works for new services

## 🐳 Docker Deployment

### Container Architecture

The project uses a two-container architecture:

- **Node.js Container** (`nso-node-svc`): Generates NGINX configuration
- **NGINX Container** (`nso-nginx`): Serves as reverse proxy

### Docker Compose Services

```yaml
version: '3.8'
services:
  nodejs:
    container_name: nso-node-svc
    image: node:22
    volumes:
      - .:/usr/src/app
    working_dir: /usr/src/app
    command: bash -c "npm install && node index.js"
    networks:
      - bridge

  nginx:
    container_name: nso-nginx
    image: nginx:alpine
    ports:
      - '80:80'
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./logs/nginx:/var/log/nginx
    depends_on:
      - nodejs
    restart: always
    networks:
      - bridge
```

### Volume Mounts

- **Configuration**: `./nginx.conf` → `/etc/nginx/nginx.conf`
- **Logs**: `./logs/nginx/` → `/var/log/nginx/`
- **Source Code**: `./` → `/usr/src/app/`

## 📊 Monitoring & Logging

### Log Files

- **Access Log**: `./logs/nginx/access.log`
- **Error Log**: `./logs/nginx/error.log`
- **Application Logs**: Docker Compose logs

### Viewing Logs

```bash
# View NGINX access logs
tail -f logs/nginx/access.log

# View NGINX error logs
tail -f logs/nginx/error.log

# View container logs
docker-compose logs -f nginx
docker-compose logs -f nodejs
```

### Health Checks

Monitor the health of your services:

```bash
# Check container status
docker-compose ps

# Check NGINX configuration
docker exec nso-nginx nginx -t

# Test service connectivity
curl -I http://localhost/api/v1/service1
```

## 🔧 Development

### Local Development

1. **Run orchestrator locally**
   ```bash
   npm start
   ```

2. **Test configuration generation**
   ```bash
   node index.js
   ```

3. **Validate NGINX configuration**
   ```bash
   nginx -t -c nginx.conf
   ```

### Project Structure

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
├── memory-bank/        # Project documentation
└── README.md          # This file
```

### Key Components

- **`index.js`**: Configuration generation engine
- **`services.yml`**: Service definition file
- **`nginx.conf`**: Generated NGINX configuration
- **`docker-compose.yml`**: Container orchestration

## 🚨 Troubleshooting

### Common Issues

1. **Port Conflicts**
   ```bash
   # Check for port conflicts
   lsof -i :80

   # Stop conflicting services
   sudo systemctl stop apache2  # or other web servers
   ```

2. **Configuration Errors**
   ```bash
   # Validate YAML syntax
   node -e "const yaml = require('js-yaml'); yaml.load(require('fs').readFileSync('services.yml', 'utf8'));"

   # Validate NGINX configuration
   docker exec nso-nginx nginx -t
   ```

3. **Container Issues**
   ```bash
   # Restart containers
   docker-compose restart

   # Rebuild containers
   docker-compose up --build
   ```

4. **Permission Issues**
   ```bash
   # Fix log directory permissions
   sudo chown -R $USER:$USER logs/
   chmod -R 755 logs/
   ```

### Debug Mode

Enable debug logging:

```bash
# Run with debug output
DEBUG=* docker-compose up

# View detailed container logs
docker-compose logs -f --tail=100
```

## 🔒 Security Considerations

### Current Security Model

- **No Authentication**: Basic reverse proxy without authentication
- **No SSL/TLS**: HTTP-only communication
- **No Rate Limiting**: No request throttling implemented
- **Container Isolation**: Services run in separate containers

### Security Recommendations

1. **Add SSL/TLS termination** for production use
2. **Implement authentication** for sensitive services
3. **Add rate limiting** to prevent abuse
4. **Use security headers** for additional protection
5. **Regular security updates** for container images

## 📈 Performance

### Current Performance Metrics

- **Configuration Generation**: < 1 second
- **Container Startup**: ~30 seconds (including npm install)
- **Request Routing**: < 10ms (NGINX proxy)
- **Memory Usage**: ~50MB (Node.js) + ~20MB (NGINX)

### Optimization Tips

1. **Use Alpine images** for smaller container sizes
2. **Optimize NGINX configuration** for your use case
3. **Monitor resource usage** with Docker stats
4. **Scale horizontally** with multiple NGINX instances

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**
3. **Make your changes**
4. **Add tests** for new functionality
5. **Submit a pull request**

### Development Guidelines

- Follow existing code patterns
- Add comprehensive error handling
- Include documentation for new features
- Test changes thoroughly before submitting

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Getting Help

1. **Check the documentation** in the `memory-bank/` directory
2. **Review troubleshooting** section above
3. **Check existing issues** on GitHub
4. **Create a new issue** with detailed information

### Issue Reporting

When reporting issues, please include:

- **Environment details** (OS, Docker version, Node.js version)
- **Configuration files** (services.yml, docker-compose.yml)
- **Error logs** (NGINX logs, container logs)
- **Steps to reproduce** the issue

## 🔮 Roadmap

### Planned Features

- [ ] **Configuration Validation**: YAML schema validation
- [ ] **Health Checks**: Service health monitoring
- [ ] **Dynamic Reloading**: Hot-reload configuration changes
- [ ] **SSL/TLS Support**: HTTPS termination
- [ ] **Authentication**: Basic auth and JWT support
- [ ] **Rate Limiting**: Request throttling
- [ ] **Service Discovery**: Integration with service registries
- [ ] **Monitoring**: Metrics collection and dashboards
- [ ] **Testing**: Comprehensive test suite
- [ ] **CI/CD**: Automated testing and deployment

### Version History

- **v1.0.1**: Current stable release
  - Basic NGINX configuration generation
  - Docker Compose deployment
  - YAML service definitions
  - Proxy header support

---

**Built with ❤️ for microservices architectures**
