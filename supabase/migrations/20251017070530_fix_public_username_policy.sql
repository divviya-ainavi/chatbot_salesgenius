/*
  # Fix Public Username Check Policy

  1. Changes
    - Drop the overly permissive policy
    - Keep RLS strict and let database unique constraint handle duplicate usernames
  
  2. Security
    - Maintains strict RLS policies
    - Database will return proper error if username is taken
*/

-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Anyone can check username availability" ON profiles;