\c losesono

grant all privileges on table users to application;
grant all privileges on table comments to application;
grant all privileges on table comments_votes to application;
grant all privileges on table friends to application;
grant all privileges on table message_friend_group to application;
grant all privileges on table message_votes to application;
grant all privileges on table messages to application;
grant all privileges on table range to application;
grant all privileges on table users to application;
grant all privileges on table users_hash to application;
grant all privileges on table users_private to application;
grant all privileges on table vote_type to application;
grant all privileges on table read_messages to application;


grant all on sequence users_user_id_seq to application;
grant all on sequence users_private_priv_id_seq to application;
grant all on sequence users_hash_hash_id_seq to application;
grant all on sequence friends_friends_id_seq to application;
grant all on sequence messages_message_id_seq to application;
grant all on sequence message_friend_group_group_id_seq to application;
grant all on sequence comments_comment_id_seq to application;
grant all on sequence comments_votes_comment_vote_id_seq to application;
grant all on sequence message_votes_message_vote_id_seq to application;
grant all on sequence read_messages_read_id_seq to application;

insert into range(range, enabled) values(10, true);
insert into range(range, enabled) values(100, true);
insert into range(range, enabled) values(1000, true);

//ALTER TABLE messages ALTER COLUMN message_id SET DEFAULT nextval('messages_message_id_seq'::regclass);