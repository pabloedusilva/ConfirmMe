using Microsoft.EntityFrameworkCore.Migrations;

namespace ConfirmMe.Migrations
{
    /// <inheritdoc />
    public partial class RemoveBCryptAndUsePlainPassword : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Check if password_hash column exists and password column doesn't exist
            migrationBuilder.Sql(@"
                DO $$
                BEGIN
                    -- Add password column if it doesn't exist
                    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                                  WHERE table_name = 'users' AND column_name = 'password') THEN
                        ALTER TABLE users ADD COLUMN password VARCHAR(255);
                    END IF;
                    
                    -- If password_hash column exists, copy data and drop it
                    IF EXISTS (SELECT 1 FROM information_schema.columns 
                              WHERE table_name = 'users' AND column_name = 'password_hash') THEN
                        -- Set default password for existing users
                        -- WARNING: All users will need to reset their passwords
                        UPDATE users SET password = 'changepassword123' WHERE password IS NULL OR password = '';
                        
                        -- Make password column NOT NULL
                        ALTER TABLE users ALTER COLUMN password SET NOT NULL;
                        
                        -- Drop the old password_hash column
                        ALTER TABLE users DROP COLUMN password_hash;
                    END IF;
                END $$;
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Add password_hash column back
            migrationBuilder.AddColumn<string>(
                name: "password_hash",
                table: "users",
                type: "character varying(255)",
                maxLength: 255,
                nullable: false,
                defaultValue: "");

            // Copy password data back to password_hash (this would need BCrypt hashing in real scenario)
            migrationBuilder.Sql("UPDATE users SET password_hash = password");

            // Drop password column
            migrationBuilder.DropColumn(
                name: "password",
                table: "users");
        }
    }
}
