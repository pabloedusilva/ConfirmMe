-- Script SQL para NeonTech PostgreSQL
-- Execute este script no console SQL do NeonTech para criar as tabelas

-- Tabela para armazenar usuários do sistema
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Inserir usuário padrão (senha: maiony123)
INSERT INTO users (username, password, email) 
VALUES ('maiony', 'maiony123', 'admin@confirmme.com')
ON CONFLICT (username) DO NOTHING;

-- Tabela para armazenar as confirmações principais
CREATE TABLE IF NOT EXISTS confirmations (
    id SERIAL PRIMARY KEY,
    main_guest_name VARCHAR(255) NOT NULL,
    main_guest_attending BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela para armazenar os acompanhantes
CREATE TABLE IF NOT EXISTS additional_guests (
    id SERIAL PRIMARY KEY,
    confirmation_id INTEGER NOT NULL,
    guest_name VARCHAR(255) NOT NULL,
    attending BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (confirmation_id) REFERENCES confirmations(id) ON DELETE CASCADE
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);
CREATE INDEX IF NOT EXISTS idx_confirmations_created_at ON confirmations(created_at);
CREATE INDEX IF NOT EXISTS idx_additional_guests_confirmation_id ON additional_guests(confirmation_id);
CREATE INDEX IF NOT EXISTS idx_confirmations_attending ON confirmations(main_guest_attending);
CREATE INDEX IF NOT EXISTS idx_additional_guests_attending ON additional_guests(attending);

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_confirmations_updated_at 
    BEFORE UPDATE ON confirmations 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Comentários nas tabelas para documentação
COMMENT ON TABLE users IS 'Tabela para armazenar usuários do sistema';
COMMENT ON TABLE confirmations IS 'Tabela principal para armazenar confirmações de presença';
COMMENT ON TABLE additional_guests IS 'Tabela para armazenar acompanhantes de cada confirmação';

COMMENT ON COLUMN users.id IS 'Identificador único do usuário';
COMMENT ON COLUMN users.username IS 'Nome de usuário único';
COMMENT ON COLUMN users.password IS 'Senha do usuário em texto simples';
COMMENT ON COLUMN users.email IS 'Email do usuário';
COMMENT ON COLUMN users.is_active IS 'Se o usuário está ativo';
COMMENT ON COLUMN users.created_at IS 'Data e hora da criação do usuário';
COMMENT ON COLUMN users.updated_at IS 'Data e hora da última atualização';

COMMENT ON COLUMN confirmations.id IS 'Identificador único da confirmação';
COMMENT ON COLUMN confirmations.main_guest_name IS 'Nome completo do convidado principal';
COMMENT ON COLUMN confirmations.main_guest_attending IS 'Se o convidado principal vai comparecer';
COMMENT ON COLUMN confirmations.created_at IS 'Data e hora da criação da confirmação';
COMMENT ON COLUMN confirmations.updated_at IS 'Data e hora da última atualização';

COMMENT ON COLUMN additional_guests.id IS 'Identificador único do acompanhante';
COMMENT ON COLUMN additional_guests.confirmation_id IS 'Referência à confirmação principal';
COMMENT ON COLUMN additional_guests.guest_name IS 'Nome completo do acompanhante';
COMMENT ON COLUMN additional_guests.attending IS 'Se o acompanhante vai comparecer';
COMMENT ON COLUMN additional_guests.created_at IS 'Data e hora da criação do registro';