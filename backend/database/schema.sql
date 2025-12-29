-- Create database
CREATE DATABASE IF NOT EXISTS beauty_parlor;
USE beauty_parlor;

-- Users table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Services table
CREATE TABLE services (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price_npr DECIMAL(10, 2) NOT NULL,
    duration INT NOT NULL COMMENT 'Duration in minutes',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Availability table
CREATE TABLE availability (
    id INT PRIMARY KEY AUTO_INCREMENT,
    service_id INT NOT NULL,
    date DATE NOT NULL,
    time_slot TIME NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE,
    UNIQUE KEY unique_slot (service_id, date, time_slot)
);

-- Bookings table
CREATE TABLE bookings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    service_id INT NOT NULL,
    booking_date DATE NOT NULL,
    time_slot TIME NOT NULL,
    status ENUM('confirmed', 'cancelled') DEFAULT 'confirmed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE,
    UNIQUE KEY unique_booking (service_id, booking_date, time_slot, status),
    INDEX idx_user (user_id),
    INDEX idx_date (booking_date)
);

-- Insert sample services
INSERT INTO services (name, description, price_npr, duration) VALUES
('Haircut', 'Professional haircut and styling', 500.00, 30),
('Hair Color', 'Full hair coloring service', 2500.00, 120),
('Facial', 'Deep cleansing facial treatment', 1500.00, 60),
('Manicure', 'Nail care and polish', 800.00, 45),
('Pedicure', 'Foot care and polish', 1000.00, 60),
('Hair Spa', 'Relaxing hair spa treatment', 2000.00, 90),
('Bridal Makeup', 'Complete bridal makeup package', 5000.00, 180),
('Threading', 'Facial threading service', 300.00, 20);

-- Note: Admin user should be created via registration endpoint or using bcrypt to hash password
-- Default password hash for 'admin123' (use registration endpoint to create admin properly)

