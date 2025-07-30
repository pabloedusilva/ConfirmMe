-- Migration script to remove BCrypt hashing and convert to plain text passwords
-- WARNING: This will convert all existing password hashes to a default password
-- Users will need to be informed to update their passwords after this migration

-- Step 1: Add new password column
ALTER TABLE users ADD COLUMN IF NOT EXISTS password VARCHAR(255);

-- Step 2: Set default password for existing users (you may want to customize this)
UPDATE users SET password = 'defaultpassword123' WHERE password IS NULL;

-- Step 3: Make the new password column NOT NULL
ALTER TABLE users ALTER COLUMN password SET NOT NULL;

-- Step 4: Drop the old password_hash column
ALTER TABLE users DROP COLUMN IF EXISTS password_hash;

-- Step 5: Update the comment
COMMENT ON COLUMN users.password IS 'Senha do usuário em texto simples';

-- Verification query to check the changes
-- SELECT username, password, email FROM users;
