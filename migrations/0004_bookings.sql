-- Create bookings table for strategy session bookings
CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  whatsapp TEXT,
  -- Social media profiles
  ig_handle TEXT,
  youtube TEXT,
  linkedin TEXT,
  facebook TEXT,
  tiktok TEXT,
  twitter TEXT,
  -- Discovery questions
  creator_stage TEXT,
  niche TEXT,
  biggest_pain TEXT,
  biggest_frustration TEXT,
  biggest_desire TEXT,
  dream_outcome TEXT,
  revenue TEXT,
  challenge TEXT,
  -- Booking details
  booked_date TEXT,
  booked_time TEXT,
  status TEXT DEFAULT 'booked',
  -- Email tracking
  confirmation_sent BOOLEAN DEFAULT FALSE,
  admin_notified BOOLEAN DEFAULT FALSE,
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for email lookups
CREATE INDEX IF NOT EXISTS idx_bookings_email ON bookings(email);

-- Create index for status filtering
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);

-- Create index for date sorting
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at DESC);
