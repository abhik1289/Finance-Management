# Quick Start Guide - Finance Manager

## Prerequisites
- Java 21
- Maven
- MySQL 8.0+
- Postman or cURL (for testing API)

## Step 1: Database Setup

Open MySQL command line and execute:

```bash
mysql -u root -p < database.sql
```

Or manually:

```sql
CREATE DATABASE finance_manager_db;
```

## Step 2: Configure Application

Edit `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/finance_manager_db
spring.datasource.username=root
spring.datasource.password=your_mysql_password
jwt.secret=change_this_to_a_long_random_string_in_production
jwt.expiration=86400000
```

## Step 3: Build & Run

```bash
# Build
mvn clean install

# Run
mvn spring-boot:run
```

Server starts at: `http://localhost:8080/api`

## Step 4: Test API

### Option A: Using Postman

#### 1. Sign Up
```
Method: POST
URL: http://localhost:8080/api/auth/sign-up
Headers: Content-Type: application/json

Body (JSON):
{
  "email": "john@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

Response:
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "token": "eyJhbGciOiJIUzUxMiJ9...",
    "type": "Bearer",
    "id": 1,
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

**Copy the token for authenticated requests**

#### 2. Sign In
```
Method: POST
URL: http://localhost:8080/api/auth/sign-in
Headers: Content-Type: application/json

Body (JSON):
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### 3. Get User Profile (Authenticated)
```
Method: GET
URL: http://localhost:8080/api/users/profile
Headers: 
  - Content-Type: application/json
  - Authorization: Bearer {YOUR_TOKEN_HERE}
```

#### 4. Get User by ID (Authenticated)
```
Method: GET
URL: http://localhost:8080/api/users/1
Headers:
  - Content-Type: application/json
  - Authorization: Bearer {YOUR_TOKEN_HERE}
```

### Option B: Using cURL

#### Sign Up:
```bash
curl -X POST http://localhost:8080/api/auth/sign-up \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

#### Sign In:
```bash
curl -X POST http://localhost:8080/api/auth/sign-in \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

#### Get Profile (replace TOKEN):
```bash
curl -X GET http://localhost:8080/api/users/profile \
  -H "Authorization: Bearer TOKEN_HERE"
```

## Project Structure

```
src/main/java/com/example/finance/finance/manager/
├── controller/     # REST Endpoints
├── service/        # Business Logic
├── repository/     # Database Access
├── entity/         # Database Models
├── dto/            # API Data Transfer Objects
├── security/       # JWT & Security Config
├── util/           # Helper Classes
└── exception/      # Error Handling
```

## Common Issues & Solutions

### Issue: Connection Refused to MySQL
**Solution:**
1. Ensure MySQL is running: `mysql -u root -p` (if this works, MySQL is running)
2. Check database URL in application.properties
3. Verify username/password

### Issue: "User not found" on login
**Solution:**
1. Make sure you signed up first
2. Check email spelling
3. Ensure password is correct

### Issue: "Invalid JWT token"
**Solution:**
1. Generate a new token by signing in again
2. Make sure token is in the Authorization header as "Bearer {token}"
3. Check if token has expired (24 hours by default)

### Issue: 401 Unauthorized
**Solution:**
1. Add Authorization header with token
2. Ensure token is valid
3. Check if endpoint requires authentication

## Next Steps

### Add Transaction Management
See `ARCHITECTURE.md` for planned features

### Extend the Application
1. Add more entities and repositories
2. Create service classes for business logic
3. Build REST controllers for each entity
4. Add validation and error handling

### Security Improvements
1. Implement refresh tokens
2. Add two-factor authentication
3. Implement role-based access control (RBAC)
4. Add API rate limiting

## Useful Resources

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Spring Data JPA](https://spring.io/projects/spring-data-jpa)
- [Spring Security](https://spring.io/projects/spring-security)
- [JWT Documentation](https://jwt.io/)
- [MySQL Documentation](https://dev.mysql.com/doc/)

## Support

For issues or questions:
1. Check `ARCHITECTURE.md` for detailed documentation
2. Review Spring Boot official documentation
3. Check application logs for error details

---

**Happy Coding!** 🚀
