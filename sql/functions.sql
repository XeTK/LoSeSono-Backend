/* 
 * This file defines the functions that are used within the database.
 */

\c losesono

/* Enable Postgres to use encryption. */
create extension pgcrypto;

/* This adds timestamps to rows when they are inserted into the database adding to our traceability. */
create or replace function insert_time_stamp() returns trigger 
as 
  $$
begin

  /* Set the columns to the desired values. */
  new.created_date  := current_timestamp;
  new.modified_date := current_timestamp;
  new.created_by    := current_user;
  new.modified_by   := current_user;

  return new;
end;
$$ language plpgsql;

/* This function is run when a record is updated and it will update the last modified time and user with the user that updated the record. */
create or replace function update_time_stamp() returns trigger 
as 
  $$
begin

  new.modified_date := current_timestamp;
  new.modified_by   := current_user;

  return new;
end;
$$ language plpgsql;


/*
 * This is a method taken from Stack Overflow, it converts JSON objects directly into records within tables and inserts them into the table.
 * Taken from http://stackoverflow.com/a/28573007 
 * All credit goes to user "beldaz".
 */
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

/* This method is used for creating and inserting a new user into the database. It contains all the validation needed to create a user. */
create or replace function insert_user(
  /* This is all the parameters needed to create a new user. */
  e_firstname text,
  e_lastname  text,
  e_username  text, 
  e_email     text, 
  e_password  text
) 
returns text as
  $body$declare

  /* Some variables we will need to make this all work. */
  l_count      int;
  l_user_id    int;
  l_ret        text;
  l_salt       text;
  l_hashed_pwd text;
  l_enc_pwd    text;
begin

  /* Check if there is already a user with the username we are trying to create. */
  select count(*)
  into   l_count
  from   users
  where  username = e_username;

  if l_count = 0 then

    /* Next we check if the email address they have given us is already in use. */
    
    select count(*)
    into   l_count
    from   users_private
    where  email = lower(e_email);

    if l_count = 0 then 

      /* If both of thoses clear then we can insert the first record to create a user. */

      insert into users (
        first_name,
        last_name,
        username
      ) values (
        e_firstname,
        e_lastname,
        e_username
      );

      /* Get the database user_id from the table we just inserted into. */

      select user_id
      into   l_user_id
      from   users u
      where  u.first_name = e_firstname
      and    u.last_name  = e_lastname
      and    u.username   = e_username;

      /* Insert some more sensitive data into the database into another table. */
      insert into users_private (
        user_id,
        email
      ) values (
        l_user_id,
        e_email
      );

      /* Protect the users password. */

      /* Generate some fresh salt to use with the pass. */
      select gen_salt('bf'::text)
      into   l_salt;

      /* Generate an MD5 of the password. */
      select md5(e_password::text)
      into   l_hashed_pwd;
      
      /* Encrypt the MD5 we just generated with the newly generated Salt, to generate an encrypted hash. */
      select crypt(l_hashed_pwd, l_salt)
      into   l_enc_pwd;

      /* Insert the credential details into the database, so we can access them later. */
      insert into users_hash (
        user_id,
        salt,
        hashed_password
      ) values (
        l_user_id,
        l_salt,
        l_enc_pwd
      );

      /* Return the state of the action we just carried out. */
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

/* This method validates the password and makes sure its correct. */
create or replace function valid_password(
  e_username  text, 
  e_password  text
) 
returns boolean as
  $body$declare

  /* Variables for later use. */
  l_count        int;
  l_salt         text;
  l_hashed_pwd   text;
  l_enc_pwd      text;
  l_comp_enc_pwd text;
begin

  /* Check if a user exists with the desired username. */
  select count(*)
  into   l_count
  from   users
  where  username = e_username;

  if l_count > 0 then
    
      /* Get the encrypted hashed password, and the salt. */
      select uh.salt,
             uh.hashed_password
      into   l_salt,
             l_enc_pwd
      from   users u,
             users_hash uh
      where  u.username = e_username
      and    u.user_id  = uh.user_id;

      /* MD5 the password we have passed in. */
      select md5(e_password::text)
      into   l_hashed_pwd;
      
      /* Encrypt the new hashed password with the stored salt. */
      select crypt(l_hashed_pwd, l_salt)
      into   l_comp_enc_pwd;

      /* If the passed in password matches the stored encrypted hashed password then it is the correct password. */
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

/* This method adds a link between friends into the application. */
create or replace function add_friend(
  e_user_id   int, 
  e_friend_id int
) 
returns boolean as
  $body$declare

  l_count int;
begin

  /* Check the usernames are not identical so a user isnt trying to add them selfs. */
  if e_user_id = e_friend_id then
    return false;
  end if;

  /* Check the users are not already friends. */
  select count(*)
  into   l_count
  from   friends
  where  user_id        = e_user_id
  and    friend_user_id = e_friend_id
  and    end_date is null;

  /* If they are not then we continue. */
  if l_count = 0 then

    /* Add the friendship into the application. */
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

    /* Check that the friendship has in fact been made. */
    select count(*)
    into   l_count
    from   friends
    where  user_id        = e_user_id
    and    friend_user_id = e_friend_id
    and    end_date is null;

    /* If it has then thats good. */
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
