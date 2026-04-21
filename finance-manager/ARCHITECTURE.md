# Finance Manager - Architecture Documentation

## Overview
This Spring Boot application implements a comprehensive finance management system with JWT-based authentication, MySQL database integration, and a layered architecture.

## Architecture Layers

### 1. **Entity/Model Layer** (`entity/`)
- **User**: Represents users with authentication credentials
- **Transaction**: Represents financial transactions (income/expense/transfer)
- **TransactionType**: Enum for transaction types
- **Budget**: Represents budget allocations by category

### 2. **Repository Layer** (`repository/`)
- **UserRepository**: Handles user data persistence
- **TransactionRepository**: Handles transaction data persistence
- **BudgetRepository**: Handles budget data persistence

### 3. **Service Layer** (`service/`)
- **AuthService**: Handles user registration and login logic
- **UserService**: Provides user-related operations

### 4. **Controller Layer** (`controller/`)
- **AuthController**: Exposes authentication endpoints
- **UserController**: Exposes user-related endpoints

### 5. **Security Layer** (`security/`)
- **SecurityConfiguration**: Main security configuration with Spring Security
- **JwtAuthenticationFilter**: Custom filter for JWT authentication
- **CustomUserDetailsService**: Custom implementation of UserDetailsService
- **JwtAuthenticationEntryPoint**: Handles authentication errors

### 6. **Utilities** (`util/`)
- **JwtTokenProvider**: Generates and validates JWT tokens

### 7. **Exception Handling** (`exception/`)
- **GlobalExceptionHandler**: Centralized exception handling
- **ResourceNotFoundException**: Custom exception for missing resources
- **DuplicateResourceException**: Custom exception for duplicate resources

### 8. **Data Transfer Objects** (`dto/`)
- **SignUpRequest**: DTO for user registration
- **SignInRequest**: DTO for user login
- **AuthResponse**: DTO for authentication response
- **UserResponse**: DTO for user data
- **ApiResponse**: Generic wrapper for all API responses

## Database Setup

### Prerequisites
- MySQL 8.0 or higher
- MySQL client or workbench

### Steps to Create Database

1. **Open MySQL Command Line or Workbench**

2. **Create Database:**
```sql
CREATE DATABASE finance_manager_db;
USE finance_manager_db;
```

3. **Run the Application**
The application will automatically create tables through Hibernate (ddl-auto=update)

### Database Configuration
Update `application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/finance_manager_db
spring.datasource.username=root
spring.datasource.password=your_password
```

## API Endpoints

### Authentication Endpoints

#### 1. **Sign Up**
```http
POST /api/auth/sign-up
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "token": "eyJhbGciOiJIUzUxMiJ9...",
    "type": "Bearer",
    "id": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  },
  "timestamp": "2026-04-21T10:30:00"
}
```

#### 2. **Sign In**
```http
POST /api/auth/sign-in
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "User signed in successfully",
  "data": {
    "token": "eyJhbGciOiJIUzUxMiJ9...",
    "type": "Bearer",
    "id": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  },
  "timestamp": "2026-04-21T10:30:00"
}
```

### User Endpoints (Requires Authentication)

#### 3. **Get Current User Profile**
```http
GET /api/users/profile
Authorization: Bearer eyJhbGciOiJIUzUxMiJ9...
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "User profile retrieved successfully",
  "data": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  },
  "timestamp": "2026-04-21T10:30:00"
}
```

#### 4. **Get User by ID**
```http
GET /api/users/{id}
Authorization: Bearer eyJhbGciOiJIUzUxMiJ9...
```

## Running the Application

### Prerequisites
- Java 21
- Maven
- MySQL Server

### Steps

1. **Clone/Download the project**

2. **Create MySQL Database:**
```bash
mysql -u root -p < database.sql
```

3. **Configure Database Connection:**
Edit `src/main/resources/application.properties`

4. **Build the Project:**
```bash
mvn clean install
```

5. **Run the Application:**
```bash
mvn spring-boot:run
```

The application will start on `http://localhost:8080/api`

## Security Features

1. **JWT Authentication**: Stateless authentication using JWT tokens
2. **Password Encryption**: Passwords encrypted using BCrypt
3. **CORS Configuration**: Enabled for all origins
4. **Session Management**: Stateless session policy
5. **Authorization**: Role-based access control ready (can be extended)

## JWT Token Configuration

Edit `application.properties`:
```properties
jwt.secret=your_secret_key_change_this_to_something_long_and_random_in_production
jwt.expiration=86400000  # Token expires in 24 hours (milliseconds)
```

## Error Handling

All errors follow a consistent format:
```json
{
  "success": false,
  "message": "Error description",
  "data": null,
  "timestamp": "2026-04-21T10:30:00"
}
```

### Common HTTP Status Codes
- **200 OK**: Successful request
- **201 Created**: Resource created successfully
- **400 Bad Request**: Invalid input
- **401 Unauthorized**: Missing or invalid token
- **404 Not Found**: Resource not found
- **409 Conflict**: Duplicate resource
- **500 Internal Server Error**: Server error

## Future Enhancements

1. **Transaction Management**
   - Create, read, update, delete transactions
   - Filter transactions by date, category, type
   - Transaction statistics and analytics

2. **Budget Management**
   - Create and manage budgets
   - Track spending against budgets
   - Budget alerts and notifications

3. **Reports**
   - Monthly spending reports
   - Income vs Expense analysis
   - Category-wise breakdown

4. **Advanced Security**
   - Refresh token implementation
   - Two-factor authentication
   - Role-based access control (RBAC)

5. **API Documentation**
   - Swagger/OpenAPI integration
   - API versioning

## Testing

The project includes test dependencies for:
- Spring Boot Test
- Spring Security Test
- JUnit 5

Create tests in `src/test/java/` following Spring Boot testing conventions.

## Project Structure
```
finance-manager/
├── src/
│   ├── main/
│   │   ├── java/com/example/finance/finance/manager/
│   │   │   ├── controller/      # REST Controllers
│   │   │   ├── service/         # Business Logic
│   │   │   ├── repository/      # Data Access
│   │   │   ├── entity/          # JPA Entities
│   │   │   ├── dto/             # Data Transfer Objects
│   │   │   ├── security/        # Security Configuration
│   │   │   ├── util/            # Utility Classes
│   │   │   ├── exception/       # Custom Exceptions
│   │   │   └── FinanceManagerApplication.java
│   │   └── resources/
│   │       └── application.properties
│   └── test/
│       └── java/...
├── pom.xml
└── README.md
```

## Dependencies

- **Spring Boot 4.0.5**
- **Spring Security**
- **Spring Data JPA**
- **MySQL Connector/J 8.0.33**
- **JWT (jjwt) 0.11.5**
- **Lombok**
- **Jakarta Validation**

## Contact & Support

For issues or questions about the architecture, please refer to Spring Boot official documentation or create an issue in the repository.
