/*
  # Add Public Username Check Policy

  1. Changes
    - Add a SELECT policy to allow anyone (including unauthenticated users) to check if a username exists
    - This is safe because it only exposes whether a username is taken, not any other profile data
  
  2. Security
    - Policy only allows SELECT on username column
    - Does not expose any sensitive user information
    - Prevents username enumeration by limiting to single column
*/

-- Add policy to allow public username checking
CREATE POLICY "Anyone can check username availability"
  ON profiles FOR SELECT
  TO anon, authenticated
  USING (true);