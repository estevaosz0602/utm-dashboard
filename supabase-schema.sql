-- ============================================================
-- UTM DASHBOARD — Supabase Schema
-- Execute este SQL no SQL Editor do Supabase
-- ============================================================

-- Extensions
create extension if not exists "uuid-ossp";

-- ============================================================
-- PROFILES
-- ============================================================
create table public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  email         text not null,
  webhook_token text not null default encode(gen_random_bytes(32), 'hex'),
  created_at    timestamptz not null default now()
);

-- Trigger: cria perfil automaticamente no signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- SALES
-- ============================================================
create table public.sales (
  id                  uuid primary key default uuid_generate_v4(),
  user_id             uuid not null references public.profiles(id) on delete cascade,
  platform            text not null check (platform in ('perfectpay', 'applyfy')),
  external_code       text not null,
  platform_unique_key text not null,
  sale_amount         numeric(12,2) not null,
  installment_amount  numeric(12,2),
  installments        integer,
  currency            text not null default 'BRL',
  status              text not null,
  status_detail       text,
  payment_method      text,
  product_name        text,
  customer_name       text,
  customer_email      text,
  customer_phone      text,
  utm_source          text,
  utm_medium          text,
  utm_campaign        text,
  utm_content         text,
  utm_term            text,
  raw_payload         jsonb,
  sale_date           timestamptz,
  approved_at         timestamptz,
  created_at          timestamptz not null default now()
);

create unique index sales_unique_key_idx
  on public.sales (user_id, platform, platform_unique_key);

create index sales_user_id_idx    on public.sales (user_id);
create index sales_sale_date_idx  on public.sales (sale_date desc);
create index sales_status_idx     on public.sales (status);

-- ============================================================
-- PUSH SUBSCRIPTIONS
-- ============================================================
create table public.push_subscriptions (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid not null references public.profiles(id) on delete cascade,
  endpoint   text not null unique,
  p256dh     text not null,
  auth       text not null,
  created_at timestamptz not null default now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table public.profiles          enable row level security;
alter table public.sales             enable row level security;
alter table public.push_subscriptions enable row level security;

create policy "profiles: own row" on public.profiles
  for all using (auth.uid() = id);

create policy "sales: own rows" on public.sales
  for all using (auth.uid() = user_id);

create policy "push_subscriptions: own rows" on public.push_subscriptions
  for all using (auth.uid() = user_id);

-- ============================================================
-- HELPER FUNCTION FOR SUMMARY METRICS (optional - used by queries)
-- ============================================================
create or replace function public.get_summary_metrics(
  p_user_id uuid,
  p_from timestamptz,
  p_to timestamptz
)
returns table(
  approved_count bigint,
  pending_count bigint,
  refunded_count bigint,
  cancelled_count bigint,
  total_revenue numeric,
  pending_revenue numeric,
  avg_ticket numeric
)
language sql security definer as $$
  select
    count(*) filter (where status = 'approved')              as approved_count,
    count(*) filter (where status = 'pending')               as pending_count,
    count(*) filter (where status = 'refunded')              as refunded_count,
    count(*) filter (where status = 'cancelled')             as cancelled_count,
    coalesce(sum(sale_amount) filter (where status = 'approved'), 0)  as total_revenue,
    coalesce(sum(sale_amount) filter (where status = 'pending'),  0)  as pending_revenue,
    coalesce(avg(sale_amount) filter (where status = 'approved'), 0)  as avg_ticket
  from public.sales
  where user_id = p_user_id
    and sale_date between p_from and p_to;
$$;
