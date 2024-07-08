
import dataset

# connecting to a PostgreSQL database with user and password
db = dataset.connect('postgresql://postgres:postgres@localhost:5432/dskacc')

print(db.tables)

