-- USERS
CREATE TABLE users (
    id UUID PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- SQUARE CUSTOMER RECORD
CREATE TABLE square_customers (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    square_customer_id TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id)
);

-- PAYMENTS (Card, CashAppPay)
CREATE TABLE payments (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    square_payment_id TEXT UNIQUE NOT NULL,
    status TEXT NOT NULL, -- APPROVED, COMPLETED, CANCELED, FAILED
    amount INTEGER NOT NULL, -- in cents
    currency TEXT DEFAULT 'USD',
    method TEXT NOT NULL, -- card, cash_app_pay
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ORDERS (Optional but recommended)
CREATE TABLE orders (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    square_order_id TEXT UNIQUE,
    amount INTEGER NOT NULL,
    status TEXT NOT NULL, -- PENDING, PAID, CANCELED
    created_at TIMESTAMP DEFAULT NOW()
);

-- SUBSCRIPTIONS (Square uses "Subscriptions" + "Invoices")
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    square_subscription_id TEXT UNIQUE NOT NULL,
    plan_id TEXT NOT NULL,
    status TEXT NOT NULL, -- ACTIVE, CANCELED, PAUSED
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- SUBSCRIPTION INVOICES
CREATE TABLE subscription_invoices (
    id UUID PRIMARY KEY,
    subscription_id UUID REFERENCES subscriptions(id),
    square_invoice_id TEXT UNIQUE NOT NULL,
    amount INTEGER,
    status TEXT, -- PAID, UNPAID, VOIDED
    due_date DATE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- REFUNDS
CREATE TABLE refunds (
    id UUID PRIMARY KEY,
    payment_id UUID REFERENCES payments(id),
    square_refund_id TEXT UNIQUE NOT NULL,
    amount INTEGER NOT NULL,
    status TEXT NOT NULL, -- PENDING, APPROVED, REJECTED
    created_at TIMESTAMP DEFAULT NOW()
);

-- WEBHOOK LOGS
CREATE TABLE webhook_logs (
    id UUID PRIMARY KEY,
    event_type TEXT NOT NULL,
    raw_payload JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
