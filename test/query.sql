CREATE TABLE users(
id int auto_increment primary KEY,
username varchar(255),
email varchar(255),
pword varchar(255),
fname varchar(255),
lname varchar(255),
location varchar(255),
token_id varchar(255)
);

create table items(
id int auto_increment primary KEY,
user_id int,
price decimal(10,2),
imageurl varchar(255),
category varchar(255),
conditn varchar(255),
story varchar(255),
shipping varchar(255),
payment varchar(255),
foreign key(user_id) references users(id)
);

create table messages(
user_id int,
item_id int,
content varchar(255),
foreign key(user_id) references users(id),
foreign key(item_id) references items(id)
);

create table likes(
user_id int,
item_id int,
foreign key(user_id) references users(id),
foreign key(item_id) references items(id)
);