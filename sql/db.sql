/* This script creates all the tables needed for the application to work. */

\c losesono

/* Drop all the tables so we can recreate them. */
drop table message_votes;
drop table comments_votes;
drop table vote_type;
drop table comments;
drop table read_messages;
drop table message_friend_group;
drop table messages;
drop table range;
drop table friends;
drop table users_hash;
drop table users_private;
drop table users;

/* The next few statements create the tables needed for the application. */

create table users (
	user_id       serial       primary key,
	first_name    varchar(32)  not null,
	last_name     varchar(32)  not null,
	username      varchar(16)  not null unique,
	created_date  timestamp,
	modified_date timestamp,
	created_by    varchar(100),
	modified_by   varchar(100)
);

create table users_private (
	priv_id       serial       primary key,
	user_id       integer      not null references users(user_id),
	email         varchar(100) not null,
	facebook_id   varchar(64),
	created_date  timestamp,
	modified_date timestamp,
	created_by    varchar(100),
	modified_by   varchar(100)
);

create table users_hash (
	hash_id              serial       primary key,
	user_id              integer      not null references users(user_id),
	salt                 varchar(512) not null,
	hashed_password      varchar(512) not null,
	created_date         timestamp,
	modified_date        timestamp,
	created_by           varchar(100),
	modified_by          varchar(100)
);

create table friends (
	friends_id     serial       primary key,
	user_id        integer      not null references users(user_id),
	friend_user_id integer      not null references users(user_id),
	start_date     date         not null,
	end_date       date,
	created_date   timestamp,
	modified_date  timestamp,
	created_by     varchar(100),
	modified_by    varchar(100),
	unique (user_id, friend_user_id)
);

create table range (
	range   integer primary key,
	enabled boolean not null
);

create table messages (
	message_id     serial       primary key, 
	user_id        integer      not null references users(user_id),
	private        boolean      not null,
	content        varchar(144) not null,
	longitude      real         not null,
	latitude       real         not null,
	range          integer      not null references range(range) check(range > 0),
	created_date   timestamp,
	modified_date  timestamp,
	created_by     varchar(100),
	modified_by    varchar(100)
);

create table message_friend_group (
	group_id      serial       primary key,
	message_id    integer      not null references messages(message_id),
	friends_id    integer      not null references friends(friends_id),
	created_date  timestamp,
	modified_date timestamp,
	created_by    varchar(100),
	modified_by   varchar(100),
	unique (message_id, friends_id)
);

create table read_messages (
	read_id       serial        primary key,
	message_id    integer       not null references messages(message_id),
	user_id       integer       not null references users(user_id),
	created_date  timestamp,
	modified_date timestamp,
	created_by    varchar(100),
	modified_by   varchar(100),
	unique (message_id, user_id)
);

create table comments (
	comment_id    serial       primary key,
	message_id    integer      not null references messages(message_id),
	user_id       integer      not null references users(user_id),
	content       varchar(144) not null,
	created_date  timestamp,
	modified_date timestamp,
	created_by    varchar(100),
	modified_by   varchar(100)
);

create table vote_type (
	type    varchar(20) primary key,
	effect  integer     not null,
	enabled boolean     not null
);

create table comments_votes (
	comment_vote_id serial      primary key,
	comment_id      integer     not null references comments(comment_id),
	user_id         integer     not null references users(user_id),
	vote_type       varchar(20) not null references vote_type(type),
	created_date    timestamp,
	modified_date   timestamp,
	created_by      varchar(100),
	modified_by     varchar(100)
);

create table message_votes (
	message_vote_id serial      primary key,
	message_id      integer     not null references messages(message_id),
	user_id         integer     not null references users(user_id),
	vote_type       varchar(20) not null references vote_type(type),
	created_date    timestamp,
	modified_date   timestamp,
	created_by      varchar(100),
	modified_by     varchar(100)
);

