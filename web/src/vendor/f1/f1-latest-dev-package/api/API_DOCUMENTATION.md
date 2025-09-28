# F1 FIDO Key Manager - Complete API Documentation

## 📋 API Overview

The F1 FIDO Key Manager API provides comprehensive endpoints for managing FIDO security keys, policies, users, and audit logging. This documentation covers all endpoints, request/response formats, and integration patterns.

## 🔐 Authentication

### Bearer Token Authentication
All API requests require authentication using Bearer tokens.

```http
Authorization: Bearer <access_token>
Content-Type: application/json
Accept: application/json
```

### Authentication Endpoints

#### Login
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "username": "admin@company.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresAt": "2024-12-16T10:30:00Z",
  "user": {
    "id": "user-123",
    "username": "admin@company.com",
    "name": "Admin User",
    "role": "administrator"
  },
  "permissions": ["device:read", "device:write", "policy:read", "policy:write"]
}
```

#### Token Refresh
```http
POST /api/v1/auth/refresh
Authorization: Bearer <refresh_token>
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresAt": "2024-12-16T11:30:00Z"
}
```

## 🔑 Device Management API

### Get All Devices
```http
GET /api/v1/devices?page=1&pageSize=20&status=active&type=yubikey
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `page` (integer): Page number (default: 1)
- `pageSize` (integer): Items per page (default: 20, max: 100)
- `status` (string): Filter by status (connected, assigned, configured)
- `type` (string): Filter by device type (yubikey, solokey, thales)
- `assignedUser` (string): Filter by assigned user ID
- `search` (string): Search by name, serial number, or manufacturer

**Response:**
```json
{
  "data": [
    {
      "id": "device-123",
      "name": "YubiKey 5C NFC",
      "manufacturer": "Yubico",
      "model": "YK5C-NFC-001",
      "serialNumber": "YK-5C-NFC-001",
      "status": "connected",
      "version": "5.4.3",
      "aaguid": "cb69481e-8ff7-4039-93ec-0a2729a154a8",
      "fidoVersion": "2.0",
      "capabilities": ["FIDO2", "PIV", "OTP"],
      "lastSeen": "2024-12-16T09:30:00Z",
      "hasAdminPin": false,
      "configuredPolicy": null,
      "assignedUser": null,
      "assignedIdp": null,
      "createdAt": "2024-12-16T08:00:00Z",
      "updatedAt": "2024-12-16T09:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "total": 45,
    "totalPages": 3,
    "hasNext": true,
    "hasPrevious": false
  }
}
```

### Get Single Device
```http
GET /api/v1/devices/{deviceId}
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "id": "device-123",
  "name": "YubiKey 5C NFC",
  "manufacturer": "Yubico",
  "model": "YK5C-NFC-001",
  "serialNumber": "YK-5C-NFC-001",
  "status": "connected",
  "version": "5.4.3",
  "aaguid": "cb69481e-8ff7-4039-93ec-0a2729a154a8",
  "fidoVersion": "2.0",
  "capabilities": ["FIDO2", "PIV", "OTP"],
  "lastSeen": "2024-12-16T09:30:00Z",
  "hasAdminPin": false,
  "configuredPolicy": {
    "id": "policy-456",
    "name": "Enterprise Security Policy",
    "appliedAt": "2024-12-16T09:00:00Z"
  },
  "assignedUser": {
    "id": "user-789",
    "email": "john.doe@company.com",
    "name": "John Doe",
    "assignedAt": "2024-12-16T09:15:00Z"
  },
  "assignedIdp": "Entra ID",
  "createdAt": "2024-12-16T08:00:00Z",
  "updatedAt": "2024-12-16T09:30:00Z"
}
```

### Discover Devices
```http
POST /api/v1/devices/discover
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "devices": [
    {
      "id": "device-new-123",
      "name": "YubiKey 5 NFC",
      "manufacturer": "Yubico",
      "model": "YK5-NFC-002",
      "serialNumber": "YK-5-NFC-002",
      "status": "connected",
      "version": "5.4.3",
      "aaguid": "cb69481e-8ff7-4039-93ec-0a2729a154a8",
      "fidoVersion": "2.0",
      "capabilities": ["FIDO2", "PIV", "OTP"],
      "lastSeen": "2024-12-16T10:00:00Z",
      "hasAdminPin": true
    }
  ],
  "discoveredAt": "2024-12-16T10:00:00Z",
  "totalFound": 1
}
```

### Configure Device
```http
POST /api/v1/devices/{deviceId}/configure
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "policyId": "policy-456",
  "configuration": {
    "pinRequired": true,
    "pinComplexity": "high",
    "biometricEnabled": true,
    "timeout": 300,
    "maxRetries": 3,
    "lockoutDuration": 30
  }
}
```

**Response:**
```json
{
  "id": "device-123",
  "status": "configured",
  "configuredPolicy": {
    "id": "policy-456",
    "name": "Enterprise Security Policy",
    "appliedAt": "2024-12-16T10:05:00Z"
  },
  "configuration": {
    "pinRequired": true,
    "pinComplexity": "high",
    "biometricEnabled": true,
    "timeout": 300,
    "maxRetries": 3,
    "lockoutDuration": 30
  },
  "updatedAt": "2024-12-16T10:05:00Z"
}
```

### Update Device
```http
PUT /api/v1/devices/{deviceId}
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "John's YubiKey",
  "description": "Primary authentication device for John Doe",
  "location": "Office Building A"
}
```

**Response:**
```json
{
  "id": "device-123",
  "name": "John's YubiKey",
  "description": "Primary authentication device for John Doe",
  "location": "Office Building A",
  "updatedAt": "2024-12-16T10:10:00Z"
}
```

### Delete Device
```http
DELETE /api/v1/devices/{deviceId}
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "message": "Device deleted successfully",
  "deletedAt": "2024-12-16T10:15:00Z"
}
```

### Bulk Device Operations

#### Bulk Configure
```http
POST /api/v1/devices/bulk/configure
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "deviceIds": ["device-123", "device-456", "device-789"],
  "policyId": "policy-456",
  "configuration": {
    "pinRequired": true,
    "biometricEnabled": true,
    "timeout": 300
  }
}
```

**Response:**
```json
{
  "successCount": 2,
  "failureCount": 1,
  "results": [
    {
      "deviceId": "device-123",
      "status": "success",
      "updatedAt": "2024-12-16T10:20:00Z"
    },
    {
      "deviceId": "device-456",
      "status": "success",
      "updatedAt": "2024-12-16T10:20:00Z"
    },
    {
      "deviceId": "device-789",
      "status": "failed",
      "error": "Device not found"
    }
  ]
}
```

## 🛡️ Policy Management API

### Get All Policies
```http
GET /api/v1/policies?page=1&pageSize=20&type=authentication&status=active
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `page` (integer): Page number
- `pageSize` (integer): Items per page
- `type` (string): Policy type (authentication, device, user)
- `status` (string): Policy status (active, inactive, draft)
- `search` (string): Search by name or description

**Response:**
```json
{
  "data": [
    {
      "id": "policy-456",
      "name": "Enterprise Security Policy",
      "description": "High-security policy for enterprise environments",
      "type": "authentication",
      "status": "active",
      "configuration": {
        "authentication": {
          "pinRequired": true,
          "pinComplexity": "high",
          "biometricEnabled": true,
          "timeout": 600,
          "maxRetries": 3,
          "lockoutDuration": 30
        },
        "device": {
          "allowedTypes": ["yubikey", "solokey"],
          "requiredFirmware": "2.0.0",
          "allowedConnections": ["usb", "nfc"]
        }
      },
      "appliedDevices": 15,
      "createdBy": "admin@company.com",
      "createdAt": "2024-12-15T14:00:00Z",
      "updatedAt": "2024-12-16T09:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "total": 8,
    "totalPages": 1,
    "hasNext": false,
    "hasPrevious": false
  }
}
```

### Get Single Policy
```http
GET /api/v1/policies/{policyId}
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "id": "policy-456",
  "name": "Enterprise Security Policy",
  "description": "High-security policy for enterprise environments",
  "type": "authentication",
  "status": "active",
  "configuration": {
    "authentication": {
      "pinRequired": true,
      "pinComplexity": "high",
      "biometricEnabled": true,
      "timeout": 600,
      "maxRetries": 3,
      "lockoutDuration": 30
    },
    "device": {
      "allowedTypes": ["yubikey", "solokey"],
      "requiredFirmware": "2.0.0",
      "allowedConnections": ["usb", "nfc"],
      "locationRestrictions": ["office", "home"]
    },
    "user": {
      "allowedRoles": ["admin", "manager", "employee"],
      "departmentRestrictions": [],
      "timeRestrictions": {
        "allowedHours": {
          "start": "06:00",
          "end": "22:00"
        },
        "allowedDays": [1, 2, 3, 4, 5]
      }
    }
  },
  "appliedDevices": [
    {
      "deviceId": "device-123",
      "deviceName": "YubiKey 5C NFC",
      "appliedAt": "2024-12-16T09:00:00Z"
    }
  ],
  "createdBy": "admin@company.com",
  "createdAt": "2024-12-15T14:00:00Z",
  "updatedAt": "2024-12-16T09:00:00Z"
}
```

### Create Policy
```http
POST /api/v1/policies
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "Development Team Policy",
  "description": "Security policy for development team members",
  "type": "authentication",
  "configuration": {
    "authentication": {
      "pinRequired": true,
      "pinComplexity": "medium",
      "biometricEnabled": false,
      "timeout": 1800,
      "maxRetries": 5,
      "lockoutDuration": 15
    }
  }
}
```

**Response:**
```json
{
  "id": "policy-789",
  "name": "Development Team Policy",
  "description": "Security policy for development team members",
  "type": "authentication",
  "status": "active",
  "configuration": {
    "authentication": {
      "pinRequired": true,
      "pinComplexity": "medium",
      "biometricEnabled": false,
      "timeout": 1800,
      "maxRetries": 5,
      "lockoutDuration": 15
    }
  },
  "appliedDevices": 0,
  "createdBy": "admin@company.com",
  "createdAt": "2024-12-16T10:30:00Z",
  "updatedAt": "2024-12-16T10:30:00Z"
}
```

### Update Policy
```http
PUT /api/v1/policies/{policyId}
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "Updated Enterprise Security Policy",
  "description": "Updated high-security policy for enterprise environments",
  "configuration": {
    "authentication": {
      "pinRequired": true,
      "pinComplexity": "high",
      "biometricEnabled": true,
      "timeout": 300,
      "maxRetries": 3,
      "lockoutDuration": 30
    }
  }
}
```

### Apply Policy to Devices
```http
POST /api/v1/policies/{policyId}/apply
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "deviceIds": ["device-123", "device-456", "device-789"]
}
```

**Response:**
```json
{
  "policyId": "policy-456",
  "successCount": 2,
  "failureCount": 1,
  "results": [
    {
      "deviceId": "device-123",
      "status": "success",
      "appliedAt": "2024-12-16T10:35:00Z"
    },
    {
      "deviceId": "device-456",
      "status": "success",
      "appliedAt": "2024-12-16T10:35:00Z"
    },
    {
      "deviceId": "device-789",
      "status": "failed",
      "error": "Device is currently assigned to another user"
    }
  ]
}
```

### Get Policy Templates
```http
GET /api/v1/policies/templates
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "templates": [
    {
      "id": "template-basic-auth",
      "name": "Basic Authentication",
      "description": "Basic security policy for standard users",
      "type": "authentication",
      "configuration": {
        "authentication": {
          "pinRequired": true,
          "pinComplexity": "medium",
          "biometricEnabled": false,
          "timeout": 1800,
          "maxRetries": 5,
          "lockoutDuration": 15
        }
      }
    },
    {
      "id": "template-high-security",
      "name": "High Security",
      "description": "High-security policy for privileged users",
      "type": "authentication",
      "configuration": {
        "authentication": {
          "pinRequired": true,
          "pinComplexity": "high",
          "biometricEnabled": true,
          "timeout": 300,
          "maxRetries": 3,
          "lockoutDuration": 30
        }
      }
    }
  ]
}
```

## 👥 User Management API

### Get All Users
```http
GET /api/v1/users?page=1&pageSize=20&role=employee&department=IT
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `page` (integer): Page number
- `pageSize` (integer): Items per page
- `role` (string): Filter by user role
- `department` (string): Filter by department
- `search` (string): Search by name or email

**Response:**
```json
{
  "data": [
    {
      "id": "user-789",
      "username": "john.doe",
      "email": "john.doe@company.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "employee",
      "department": "IT",
      "title": "Software Developer",
      "status": "active",
      "assignedDevices": [
        {
          "deviceId": "device-123",
          "deviceName": "YubiKey 5C NFC",
          "assignedAt": "2024-12-16T09:15:00Z"
        }
      ],
      "lastLogin": "2024-12-16T08:30:00Z",
      "createdAt": "2024-12-01T10:00:00Z",
      "updatedAt": "2024-12-16T09:15:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "total": 150,
    "totalPages": 8,
    "hasNext": true,
    "hasPrevious": false
  }
}
```

### Assign Devices to User
```http
POST /api/v1/users/{userId}/devices
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "deviceIds": ["device-123", "device-456"],
  "idpProvider": "Entra ID"
}
```

**Response:**
```json
{
  "userId": "user-789",
  "successCount": 2,
  "failureCount": 0,
  "assignments": [
    {
      "deviceId": "device-123",
      "status": "success",
      "assignedAt": "2024-12-16T10:40:00Z"
    },
    {
      "deviceId": "device-456",
      "status": "success",
      "assignedAt": "2024-12-16T10:40:00Z"
    }
  ]
}
```

### Get User's Devices
```http
GET /api/v1/users/{userId}/devices
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "userId": "user-789",
  "devices": [
    {
      "id": "device-123",
      "name": "YubiKey 5C NFC",
      "manufacturer": "Yubico",
      "serialNumber": "YK-5C-NFC-001",
      "status": "assigned",
      "assignedAt": "2024-12-16T09:15:00Z",
      "lastUsed": "2024-12-16T08:30:00Z"
    }
  ],
  "totalDevices": 1
}
```

## 📊 Audit Logging API

### Get Audit Logs
```http
GET /api/v1/audit/logs?page=1&pageSize=50&startDate=2024-12-15T00:00:00Z&endDate=2024-12-16T23:59:59Z&eventType=device_assignment
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `page` (integer): Page number
- `pageSize` (integer): Items per page
- `startDate` (ISO 8601): Start date filter
- `endDate` (ISO 8601): End date filter
- `eventType` (string): Event type filter
- `userId` (string): Filter by user ID
- `resourceType` (string): Filter by resource type
- `severity` (string): Filter by severity level

**Response:**
```json
{
  "data": [
    {
      "id": "audit-123",
      "timestamp": "2024-12-16T10:40:00Z",
      "eventType": "device_assignment",
      "severity": "info",
      "userId": "admin@company.com",
      "userName": "Admin User",
      "resourceType": "device",
      "resourceId": "device-123",
      "action": "assign_to_user",
      "details": {
        "deviceName": "YubiKey 5C NFC",
        "assignedToUser": "john.doe@company.com",
        "idpProvider": "Entra ID"
      },
      "ipAddress": "192.168.1.100",
      "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      "sessionId": "session-456"
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 50,
    "total": 1250,
    "totalPages": 25,
    "hasNext": true,
    "hasPrevious": false
  }
}
```

### Export Audit Logs
```http
GET /api/v1/audit/export?format=csv&startDate=2024-12-15T00:00:00Z&endDate=2024-12-16T23:59:59Z
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `format` (string): Export format (csv, json, xlsx)
- `startDate` (ISO 8601): Start date filter
- `endDate` (ISO 8601): End date filter
- `eventType` (string): Event type filter

**Response:**
```
Content-Type: application/octet-stream
Content-Disposition: attachment; filename="audit-logs-2024-12-16.csv"

timestamp,eventType,severity,userId,resourceType,action,details
2024-12-16T10:40:00Z,device_assignment,info,admin@company.com,device,assign_to_user,"deviceName: YubiKey 5C NFC, assignedToUser: john.doe@company.com"
```

### Get Audit Statistics
```http
GET /api/v1/audit/statistics?startDate=2024-12-15T00:00:00Z&endDate=2024-12-16T23:59:59Z&groupBy=day
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "period": {
    "start": "2024-12-15T00:00:00Z",
    "end": "2024-12-16T23:59:59Z"
  },
  "groupBy": "day",
  "statistics": [
    {
      "date": "2024-12-15",
      "totalEvents": 45,
      "eventTypes": {
        "device_assignment": 12,
        "policy_application": 8,
        "user_login": 25
      },
      "severityLevels": {
        "info": 40,
        "warning": 3,
        "error": 2
      }
    },
    {
      "date": "2024-12-16",
      "totalEvents": 38,
      "eventTypes": {
        "device_assignment": 10,
        "policy_application": 6,
        "user_login": 22
      },
      "severityLevels": {
        "info": 35,
        "warning": 2,
        "error": 1
      }
    }
  ],
  "totals": {
    "totalEvents": 83,
    "uniqueUsers": 15,
    "uniqueDevices": 8
  }
}
```

## 🔄 WebSocket API

### Connection
```javascript
// WebSocket connection with authentication
const ws = new WebSocket('wss://api.f1fido.com/ws?token=<access_token>');
```

### Real-time Events

#### Device Status Updates
```json
{
  "type": "device.status",
  "data": {
    "deviceId": "device-123",
    "status": "assigned",
    "assignedUser": "john.doe@company.com",
    "timestamp": "2024-12-16T10:40:00Z"
  }
}
```

#### Policy Updates
```json
{
  "type": "policy.updated",
  "data": {
    "policyId": "policy-456",
    "name": "Enterprise Security Policy",
    "appliedDevices": 16,
    "timestamp": "2024-12-16T10:45:00Z"
  }
}
```

#### Audit Events
```json
{
  "type": "audit.event",
  "data": {
    "id": "audit-124",
    "eventType": "device_assignment",
    "severity": "info",
    "userId": "admin@company.com",
    "resourceId": "device-123",
    "timestamp": "2024-12-16T10:40:00Z"
  }
}
```

## 🚨 Error Handling

### Error Response Format
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request data",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ],
    "timestamp": "2024-12-16T10:50:00Z",
    "requestId": "req-789"
  }
}
```

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid/expired token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (resource already exists)
- `429` - Too Many Requests (rate limiting)
- `500` - Internal Server Error

### Common Error Codes
- `VALIDATION_ERROR` - Request validation failed
- `AUTHENTICATION_FAILED` - Invalid credentials
- `AUTHORIZATION_FAILED` - Insufficient permissions
- `RESOURCE_NOT_FOUND` - Requested resource not found
- `RESOURCE_CONFLICT` - Resource already exists or in use
- `RATE_LIMIT_EXCEEDED` - Too many requests
- `SERVICE_UNAVAILABLE` - External service unavailable

## 📈 Rate Limiting

### Rate Limits
- Authentication endpoints: 5 requests per minute
- Device operations: 100 requests per minute
- Policy operations: 50 requests per minute
- Audit queries: 200 requests per minute

### Rate Limit Headers
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1702728000
```

## 🔧 API Versioning

### Version Header
```http
API-Version: v1
```

### Supported Versions
- `v1` - Current stable version
- `v2` - Beta version (limited availability)

---

This API documentation provides complete coverage of all endpoints and integration patterns for the F1 FIDO Key Manager system. Use this documentation for AI tool input and development reference.

