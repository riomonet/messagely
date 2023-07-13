\c messagely

DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS users;


CREATE TABLE users (
    username text PRIMARY KEY,
    password text NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    phone text NOT NULL,
    join_at timestamp without time zone,
    last_login_at timestamp with time zone
);

CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    from_username text NOT NULL REFERENCES users,
    to_username text NOT NULL REFERENCES users,
    body text NOT NULL,
    sent_at timestamp with time zone,
    read_at timestamp with time zone
);


INSERT INTO users
     (username, password, first_name, last_name, phone, join_at, last_login_at)
     VALUES('ari', 'ari', 'ari', 'zablozki','222-222-2222','2023-07-12 16:24:43.153023-04','2023-07-12 16:24:43.153023-04');



INSERT INTO users 
     (username,password, first_name, last_name, phone)
     VALUES('ali', 'ali', 'ali', 'zablozki','333-333-3333');


INSERT INTO users 
     (username,password, first_name, last_name, phone)
     VALUES('jonah', 'jonah', 'jonah', 'zablozki','444-444-4444');


INSERT INTO messages 
      (from_username, to_username, body)
      VALUES ('ari','ali','Hi babe how are you');



INSERT INTO messages 
      (from_username, to_username, body)
      VALUES ('ari','jonah','I hope you are having a good time in camp!');


