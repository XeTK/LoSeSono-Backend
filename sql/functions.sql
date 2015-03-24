\c losesono

create extension pgcrypto;

create or replace function insert_time_stamp() returns trigger 
as 
  $$
begin

  new.created_date  := current_timestamp;
  new.modified_date := current_timestamp;
  new.created_by    := current_user;
  new.modified_by   := current_user;

  return new;
end;
$$ language plpgsql;

create or replace function update_time_stamp() returns trigger 
as 
  $$
begin

  new.modified_date := current_timestamp;
  new.modified_by   := current_user;

  return new;
end;
$$ language plpgsql;

/* Taken from http://stackoverflow.com/a/28573007 */
create or replace function jsoninsert(relname text, reljson text) returns record 
as
  $body$declare
  ret record;
  inputstring text;
begin

  select string_agg(quote_ident(key),',') 
  into   inputstring
  from   json_object_keys(reljson::json) as x (key);

  execute 'insert into '|| quote_ident(relname) 
    || '(' || inputstring || ') select ' ||  inputstring 
    || ' from json_populate_record( null::' || quote_ident(relname) || ' , json_in($1)) returning *'
    into ret using reljson::cstring;

  return ret;
end;
$body$
language plpgsql volatile;

create or replace function insert_user(
  e_firstname text,
  e_lastname  text,
  e_username  text, 
  e_email     text, 
  e_password  text
) 
returns text as
  $body$declare

  l_count      int;
  l_user_id    int;
  l_ret        text;
  l_salt       text;
  l_hashed_pwd text;
  l_enc_pwd    text;
begin

  select count(*)
  into   l_count
  from   users
  where  username = e_username;

  if l_count = 0 then
    
    select count(*)
    into   l_count
    from   users_private
    where  email = lower(e_email);

    if l_count = 0 then 

      insert into users (
        first_name,
        last_name,
        username
      ) values (
        e_firstname,
        e_lastname,
        e_username
      );

      select user_id
      into   l_user_id
      from   users u
      where  u.first_name = e_firstname
      and    u.last_name  = e_lastname
      and    u.username   = e_username;

      insert into users_private (
        user_id,
        email
      ) values (
        l_user_id,
        e_email
      );

      select gen_salt('bf'::text)
      into   l_salt;

      select md5(e_password::text)
      into   l_hashed_pwd;
      
      select crypt(l_hashed_pwd, l_salt)
      into   l_enc_pwd;

      insert into users_hash (
        user_id,
        salt,
        hashed_password
      ) values (
        l_user_id,
        l_salt,
        l_enc_pwd
      );

      return 'New user created!';

    else 
      return 'Email already in use';
    end if;

  else
    return 'Username Taken';
  end if;

end;
$body$
language plpgsql volatile;

create or replace function valid_password(
  e_username  text, 
  e_password  text
) 
returns boolean as
  $body$declare

  l_count        int;
  l_ret          text;
  l_salt         text;
  l_hashed_pwd   text;
  l_enc_pwd      text;
  l_comp_enc_pwd text;
begin

  select count(*)
  into   l_count
  from   users
  where  username = e_username;

  if l_count > 0 then
    
      select uh.salt,
             uh.hashed_password
      into   l_salt,
             l_enc_pwd
      from   users u,
             users_hash uh
      where  u.username = e_username
      and    u.user_id  = uh.user_id;

      select md5(e_password::text)
      into   l_hashed_pwd;
      
      select crypt(l_hashed_pwd, l_salt)
      into   l_comp_enc_pwd;

      if l_enc_pwd = l_comp_enc_pwd then
        return true;
      else
        return false;
      end if;
  else
    return false;
  end if;

end;
$body$
language plpgsql volatile;

create or replace function add_friend(
  e_user_id   int, 
  e_friend_id int
) 
returns boolean as
  $body$declare

  l_count int;
begin

  if e_user_id = e_friend_id then
    return false;
  end if;

  select count(*)
  into   l_count
  from   friends
  where  user_id        = e_user_id
  and    friend_user_id = e_friend_id
  and    end_date is null;

  if l_count = 0 then

    insert into friends
    (
      user_id,
      friend_user_id,
      start_date
    )
    values
    (
      e_user_id,
      e_friend_id,
      current_date
    );

    select count(*)
    into   l_count
    from   friends
    where  user_id        = e_user_id
    and    friend_user_id = e_friend_id
    and    end_date is null;

    if l_count = 1 then
      /*commit;*/
      return true;
    else
      /*rollback;*/
      return false;
    end if;
    
  else
    return false;
  end if;

end;
$body$
language plpgsql volatile;
