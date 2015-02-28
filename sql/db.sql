\c losesono

drop table message_friend_group;
drop table messages;
drop table range;
drop table friends;
drop table users_hash;
drop table users_private;
drop table users;

create table users (
	user_id       serial       primary key,
	first_name    varchar(32)  not null,
	last_name     varchar(32)  not null,
	username      varchar(16)  not null,
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
	hash_id       serial       primary key,
	user_id       integer      not null references users(user_id),
	salt          varchar(512) not null,
	encrypt_code  varchar(512) not null,
	password      varchar(768) not null,
	created_date  timestamp,
	modified_date timestamp,
	created_by    varchar(100),
	modified_by   varchar(100)
);

create table friends (
	friends_id     serial       primary key,
	user_id        integer      not null references users(user_id),
	friend_user_id integer      not null references users(user_id),
	start_date     date         not null check(start_date >= now()),
	end_date       date,
	created_date   timestamp,
	modified_date  timestamp,
	created_by     varchar(100),
	modified_by    varchar(100)
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
	modified_by   varchar(100)
);
