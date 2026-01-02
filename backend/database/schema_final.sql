-- Final Schema Updates for Strict Booking Status Control
-- Run this to enforce PENDING status and add service images

USE beauty_parlor;

-- Update bookings table: enforce PENDING status and correct enum
ALTER TABLE bookings 
MODIFY COLUMN status ENUM('PENDING','CONFIRMED','CANCEL_REQUESTED','CANCELLED','COMPLETED') DEFAULT 'PENDING';

-- Add image_url to services table
ALTER TABLE services 
ADD COLUMN image_url VARCHAR(500) NULL AFTER category;

-- Add image_url to staff table
ALTER TABLE staff 
ADD COLUMN image_url VARCHAR(500) NULL AFTER bio;

-- Update existing bookings to PENDING if they are confirmed (for migration)
UPDATE bookings SET status = 'PENDING' WHERE status = 'confirmed';

-- Insert service images (using placeholder URLs - replace with actual images)
UPDATE services SET image_url = 'https://plus.unsplash.com/premium_photo-1664048713117-cee94e5048a0?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' WHERE name = 'Haircut';
UPDATE services SET image_url = 'https://images.unsplash.com/photo-1707979577466-2d6109c68a45?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' WHERE name = 'Hair Color';
UPDATE services SET image_url = 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400' WHERE name = 'Facial';
UPDATE services SET image_url = 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400' WHERE name = 'Manicure';
UPDATE services SET image_url = 'https://plus.unsplash.com/premium_photo-1680348266597-6d89a08d12d7?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' WHERE name = 'Pedicure';
UPDATE services SET image_url = 'https://plus.unsplash.com/premium_photo-1664475130052-f58aaf58854e?q=80&w=1744&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' WHERE name = 'Hair Spa';
UPDATE services SET image_url = 'https://plus.unsplash.com/premium_photo-1724762178439-1f93ad3f3cb6?q=80&w=1608&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' WHERE name = 'Bridal Makeup';
UPDATE services SET image_url = 'https://images.unsplash.com/photo-1519415387722-a1c3bbef716c?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' WHERE name = 'Threading';

