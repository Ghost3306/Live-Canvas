from pymongo import MongoClient


MONGO_URI = "mongodb://localhost:27017/"

def create_collection(db_name, collection_name):
    """Create a collection (like a table) in MongoDB if it doesn't already exist."""
    client = MongoClient(MONGO_URI)
    db = client[db_name]

    if collection_name not in db.list_collection_names():
        db.create_collection(collection_name)
        print(f"Collection '{collection_name}' created successfully in database '{db_name}'.")
        return True
    else:
        print(f"Collection '{collection_name}' already exists in database '{db_name}'.")
        return False

    client.close()

def insert_data(db_name, collection_name, data):
    """Insert data (dict or list of dicts) into the specified MongoDB collection."""
    client = MongoClient(MONGO_URI)
    db = client[db_name]
    collection = db[collection_name]

    if isinstance(data, list):
        result = collection.insert_many(data)
        print(f"Inserted {len(result.inserted_ids)} documents into '{collection_name}'.")
    elif isinstance(data, dict):
        result = collection.insert_one(data)
        print(f"Inserted document with ID: {result.inserted_id}")
    else:
        print("Data must be a dictionary or list of dictionaries.")
    
    client.close()

def get_room_data(db_name, collection_name):
    """Fetch all past strokes for a room"""
    client = MongoClient(MONGO_URI)
    db = client[db_name]
    collection = db[collection_name]
    return list(collection.find({}))

# Example usage with user input
if __name__ == "__main__":
    db_name = "test-canvas"
    collection_name = input("Enter collection name: ").strip()

    create_collection(db_name, collection_name)

    # Insert sample data (you can modify this)
    sample_data = {
        "name": input("Enter name: ").strip(),
        "project": input("Enter project name: ").strip(),
        "year": int(input("Enter year: ").strip())
    }
    insert_data(db_name, collection_name, sample_data)
