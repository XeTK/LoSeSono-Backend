\c losesono

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