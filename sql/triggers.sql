/* Tie all of the tables to the triggers they need. */

\c losesono

create trigger insert_stamp before insert on users
    for each row execute procedure insert_time_stamp();

create trigger update_stamp before update on users
    for each row execute procedure update_time_stamp();


create trigger insert_stamp before insert on users_private
    for each row execute procedure insert_time_stamp();

create trigger update_stamp before update on users_private
    for each row execute procedure update_time_stamp();


create trigger insert_stamp before insert on users_hash
    for each row execute procedure insert_time_stamp();

create trigger update_stamp before update on users_hash
    for each row execute procedure update_time_stamp();


create trigger insert_stamp before insert on friends
    for each row execute procedure insert_time_stamp();

create trigger update_stamp before update on friends
    for each row execute procedure update_time_stamp();


create trigger insert_stamp before insert on messages
    for each row execute procedure insert_time_stamp();

create trigger update_stamp before update on messages
    for each row execute procedure update_time_stamp();


create trigger insert_stamp before insert on message_friend_group
    for each row execute procedure insert_time_stamp();

create trigger update_stamp before update on message_friend_group
    for each row execute procedure update_time_stamp();


create trigger insert_stamp before insert on comments
    for each row execute procedure insert_time_stamp();

create trigger update_stamp before update on comments
    for each row execute procedure update_time_stamp();


create trigger insert_stamp before insert on comments_votes
    for each row execute procedure insert_time_stamp();

create trigger update_stamp before update on comments_votes
    for each row execute procedure update_time_stamp();


create trigger insert_stamp before insert on message_votes
    for each row execute procedure insert_time_stamp();

create trigger update_stamp before update on message_votes
    for each row execute procedure update_time_stamp();
