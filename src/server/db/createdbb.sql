DROP DATABASE IF EXISTS basilisk;
DROP USER IF EXISTS basiliskadmin;
DROP TABLE IF EXISTS users, devices;

\set dbpass `echo "$DB_PASS"`

CREATE DATABASE basilisk;
CREATE USER basiliskadmin WITH ENCRYPTED PASSWORD dbpass;
GRANT ALL PRIVILEGES ON DATABASE basilisk TO basiliskadmin;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    firstname TEXT NOT NULL,
    lastname TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
);

CREATE TABLE devices (
    id SERIAL PRIMARY KEY,
    devicename TEXT NOT NULL,
    devicepass TEXT NOT NULL,
    is_enabled BOOLEAN NOT NULL,
    is_alert BOOLEAN NOT NULL,
    is_alarm BOOLEAN NOT NULL,
    owner_id INT NOT NULL,
    FOREIGN KEY(owner_id) REFERENCES users(id)
);
