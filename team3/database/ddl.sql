CREATE TABLE Users(
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL
);
CREATE TABLE Tasks(
    task_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(5000),
    location VARCHAR(255),
    meeting_url VARCHAR(255),

    FOREIGN KEY (user_id) REFERENCES Users (id) ON DELETE CASCADE
);