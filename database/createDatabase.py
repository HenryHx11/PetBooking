import sqlite3
db = sqlite3.connect('db.sqlite')

db.execute('''CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    email TEXT NOT NULL,
    password TEXT NOT NULL
)''') #users table, email might be login method or username

#bookId use a random function to generate id with preset format
#bookDateEnd not necessary for other services except pet hotel
db.execute('''CREATE TABLE IF NOT EXISTS bookingDetails (
            bookId TEXT PRIMARY KEY, 
            userId INTEGER NOT NULL,
            bookDesc TEXT NOT NULL,
            bookDateStart DATE NOT NULL,
            bookDateEnd DATE,
            time TIME NOT NULL
)''')

db.execute ('''CREATE TABLE IF NOT EXISTS bookings (
            bookId TEXT NOT NULL,
            price INT
            )''')

cursor = db.cursor()

cursor.execute('''Insert into users (username, email, password) values ("John Example", "johne@gmail.com", "123345")''')

db.commit()
db.close()