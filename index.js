const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');

const gatewayPath = path.resolve(__dirname, 'services.yml');
const filePath = path.join(__dirname, 'nginx.conf');

function loadApiEndpoints(filePath) {
  try {
    return yaml.load(fs.readFileSync(filePath, 'utf8'));
  } catch (err) {
    console.error('Failed to load YAML:', err);
    process.exit(1);
  }
}

function generateNginxConfig(apiEndpoints) {
  const http = apiEndpoints['http'];
  const config = [
    'worker_processes 1;',
    '',
    'events {',
    '    worker_connections 1024;',
    '}',
    '',
    'http {',
    '    include mime.types;',
    '    default_type application/octet-stream;',
    '    sendfile on;',
    '    keepalive_timeout 65;',
    '    access_log /var/log/nginx/access.log;',
    '    error_log /var/log/nginx/error.log;',
  ];

  http.forEach((endpoints) => {
    const hostName = endpoints.host;
    const api = endpoints.api;
    config.push(`    server {`, `        listen 80;`, `        server_name ${hostName};`);
    for (const version in api) {
      api[version].forEach((ms) => {
        for (const name in ms) {
          const routePath = `/api/${version}/${name}`;
          const target = `http://${hostName}:${ms[name].port}`;
          config.push(
            `        location ${routePath} {`,
            `            proxy_pass ${target};`,
            `            proxy_set_header Host $host;`,
            `            proxy_set_header X-Real-IP $remote_addr;`,
            `            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;`,
            `            proxy_set_header X-Forwarded-Proto $scheme;`,
            `        }`
          );
        }
      });
    }
    config.push(`        include servers/*;`, `    }`);
  });

  config.push('}');
  return config.join('\n');
}

function writeConfig(filePath, config) {
  fs.writeFile(filePath, config, (err) => {
    if (err) {
      console.error('Error writing nginx.conf:', err);
    } else {
      console.info('nginx.conf has been created successfully.');
    }
    console.info('Shutting down the server');
  });
}

// Main execution
const apiEndpoints = loadApiEndpoints(gatewayPath);
const nginxConfig = generateNginxConfig(apiEndpoints);
writeConfig(filePath, nginxConfig);
