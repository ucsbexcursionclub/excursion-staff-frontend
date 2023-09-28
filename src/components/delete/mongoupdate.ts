const { MongoClient } = require("mongodb");

// Create a MongoDB client and connect to the database
const uri =
  process.env.MONGODB_API_KEY ||
  "mongodb+srv://excursionAdmin:lwNoE9p2l2HqFiDD@excursionclub.qrp6cqm.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);

async function updateMembers() {
  try {
    // Connect to the MongoDB database
    await client.connect();

    // Get a reference to the "members" collection
    const membersCollection = client.db("excursionDB").collection("members");

    // Define an aggregation pipeline to update names and emails to lowercase
    const pipeline = [
      {
        $addFields: {
          name_lowercase: { $toLower: "$name" },
          email_lowercase: { $toLower: "$email" },
        },
      },
      {
        $project: {
          name: 0, // Exclude the original 'name' field
          email: 0, // Exclude the original 'email' field
        },
      },
      {
        $merge: "members", // Overwrite the existing collection with the updated data
      },
    ];

    // Execute the aggregation pipeline
    await membersCollection.aggregate(pipeline).toArray();

    console.log("Updated names and emails to lowercase");

  } catch (error) {
    console.error("Error updating members:", error);
  } finally {
    // Close the MongoDB client connection
    await client.close();
  }
}

// Call the updateMembers function to update the collection
updateMembers();
