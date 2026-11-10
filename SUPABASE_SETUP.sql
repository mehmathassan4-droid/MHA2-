-- MHA Supabase setup. Run once in Supabase SQL Editor.
-- Does not delete, reset, or import any existing Firebase data.
create table if not exists public.mha_documents (
  collection text not null,
  id text not null,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (collection,id)
);
create index if not exists mha_documents_collection_idx on public.mha_documents(collection);
create index if not exists mha_documents_data_gin_idx on public.mha_documents using gin(data);
alter table public.mha_documents enable row level security;
DO $$
DECLARE pol record;
BEGIN
  FOR pol IN SELECT policyname FROM pg_policies WHERE schemaname='public' AND tablename='mha_documents' LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.mha_documents', pol.policyname);
  END LOOP;
END $$;
create or replace function public.mha_is_approved(p_uid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.mha_documents p
    where p.collection='profiles' and p.id=p_uid::text
      and p.data->>'status'='approved'
  );
$$;
grant execute on function public.mha_is_approved(uuid) to authenticated;
grant select, insert, update, delete on public.mha_documents to authenticated;
drop policy if exists "MHA owner full access" on public.mha_documents;
drop policy if exists "MHA approved users read and write" on public.mha_documents;
drop policy if exists "MHA users create own pending profile" on public.mha_documents;
create policy "MHA owner full access" on public.mha_documents
for all to authenticated
using ((auth.jwt() ->> 'email') = 'mehmathassan4@gmail.com')
with check ((auth.jwt() ->> 'email') = 'mehmathassan4@gmail.com');
create policy "MHA users create own pending profile" on public.mha_documents
for insert to authenticated
with check (
  collection='profiles' and id=auth.uid()::text
  and coalesce(data->>'status','pending')='pending'
  and coalesce(data->>'requestedRole','booker') in ('booker','admin')
);
-- The first admin profile is created automatically by the app for this exact email.
-- Auth > Users must contain mehmathassan4@gmail.com and it must be confirmed.

drop policy if exists "MHA user reads own pending profile" on public.mha_documents;
drop policy if exists "MHA user updates own pending profile" on public.mha_documents;
create policy "MHA user reads own pending profile" on public.mha_documents
for select to authenticated
using (collection='profiles' and id=auth.uid()::text);
create policy "MHA user updates own pending profile" on public.mha_documents
for update to authenticated
using (collection='profiles' and id=auth.uid()::text and coalesce(data->>'status','pending')='pending')
with check (collection='profiles' and id=auth.uid()::text and coalesce(data->>'status','pending')='pending' and coalesce(data->>'requestedRole','booker') in ('booker','admin'));

create or replace function public.mha_is_admin(p_uid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.mha_documents p
    where p.collection='profiles' and p.id=p_uid::text
      and p.data->>'status'='approved'
      and p.data->>'role' in ('admin','owner')
  );
$$;
grant execute on function public.mha_is_admin(uuid) to authenticated;
drop policy if exists "MHA approved users read" on public.mha_documents;
drop policy if exists "MHA approved users insert" on public.mha_documents;
drop policy if exists "MHA approved admins update" on public.mha_documents;
drop policy if exists "MHA approved admins delete" on public.mha_documents;
create policy "MHA approved users read" on public.mha_documents
for select to authenticated
using (public.mha_is_approved(auth.uid()));
create policy "MHA approved users insert" on public.mha_documents
for insert to authenticated
with check (
  public.mha_is_approved(auth.uid()) and (
    (public.mha_is_admin(auth.uid()) and collection <> 'profiles') or
    (collection in ('orders','returns','invoicePayments') and data->>'createdBy'=auth.uid()::text)
  )
);
create policy "MHA approved admins update" on public.mha_documents
for update to authenticated
using ((public.mha_is_admin(auth.uid()) and collection <> 'profiles') or (collection='orders' and data->>'createdBy'=auth.uid()::text))
with check ((public.mha_is_admin(auth.uid()) and collection <> 'profiles') or (collection='orders' and data->>'createdBy'=auth.uid()::text));
create policy "MHA approved admins delete" on public.mha_documents
for delete to authenticated
using (public.mha_is_admin(auth.uid()) and collection <> 'profiles');

-- Allows a newly registered email to submit a pending request even when email
-- confirmation is enabled and Supabase has not issued a client session yet.
create or replace function public.mha_create_profile_request(
  p_user_id uuid,
  p_email text,
  p_requested_role text default 'booker'
)
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  if p_requested_role not in ('booker','admin') then
    raise exception 'Invalid requested role';
  end if;
  if not exists (
    select 1 from auth.users u
    where u.id=p_user_id and lower(u.email)=lower(p_email)
  ) then
    raise exception 'Auth account was not found for this email';
  end if;
  insert into public.mha_documents(collection,id,data,updated_at)
  values ('profiles',p_user_id::text,jsonb_build_object(
    'role','booker','requestedRole',p_requested_role,'status','pending',
    'email',lower(p_email),'displayName',split_part(lower(p_email),'@',1),
    'createdAt',now()
  ),now())
  on conflict (collection,id) do update
    set data=excluded.data, updated_at=now()
    where public.mha_documents.data->>'status'='pending';
end;
$$;
grant execute on function public.mha_create_profile_request(uuid,text,text) to anon, authenticated;
