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
UPDATE services SET image_url = 'https://images.unsplash.com/photo-1560869713-7d0a0a3e4e5f?w=400' WHERE name = 'Haircut';
UPDATE services SET image_url = 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=400' WHERE name = 'Hair Color';
UPDATE services SET image_url = 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400' WHERE name = 'Facial';
UPDATE services SET image_url = 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400' WHERE name = 'Manicure';
UPDATE services SET image_url = 'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=400' WHERE name = 'Pedicure';
UPDATE services SET image_url = 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=400' WHERE name = 'Hair Spa';
UPDATE services SET image_url = 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400' WHERE name = 'Bridal Makeup';
UPDATE services SET image_url = 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=400' WHERE name = 'Threading';

