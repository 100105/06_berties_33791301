# Insert data into the tables

USE berties_books;

INSERT INTO books (name, price)VALUES('Brighton Rock', 20.25),('Brave New World', 25.00), ('Animal Farm', 12.99) ;
INSERT INTO users (username, first, last, email, hashedPassword) VALUES 
('gold', 'Gold', 'Ring', 'gold@smiths.com','$2b$10$2uYUJBPiUhamxa8tUTdXPeXkzFInx8FQ7gq6w53VBCPqqlZ9G9lK6');
