import fs from "fs";
import csv from "csv-parser";
import {MongoClient} from "mongodb";

const mongoURI =
    "mongodb+srv://excursionAdmin:lwNoE9p2l2HqFiDD@excursionclub.qrp6cqm.mongodb.net/?retryWrites=true&w=majority"; // Replace with your MongoDB URI
const collectionName = "members"; // Replace with the name of your collection
const csvFilePath = "928 members - smartwaiver-185237-6524f5f481b24.csv"; // Replace with the path to your CSV file

async function addMembersFromCSV() {
    const client = new MongoClient(mongoURI);

    try {
        await client.connect();

        const db = client.db("excursionDB");
        const collection = db.collection(collectionName);

        const membersToAdd = [];
        const existingMembers = [];

        fs.createReadStream(csvFilePath)
            .pipe(csv())
            .on("data", (data) => {
                const member = {
                    name: data.name.trim().toLowerCase(),
                    email: data.email.trim().toLowerCase(),
                    phone_number: data.phone_number || null
                };

                // Check if a member with the same name, email, or phone number already exists
                const existingMember = existingMembers.find(
                    (existing) =>
                        existing.name === member.name ||
                        existing.email === member.email ||
                        existing.phone_number === member.phone_number
                );

                if (existingMember) {
                    // Output the existing member's data
                    console.log("Member already exists:", existingMember);
                } else {
                    // Add the member to the list of members to insert
                    membersToAdd.push({
                        ...member,
                        membership_duration: parseInt(data.membership_duration),
                        signed_up_by: data.signed_up_by,
                        is_new_member: data.is_new_member === "TRUE",
                        membership_expiration_date: parseInt(data.membership_expiration_date),
                        notes: data.notes || null,
                        join_datetime: parseInt(data.join_datetime),
                        local_living_address: data.local_living_address || null
                    });

                    // Add the member to the list of existing members
                    existingMembers.push(member);
                }
            })
            .on("end", async () => {
                if (membersToAdd.length === 0) {
                    console.log("No members to add from the CSV.");
                    return;
                }

                // Insert members into the MongoDB collection
                const result = await collection.insertMany(membersToAdd);
                console.log(`Added ${result.insertedCount} new members to the MongoDB collection.`);

                // Close the MongoDB connection
                await client.close();
            });
    } catch (err) {
        console.error("Error:", err);
        client.close();
    }
}

addMembersFromCSV();
