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
  if x->>'id' not in ('golf-advanced','golf-basic','genially-learning-unit','genially-questions') then raise exception 'Unsupported course'; end if;
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
