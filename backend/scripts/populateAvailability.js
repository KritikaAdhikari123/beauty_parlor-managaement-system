const db = require('../config/database');
require('dotenv').config();

async function populateAvailability() {
  try {
    // Get all services
    const [services] = await db.execute('SELECT id FROM services');
    
    if (services.length === 0) {
      console.log('No services found. Please add services first.');
      process.exit(0);
    }

    // Time slots (9 AM to 6 PM)
    const timeSlots = [
      '09:00:00', '10:00:00', '11:00:00', '12:00:00',
      '13:00:00', '14:00:00', '15:00:00', '16:00:00',
      '17:00:00', '18:00:00'
    ];

    // Generate dates for next 30 days
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }

    let inserted = 0;
    let skipped = 0;

    // Insert availability for each service, date, and time slot
    for (const service of services) {
      for (const date of dates) {
        for (const timeSlot of timeSlots) {
          try {
            // Check if slot already exists
            const [existing] = await db.execute(
              'SELECT id FROM availability WHERE service_id = ? AND date = ? AND time_slot = ?',
              [service.id, date, timeSlot]
            );

            if (existing.length === 0) {
              await db.execute(
                'INSERT INTO availability (service_id, date, time_slot, is_available) VALUES (?, ?, ?, ?)',
                [service.id, date, timeSlot, true]
              );
              inserted++;
            } else {
              skipped++;
            }
          } catch (error) {
            console.error(`Error inserting slot for service ${service.id}, date ${date}, time ${timeSlot}:`, error.message);
          }
        }
      }
    }

    console.log('Availability population completed!');
    console.log(`Inserted: ${inserted} slots`);
    console.log(`Skipped (already exists): ${skipped} slots`);
    process.exit(0);
  } catch (error) {
    console.error('Error populating availability:', error);
    process.exit(1);
  }
}

populateAvailability();

