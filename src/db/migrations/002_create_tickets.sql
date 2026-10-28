CREATE TABLE tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id),
  customer_name varchar(120) NOT NULL,
  phone_number varchar(32) NOT NULL,
  subject varchar(200) NOT NULL,
  description varchar(5000) NOT NULL,
  status text NOT NULL DEFAULT 'open'
    CHECK (status IN ('open', 'assigned', 'in_progress', 'resolved', 'closed')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX tickets_tenant_created_idx
  ON tickets (tenant_id, created_at DESC);

ALTER TABLE tickets
ADD CONSTRAINT tickets_priority_check
CHECK (priority IN ('low', 'medium', 'high', 'urgent'));