# plugged.in App

<div align="center">
  <img src="https://plugged.in/_next/image?url=%2Fpluggedin-wl.png&w=256&q=75" alt="plugged.in Logo" width="256" height="75">
  <h3>The Crossroads for AI Data Exchanges</h3>
  <p>A unified management interface for all your MCP servers with RAG capabilities</p>

  [![Version](https://img.shields.io/badge/version-2.2.0-blue?style=for-the-badge)](https://github.com/VeriTeknik/pluggedin-app/releases)
  [![GitHub Stars](https://img.shields.io/github/stars/VeriTeknik/pluggedin-app?style=for-the-badge)](https://github.com/VeriTeknik/pluggedin-app/stargazers)
  [![License](https://img.shields.io/github/license/VeriTeknik/pluggedin-app?style=for-the-badge)](LICENSE)
  [![Next.js](https://img.shields.io/badge/Next.js-15+-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![MCP](https://img.shields.io/badge/MCP-Compatible-green?style=for-the-badge)](https://modelcontextprotocol.io/)
</div>

## 📋 Overview

The plugged.in App is a comprehensive web application for managing Model Context Protocol (MCP) servers with integrated RAG (Retrieval-Augmented Generation) capabilities. It works in conjunction with the [plugged.in MCP Proxy](https://github.com/VeriTeknik/pluggedin-mcp) to provide a unified interface for discovering, configuring, and utilizing AI tools across multiple MCP servers while leveraging your own documents as context.

This application enables seamless integration with any MCP client (Claude, Cline, Cursor, etc.) while providing advanced management capabilities, document-based knowledge augmentation, and real-time notifications through an intuitive web interface.

## ✨ Key Features

### 🚀 Core Capabilities
- **Multi-Workspace Support**: Switch between different sets of MCP configurations to prevent context pollution
- **Interactive Playground**: Test and experiment with your MCP tools directly in the browser
- **Tool Management**: Discover, organize, and manage AI tools from multiple sources
- **Resource & Template Discovery**: View available resources and resource templates for connected MCP servers
- **Custom Instructions**: Add server-specific instructions that can be used as MCP prompts
- **Prompt Management**: Discover and manage prompts from connected MCP servers

### 🔐 New in v2.2.0
- **End-to-End Encryption**: All sensitive MCP server configuration data (commands, arguments, environment variables, URLs) is now encrypted at rest using AES-256-GCM
- **Per-Profile Encryption**: Each profile has its own derived encryption key, ensuring complete isolation between workspaces
- **Secure Server Sharing**: Shared servers use sanitized templates that don't expose sensitive credentials
- **Transparent Operation**: Encryption and decryption happen automatically without affecting the user experience

### 📚 Features from v2.1.0
- **Document Library with RAG**: Upload and manage documents that serve as knowledge context for AI interactions
- **Real-Time Notifications**: Get instant notifications for MCP activities with optional email delivery
- **Progressive Server Initialization**: Faster startup with resilient server connections
- **Enhanced Security**: Industry-standard sanitization and secure environment variable handling
- **Improved UI/UX**: Redesigned playground, better responsive design, and theme customization

### 🔧 Advanced Features
- **Server Notes**: Add custom notes to each configured MCP server
- **Extensive Logging**: Detailed logging capabilities for MCP interactions in the Playground
- **Expanded Discovery**: Search for MCP servers across GitHub, Smithery, and npmjs.com
- **Email Verification**: Secure account registration with email verification
- **Self-Hostable**: Run your own instance with full control over your data

## 🚀 Quick Start with Docker

The easiest way to get started with the plugged.in App is using Docker Compose:

```bash
# Clone the repository
git clone https://github.com/VeriTeknik/pluggedin-app.git
cd pluggedin-app

# Set up environment variables
cp .env.example .env
# Edit .env with your specific configuration

# Start the application with Docker Compose
docker compose up --build -d
```

Then open http://localhost:12005 in your browser to access the plugged.in App.

### 🔄 Upgrading to v2.1.0

For existing installations upgrading to v2.2.0:

```bash
# Quick upgrade for Docker users
docker pull ghcr.io/veriteknik/pluggedin-app:v2.2.0
docker-compose down && docker-compose up -d

# The encryption will be applied automatically to existing servers
```

**Note**: Ensure you have the `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` environment variable set. If not present, generate one:
```bash
pnpm generate-encryption-key
```

## 🔌 Connecting MCP Clients

### Prerequisites

- The plugged.in App running (either self-hosted or at https://plugged.in)
- An API key from the plugged.in App (available in the API Keys page)
- The plugged.in MCP Proxy installed

### Claude Desktop Configuration

```json
{
  "mcpServers": {
    "pluggedin": {
      "command": "npx",
      "args": ["-y", "@pluggedin/mcp-proxy@latest"],
      "env": {
        "PLUGGEDIN_API_KEY": "YOUR_API_KEY",
        "PLUGGEDIN_API_BASE_URL": "http://localhost:12005" // For self-hosted instances
      }
    }
  }
}
```

### Cursor Configuration

For Cursor, you can use command-line arguments:

```bash
npx -y @pluggedin/mcp-proxy@latest --pluggedin-api-key YOUR_API_KEY --pluggedin-api-base-url http://localhost:12005
```

## 🏗️ System Architecture

The plugged.in ecosystem consists of integrated components working together to provide a comprehensive MCP management solution with RAG capabilities:

```mermaid
sequenceDiagram
    participant MCPClient as MCP Client (e.g., Claude Desktop)
    participant PluggedinMCP as plugged.in MCP Proxy
    participant PluggedinApp as plugged.in App
    participant MCPServers as Installed MCP Servers

    MCPClient ->> PluggedinMCP: Request list tools/resources/prompts
    PluggedinMCP ->> PluggedinApp: Get capabilities via API
    PluggedinApp ->> PluggedinMCP: Return capabilities (prefixed)

    MCPClient ->> PluggedinMCP: Call tool/read resource/get prompt
    alt Standard capability
        PluggedinMCP ->> PluggedinApp: Resolve capability to server
        PluggedinApp ->> PluggedinMCP: Return server details
        PluggedinMCP ->> MCPServers: Forward request to target server
        MCPServers ->> PluggedinMCP: Return response
    else Custom instruction
        PluggedinMCP ->> PluggedinApp: Get custom instruction
        PluggedinApp ->> PluggedinMCP: Return formatted messages
    end
    PluggedinMCP ->> MCPClient: Return response

    alt Discovery tool
        MCPClient ->> PluggedinMCP: Call pluggedin_discover_tools
        PluggedinMCP ->> PluggedinApp: Trigger discovery action
        PluggedinApp ->> MCPServers: Connect and discover capabilities
        MCPServers ->> PluggedinApp: Return capabilities
        PluggedinApp ->> PluggedinMCP: Confirm discovery complete
        PluggedinMCP ->> MCPClient: Return discovery result
    end
```

## ⚙️ Configuration

### Environment Variables

The plugged.in App supports various configuration options through environment variables:

```bash
# Core Configuration
DATABASE_URL=postgresql://user:password@localhost:5432/pluggedin
NEXTAUTH_URL=http://localhost:12005
NEXTAUTH_SECRET=your-secret-key

# Feature Flags (New in v2.1.0)
ENABLE_RAG=true                    # Enable RAG features
ENABLE_NOTIFICATIONS=true          # Enable notification system
ENABLE_EMAIL_VERIFICATION=true     # Enable email verification

# Email Configuration (for notifications)
EMAIL_SERVER_HOST=smtp.example.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@example.com
EMAIL_SERVER_PASSWORD=your-password
EMAIL_FROM=noreply@example.com

# RAG Configuration (optional)
RAG_API_URL=http://localhost:8000  # Your RAG service endpoint
RAG_CHUNK_SIZE=1000               # Document chunk size
RAG_CHUNK_OVERLAP=200             # Chunk overlap for context

# MCP Server Sandboxing (Linux)
FIREJAIL_USER_HOME=/home/pluggedin
FIREJAIL_LOCAL_BIN=/home/pluggedin/.local/bin
FIREJAIL_APP_PATH=/home/pluggedin/pluggedin-app
FIREJAIL_MCP_WORKSPACE=/home/pluggedin/mcp-workspace
```

### Feature Configuration

#### Document Library & RAG
1. Enable RAG in playground settings
2. Upload documents through the Library page
3. Documents are automatically indexed for context retrieval
4. Supported formats: PDF, TXT, MD, DOCX, and more

#### Notifications
1. Real-time notifications for MCP activities
2. Optional email delivery for important alerts
3. Configurable notification preferences per profile
4. Activity logging for debugging and monitoring

## 💻 Production Deployment

### System Requirements

- Node.js v18+ (recommended v20+)
- PostgreSQL 15+
- PNPM package manager
- Nginx web server (for production deployments)
- Systemd (for service management)

### Production Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/VeriTeknik/pluggedin-app.git /home/pluggedin/pluggedin-app
   cd /home/pluggedin/pluggedin-app
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your specific configuration
   ```

4. Run database migrations:
   ```bash
   pnpm db:migrate:auth
   pnpm db:generate
   pnpm db:migrate
   ```

5. Build the application for production:
   ```bash
   NODE_ENV=production pnpm build
   ```

6. Create a systemd service file at `/etc/systemd/system/pluggedin.service`:
   ```ini
   [Unit]
   Description=plugged.in Application Service
   After=network.target postgresql.service
   Wants=postgresql.service

   [Service]
   User=pluggedin
   Group=pluggedin
   WorkingDirectory=/home/pluggedin/pluggedin-app
   ExecStart=/usr/bin/pnpm start
   Restart=always
   RestartSec=10
   StandardOutput=append:/var/log/pluggedin/pluggedin_app.log
   StandardError=append:/var/log/pluggedin/pluggedin_app.log
   Environment=PATH=/usr/bin:/usr/local/bin
   Environment=NODE_ENV=production
   Environment=PORT=12005

   [Install]
   WantedBy=multi-user.target
   ```

7. Set up Nginx as a reverse proxy:
   ```nginx
   # HTTPS Server
   server {
       listen 443 ssl;
       server_name your-domain.com;

       # SSL configuration
       ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
       ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

       # Next.js static files
       location /_next/static/ {
           alias /home/pluggedin/pluggedin-app/.next/static/;
           expires 365d;
           add_header Cache-Control "public, max-age=31536000, immutable";
       }

       # Proxy settings for Node.js application
       location / {
           proxy_pass http://localhost:12005;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }

   # HTTP redirect to HTTPS
   server {
       listen 80;
       server_name your-domain.com;
       return 301 https://$host$request_uri;
   }
   ```

8. Enable and start the service:
   ```bash
   sudo systemctl daemon-reload
   sudo systemctl enable pluggedin.service
   sudo systemctl start pluggedin.service
   ```

### Security Considerations

**Enhanced Security Features**

The plugged.in App implements comprehensive security measures to protect your data and prevent common vulnerabilities:

1. **Input Sanitization**
   - All user inputs are sanitized using industry-standard libraries
   - RAG queries are processed through `sanitize-html` to prevent XSS attacks
   - Environment variables are parsed securely using `dotenv` library

2. **MCP Server Sandboxing (Linux/Ubuntu)**
   - STDIO MCP servers are automatically wrapped with `firejail --quiet` on Linux systems
   - Utilizes Firejail's default security profile to restrict server capabilities
   - Limits filesystem access and prevents unauthorized system modifications

3. **API Security**
   - Rate limiting on all API endpoints to prevent abuse
   - Authentication required for all sensitive operations
   - Audit logging for security monitoring

4. **Data Protection**
   - Server-side encryption for sensitive data
   - Secure session management with JWT tokens
   - HTTPS enforcement in production environments

To enable sandboxing, install Firejail:

```bash
sudo apt update && sudo apt install firejail
```

## 🔄 Cloud vs. Self-Hosted

| Feature | Self-Hosted | Cloud (plugged.in) |
|---------|------------|-------------------|
| Cost | Free | Free tier available |
| Data Privacy | Full control | Server-side encryption |
| Authentication | Optional | Built-in |
| Session Context | Basic | Enhanced |
| Hosting | Your infrastructure | Managed service |
| Updates | Manual | Automatic |
| Latency | Depends on your setup | Optimized global CDN |

## 🧩 Integration with plugged.in MCP Proxy

The plugged.in App is designed to work seamlessly with the [plugged.in MCP Proxy](https://github.com/VeriTeknik/pluggedin-mcp), which provides:

- A unified interface for all MCP clients
- Tool discovery and reporting
- Request routing to the appropriate MCP servers
- Support for the latest MCP specification

## 📚 Related Resources

- [plugged.in MCP Proxy Repository](https://github.com/VeriTeknik/pluggedin-mcp)
- [Model Context Protocol (MCP) Specification](https://modelcontextprotocol.io/)
- [Claude Desktop Documentation](https://docs.anthropic.com/claude/docs/claude-desktop)
- [Cline Documentation](https://docs.cline.bot/)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔮 Roadmap

The plugged.in project is actively developing several exciting features:

- **Testing Infrastructure**: Comprehensive test coverage for core functionality
- **Playground Optimizations**: Improved performance for log handling
- **Embedded Chat (Phase 2)**: Generate revenue through embeddable AI chat interfaces
- **AI Assistant Platform (Phase 3)**: Create a social network of specialized AI assistants
- **Privacy-Focused Infrastructure (Phase 4)**: Dedicated RAG servers and distributed GPU services
- **Retrieval-Augmented Generation (RAG)**: Integration with vector databases like Milvus
- **Collaboration & Sharing**: Multi-user sessions and embeddable chat widgets

## 📝 Recent Updates

### Version 2.1.0 (June 2025)

#### 🎯 Major Features
- **Document Library with RAG Integration**: Upload and manage documents that enhance AI context
- **Real-Time Notification System**: Get instant updates on MCP activities with email support
- **Progressive Server Initialization**: Faster, more resilient MCP server connections
- **Enhanced Playground UI**: Redesigned layout with better responsiveness and streaming indicators

#### 🔒 Security Enhancements
- **Improved RAG Query Security**: Replaced custom sanitization with `sanitize-html` library for robust XSS protection
- **Secure Environment Variable Parsing**: Implemented `dotenv` library for proper handling of quotes, multiline values, and special characters
- **Enhanced Input Validation**: Added comprehensive validation for all user inputs across the application
- **Strengthened API Security**: Implemented rate limiting and improved authentication checks

#### 🐛 Bug Fixes
- Fixed JSON-RPC protocol interference in MCP proxy
- Resolved memory leaks in long-running playground sessions
- Corrected streaming message handling
- Fixed localhost URL validation for development environments

See [Release Notes](./RELEASE_NOTES_v2.1.0.md) for complete details.
