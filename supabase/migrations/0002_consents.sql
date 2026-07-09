-- Immutable consent audit trail (smart-glasses recording disclosure, terms, privacy).

create type public.consent_type as enum ('smart_glasses_recording', 'terms', 'privacy');

create table public.consents (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.profiles(id) on delete cascade,
  consent_type public.consent_type not null,
  version text not null default 'v1',
  accepted boolean not null default true,
  accepted_at timestamptz not null default now(),
  user_agent text
);

create index consents_customer_id_idx on public.consents(customer_id);

alter table public.consents enable row level security;

create policy consents_select on public.consents for select using (
  customer_id = auth.uid() or public.is_admin()
);

-- Insert-only, immutable: no update/delete policy for anyone, including admin.
create policy consents_insert on public.consents for insert with check (
  customer_id = auth.uid()
);
