CREATE TABLE IF NOT EXISTS users (
    user_id BIGINT PRIMARY KEY,
    username VARCHAR(255),
    first_name VARCHAR(255),
    balance DECIMAL(10, 2) DEFAULT 1000.00,
    real_balance DECIMAL(10, 2) DEFAULT 0.00,
    wager_progress DECIMAL(10, 2) DEFAULT 0.00,
    referral_code VARCHAR(50) UNIQUE,
    referred_by BIGINT,
    referral_earnings DECIMAL(10, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(user_id),
    type VARCHAR(50) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS game_history (
    id SERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(user_id),
    bet_amount DECIMAL(10, 2) NOT NULL,
    multiplier DECIMAL(5, 2) NOT NULL,
    win_amount DECIMAL(10, 2) NOT NULL,
    is_win BOOLEAN NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_referral ON users(referred_by);
CREATE INDEX idx_transactions_user ON transactions(user_id);
CREATE INDEX idx_game_history_user ON game_history(user_id);