\c losesono

create or replace function insert_time_stamp() returns trigger as $$
begin

        new.created_date  := current_timestamp;
        new.modified_date := current_timestamp;
        new.created_by    := current_user;
        new.modified_by   := current_user;

        return new;
end;
$$ language plpgsql;

create or replace function update_time_stamp() returns trigger as $$
begin

        new.modified_date := current_timestamp;
        new.modified_by   := current_user;

        return new;
end;
$$ language plpgsql;


create trigger insert_users_stamp before insert on users
    for each row execute procedure insert_time_stamp();

create trigger update_users_stamp before update on users
    for each row execute procedure update_time_stamp();


create trigger insert_users_stamp before insert on users_private
    for each row execute procedure insert_time_stamp();

create trigger update_users_stamp before update on users_private
    for each row execute procedure update_time_stamp();


create trigger insert_users_stamp before insert on users_hash
    for each row execute procedure insert_time_stamp();

create trigger update_users_stamp before update on users_hash
    for each row execute procedure update_time_stamp();


create trigger insert_users_stamp before insert on friends
    for each row execute procedure insert_time_stamp();

create trigger update_users_stamp before update on friends
    for each row execute procedure update_time_stamp();


create trigger insert_users_stamp before insert on messages
    for each row execute procedure insert_time_stamp();

create trigger update_users_stamp before update on messages
    for each row execute procedure update_time_stamp();


create trigger insert_users_stamp before insert on message_friend_group
    for each row execute procedure insert_time_stamp();

create trigger update_users_stamp before update on message_friend_group
    for each row execute procedure update_time_stamp();