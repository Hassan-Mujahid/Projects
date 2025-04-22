import clientPromise from "../lib/mongodb";

export async function getUserFromDb(email, pwHash) {
  const client = await clientPromise;
  const db = client.db("news-website-nextjs");

  const user = await db.collection("users").findOne({
    email: email,
    password: pwHash,
  });

  return user;
}

export async function createUser(username, email, pwHash) {
  const client = await clientPromise;
  const db = client.db("news-website-nextjs");

  const result = await db.collection("users").insertOne({
    username: username,
    email: email,
    password: pwHash,
  });

  return result.insertedId;
}
