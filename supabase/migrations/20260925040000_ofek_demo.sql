-- TES-59: isolated authenticated demo workspace; no changes to existing application tables.
create table if not exists public.ofek_demo_workspaces (
 owner_id uuid primary key references auth.users(id) on delete cascade,
 config jsonb not null default '{}'::jsonb,
 updated_at timestamptz not null default now()
);
create table if not exists public.ofek_demo_courses (
 owner_id uuid not null references auth.users(id) on delete cascade,
 id text not null, title text not null, metadata jsonb not null,
 primary key(owner_id,id)
);
create table if not exists public.ofek_demo_assignments (
 owner_id uuid not null references auth.users(id) on delete cascade,
 id uuid not null, course_id text not null, student_id text not null,
 payload jsonb not null, primary key(owner_id,id),
 foreign key(owner_id,course_id) references public.ofek_demo_courses(owner_id,id) on delete cascade
);
create table if not exists public.ofek_demo_attempts (
 owner_id uuid not null references auth.users(id) on delete cascade,
 id uuid not null, course_id text not null, student_id text not null,
 cmi jsonb not null default '{}'::jsonb, payload jsonb not null,
 updated_at timestamptz not null default now(), primary key(owner_id,id),
 foreign key(owner_id,course_id) references public.ofek_demo_courses(owner_id,id) on delete cascade
);
alter table public.ofek_demo_workspaces enable row level security;
alter table public.ofek_demo_courses enable row level security;
alter table public.ofek_demo_assignments enable row level security;
alter table public.ofek_demo_attempts enable row level security;
do $$ declare t text; begin foreach t in array array['ofek_demo_workspaces','ofek_demo_courses','ofek_demo_assignments','ofek_demo_attempts'] loop
 execute format('create policy "owner_access" on public.%I for all to authenticated using (owner_id = (select auth.uid())) with check (owner_id = (select auth.uid()))',t);
 execute format('grant select, insert, update, delete on public.%I to authenticated',t);
 execute format('revoke all on public.%I from anon',t);
end loop; end $$;
create or replace function public.ofek_demo_save(p_state jsonb) returns jsonb
language plpgsql security invoker set search_path = public as $$
declare u uuid := auth.uid(); x jsonb; begin
 if u is null then raise exception 'Authentication required'; end if;
 if jsonb_typeof(p_state) <> 'object' or jsonb_typeof(p_state->'courses') <> 'array' or jsonb_typeof(p_state->'assignments') <> 'array' or jsonb_typeof(p_state->'attempts') <> 'array' then raise exception 'Invalid state'; end if;
 if jsonb_array_length(p_state->'courses') > 20 or jsonb_array_length(p_state->'attempts') > 100 or jsonb_array_length(p_state->'assignments') > 100 then raise exception 'Demo limits exceeded'; end if;
 insert into ofek_demo_workspaces(owner_id,config,updated_at) values(u,p_state-'courses'-'assignments'-'attempts',now()) on conflict(owner_id) do update set config=excluded.config,updated_at=now();
 delete from ofek_demo_assignments where owner_id=u;
 delete from ofek_demo_attempts where owner_id=u;
 delete from ofek_demo_courses where owner_id=u;
 for x in select * from jsonb_array_elements(p_state->'courses') loop
  if x->>'id' not in ('golf-advanced','golf-basic') then raise exception 'Unsupported course'; end if;
  insert into ofek_demo_courses values(u,x->>'id',x->>'title',x);
 end loop;
 for x in select * from jsonb_array_elements(p_state->'assignments') loop
  insert into ofek_demo_assignments values(u,(x->>'id')::uuid,x->>'courseId',x->>'userId',x);
 end loop;
 for x in select * from jsonb_array_elements(p_state->'attempts') loop
  insert into ofek_demo_attempts values(u,(x->>'id')::uuid,x->>'courseId',x->>'userId',x->'data',x,now());
 end loop;
 return jsonb_build_object('saved',true,'at',now());
end $$;
revoke all on function public.ofek_demo_save(jsonb) from public, anon;
grant execute on function public.ofek_demo_save(jsonb) to authenticated;
