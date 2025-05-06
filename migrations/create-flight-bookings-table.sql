-- Create flight_bookings table
CREATE TABLE IF NOT EXISTS public.flight_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  booking_reference VARCHAR(20) NOT NULL UNIQUE,
  passenger_name VARCHAR(255) NOT NULL,
  passenger_email VARCHAR(255) NOT NULL,
  passenger_phone VARCHAR(50),
  outbound_flight VARCHAR(50) NOT NULL,
  departure_airport VARCHAR(255) NOT NULL,
  departure_code VARCHAR(10) NOT NULL,
  arrival_airport VARCHAR(255) NOT NULL,
  arrival_code VARCHAR(10) NOT NULL,
  departure_date DATE NOT NULL,
  departure_time VARCHAR(10) NOT NULL,
  arrival_time VARCHAR(10) NOT NULL,
  return_flight VARCHAR(50),
  return_departure_airport VARCHAR(255),
  return_departure_code VARCHAR(10),
  return_arrival_airport VARCHAR(255),
  return_arrival_code VARCHAR(10),
  return_date DATE,
  return_departure_time VARCHAR(10),
  return_arrival_time VARCHAR(10),
  price DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) NOT NULL DEFAULT 'USD',
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  payment_id VARCHAR(255),
  payment_method VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_flight_bookings_user_id ON public.flight_bookings(user_id);

-- Create index on booking_reference for faster lookups
CREATE INDEX IF NOT EXISTS idx_flight_bookings_reference ON public.flight_bookings(booking_reference);

-- Enable RLS
ALTER TABLE public.flight_bookings ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view their own bookings
CREATE POLICY user_select_own_bookings ON public.flight_bookings
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policy for users to insert their own bookings
CREATE POLICY user_insert_own_bookings ON public.flight_bookings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create policy for users to update their own bookings
CREATE POLICY user_update_own_bookings ON public.flight_bookings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policy for admins to manage all bookings
CREATE POLICY admin_manage_bookings ON public.flight_bookings
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');
