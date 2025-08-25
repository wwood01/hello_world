// Tests for registration functionality
const Registration = require('../js/registration.js');

describe('Registration', () => {
    let registration;

    beforeEach(() => {
        registration = new Registration();
        registration.clearUsers();
    });

    describe('User Registration', () => {
        test('should successfully register a valid user', () => {
            const userData = {
                username: 'testuser',
                email: 'test@example.com',
                password: 'password123'
            };

            const result = registration.register(userData);

            expect(result.success).toBe(true);
            expect(result.message).toBe('Registration successful!');
            expect(registration.getUsers()).toHaveLength(1);
        });

        test('should reject registration with invalid username', () => {
            const userData = {
                username: 'ab', // too short
                email: 'test@example.com',
                password: 'password123'
            };

            const result = registration.register(userData);

            expect(result.success).toBe(false);
            expect(result.message).toBe('Username must be at least 3 characters long');
            expect(registration.getUsers()).toHaveLength(0);
        });

        test('should reject registration with invalid email', () => {
            const userData = {
                username: 'testuser',
                email: 'invalid-email',
                password: 'password123'
            };

            const result = registration.register(userData);

            expect(result.success).toBe(false);
            expect(result.message).toBe('Please enter a valid email address');
            expect(registration.getUsers()).toHaveLength(0);
        });

        test('should reject registration with weak password', () => {
            const userData = {
                username: 'testuser',
                email: 'test@example.com',
                password: '123' // too short
            };

            const result = registration.register(userData);

            expect(result.success).toBe(false);
            expect(result.message).toBe('Password must be at least 6 characters long');
            expect(registration.getUsers()).toHaveLength(0);
        });

        test('should reject duplicate username', () => {
            const userData1 = {
                username: 'testuser',
                email: 'test1@example.com',
                password: 'password123'
            };

            const userData2 = {
                username: 'testuser', // same username
                email: 'test2@example.com',
                password: 'password456'
            };

            registration.register(userData1);
            const result = registration.register(userData2);

            expect(result.success).toBe(false);
            expect(result.message).toBe('Username or email already exists');
            expect(registration.getUsers()).toHaveLength(1);
        });

        test('should reject duplicate email', () => {
            const userData1 = {
                username: 'testuser1',
                email: 'test@example.com',
                password: 'password123'
            };

            const userData2 = {
                username: 'testuser2',
                email: 'test@example.com', // same email
                password: 'password456'
            };

            registration.register(userData1);
            const result = registration.register(userData2);

            expect(result.success).toBe(false);
            expect(result.message).toBe('Username or email already exists');
            expect(registration.getUsers()).toHaveLength(1);
        });
    });

    describe('User Validation', () => {
        test('should validate correct user data', () => {
            const userData = {
                username: 'validuser',
                email: 'valid@example.com',
                password: 'validpassword'
            };

            const result = registration.validateUser(userData);

            expect(result.valid).toBe(true);
        });

        test('should validate email format correctly', () => {
            expect(registration.isValidEmail('test@example.com')).toBe(true);
            expect(registration.isValidEmail('user.name@domain.co.uk')).toBe(true);
            expect(registration.isValidEmail('invalid-email')).toBe(false);
            expect(registration.isValidEmail('invalid@')).toBe(false);
            expect(registration.isValidEmail('@invalid.com')).toBe(false);
        });
    });

    describe('User Storage', () => {
        test('should store user data correctly', () => {
            const userData = {
                username: 'testuser',
                email: 'test@example.com',
                password: 'password123'
            };

            registration.register(userData);
            const users = registration.getUsers();

            expect(users).toHaveLength(1);
            expect(users[0].username).toBe('testuser');
            expect(users[0].email).toBe('test@example.com');
            expect(users[0].password).toBe('password123');
            expect(users[0].registeredAt).toBeInstanceOf(Date);
        });

        test('should check user existence correctly', () => {
            const userData = {
                username: 'testuser',
                email: 'test@example.com',
                password: 'password123'
            };

            expect(registration.userExists('testuser', 'test@example.com')).toBe(false);
            
            registration.register(userData);
            
            expect(registration.userExists('testuser', 'different@email.com')).toBe(true);
            expect(registration.userExists('differentuser', 'test@example.com')).toBe(true);
            expect(registration.userExists('differentuser', 'different@email.com')).toBe(false);
        });
    });
});