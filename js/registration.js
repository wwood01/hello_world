// Registration functionality for Hello World app
class Registration {
    constructor() {
        this.users = [];
        this.init();
    }

    init() {
        const form = document.getElementById('registrationForm');
        if (form) {
            form.addEventListener('submit', (e) => this.handleSubmit(e));
        }
    }

    handleSubmit(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const userData = {
            username: formData.get('username'),
            email: formData.get('email'),
            password: formData.get('password')
        };

        const result = this.register(userData);
        this.showMessage(result.message, result.success ? 'success' : 'error');
        
        if (result.success) {
            event.target.reset();
        }
    }

    register(userData) {
        // Validate input
        const validation = this.validateUser(userData);
        if (!validation.valid) {
            return { success: false, message: validation.message };
        }

        // Check if user already exists
        if (this.userExists(userData.username, userData.email)) {
            return { success: false, message: 'Username or email already exists' };
        }

        // Add user
        this.users.push({
            username: userData.username,
            email: userData.email,
            password: userData.password, // Note: In real app, this should be hashed
            registeredAt: new Date()
        });

        return { success: true, message: 'Registration successful!' };
    }

    validateUser(userData) {
        if (!userData.username || userData.username.length < 3) {
            return { valid: false, message: 'Username must be at least 3 characters long' };
        }

        if (!userData.email || !this.isValidEmail(userData.email)) {
            return { valid: false, message: 'Please enter a valid email address' };
        }

        if (!userData.password || userData.password.length < 6) {
            return { valid: false, message: 'Password must be at least 6 characters long' };
        }

        return { valid: true };
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    userExists(username, email) {
        return this.users.some(user => 
            user.username === username || user.email === email
        );
    }

    getUsers() {
        return this.users;
    }

    showMessage(message, type) {
        const messageDiv = document.getElementById('message');
        if (messageDiv) {
            messageDiv.textContent = message;
            messageDiv.className = `message ${type}`;
        }
    }

    // For testing purposes
    clearUsers() {
        this.users = [];
    }
}

// Initialize registration when DOM is loaded
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        window.registration = new Registration();
    });
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Registration;
}