-- Schema updates for Beauty Parlour Management System
-- Run this after the base schema.sql

USE beauty_parlor;

-- Add category to services table
ALTER TABLE services 
ADD COLUMN category VARCHAR(100) DEFAULT 'General' AFTER description;

-- Update bookings table: add new statuses and cancellation request
ALTER TABLE bookings 
MODIFY COLUMN status ENUM('pending', 'confirmed', 'cancelled', 'completed', 'cancellation_requested') DEFAULT 'pending';

-- Add stylist_id to bookings
ALTER TABLE bookings 
ADD COLUMN stylist_id INT NULL AFTER service_id,
ADD COLUMN cancellation_requested_at TIMESTAMP NULL AFTER status,
ADD COLUMN cancellation_reason TEXT NULL AFTER cancellation_requested_at;

-- Create staff/stylists table
CREATE TABLE IF NOT EXISTS staff (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    specialization VARCHAR(200),
    bio TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create staff working hours table
CREATE TABLE IF NOT EXISTS staff_working_hours (
    id INT PRIMARY KEY AUTO_INCREMENT,
    staff_id INT NOT NULL,
    day_of_week ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday') NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (staff_id) REFERENCES staff(id) ON DELETE CASCADE,
    UNIQUE KEY unique_staff_day (staff_id, day_of_week)
);

-- Add foreign key for stylist_id in bookings
ALTER TABLE bookings 
ADD CONSTRAINT fk_booking_stylist 
FOREIGN KEY (stylist_id) REFERENCES staff(id) ON DELETE SET NULL;

-- Create feedback table
CREATE TABLE IF NOT EXISTS feedback (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    booking_id INT NULL,
    service_id INT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    is_visible BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE SET NULL,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE SET NULL,
    INDEX idx_user (user_id),
    INDEX idx_service (service_id)
);

-- Update services with categories
UPDATE services SET category = 'Hair Services' WHERE name IN ('Haircut', 'Hair Color', 'Hair Spa');
UPDATE services SET category = 'Facial & Skincare' WHERE name IN ('Facial', 'Threading');
UPDATE services SET category = 'Nail Services' WHERE name IN ('Manicure', 'Pedicure');
UPDATE services SET category = 'Makeup' WHERE name = 'Bridal Makeup';

-- Insert sample staff
INSERT INTO staff (name, email, phone, specialization, bio) VALUES
('Priya Sharma', 'priya@sujitabeautyparlour.com', '+977-9841234567', 'Hair Styling, Hair Color', 'Expert hair stylist with 8 years of experience'),
('Sita Thapa', 'sita@sujitabeautyparlour.com', '+977-9841234568', 'Facial, Skincare', 'Certified facial specialist'),
('Rita Gurung', 'rita@sujitabeautyparlour.com', '+977-9841234569', 'Nail Art, Manicure, Pedicure', 'Creative nail artist'),
('Maya Tamang', 'maya@sujitabeautyparlour.com', '+977-9841234570', 'Bridal Makeup, Party Makeup', 'Professional makeup artist');

-- Insert sample working hours (9 AM to 6 PM, Monday to Saturday)
INSERT INTO staff_working_hours (staff_id, day_of_week, start_time, end_time) 
SELECT id, 'Monday', '09:00:00', '18:00:00' FROM staff;
INSERT INTO staff_working_hours (staff_id, day_of_week, start_time, end_time) 
SELECT id, 'Tuesday', '09:00:00', '18:00:00' FROM staff;
INSERT INTO staff_working_hours (staff_id, day_of_week, start_time, end_time) 
SELECT id, 'Wednesday', '09:00:00', '18:00:00' FROM staff;
INSERT INTO staff_working_hours (staff_id, day_of_week, start_time, end_time) 
SELECT id, 'Thursday', '09:00:00', '18:00:00' FROM staff;
INSERT INTO staff_working_hours (staff_id, day_of_week, start_time, end_time) 
SELECT id, 'Friday', '09:00:00', '18:00:00' FROM staff;
INSERT INTO staff_working_hours (staff_id, day_of_week, start_time, end_time) 
SELECT id, 'Saturday', '09:00:00', '18:00:00' FROM staff;

