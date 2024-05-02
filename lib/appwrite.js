import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
} from "react-native-appwrite";

export const config = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.alexa.aora",
  projectId: "662e056300000dd47be4",
  databaseId: "662e395600302bc03439",
  userCollectionId: "662e39c9003c36d4900e",
  videoCollectionId: "662e3a2a0022b65d3744",
  storageId: "662e3d870034bd3a8ae3",
};

// Init your react-native SDK
const client = new Client();

client
  .setEndpoint(config.endpoint) // Your Appwrite Endpoint
  .setProject(config.projectId) // Your project ID
  .setPlatform(config.platform); // Your application ID or bundle ID.

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
// Register User

export async function createUser(email, password, username) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );

    if (!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(username);
    console.log("newAccount", newAccount);
    await signIn((type = "signup"), email, password);
    const newUser = await databases.createDocument(
      config.databaseId,
      config.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email: email,
        username: username,
        avatar: avatarUrl,
      }
    );

    return newUser;
  } catch (error) {
    throw new Error(error);
  }
}

// Sign In
export async function signIn(type, email, password) {
  console.log(email, password);
  // Assuming this retrieves current session details
  // console.log("currentSession", currentSession);
  // if (currentSession) {
  //   // If there is an existing session, log out the user
  //   await account.deleteSession(currentSession.$id); // Assuming this deletes the existing session
  // }
  try {
    if (type === "signup") {
      const session = await account.createEmailSession(email, password);
      console.log("session", session);
      return session;
    } else {
      const currentSession = await account.get();
      return currentSession;
    }
  } catch (error) {
    throw new Error(error);
  }
}

//Get Account
export async function getAccount() {
  try {
    const currentAccount = await account.get();

    return currentAccount;
  } catch (error) {
    throw new Error(error);
  }
}
// Get Current User
export async function getCurrentUser() {
  try {
    const currentAccount = await getAccount();
    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      config.databaseId,
      config.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
    return null;
  }
}

//Get All Posts
export async function getAllPosts() {
  try {
    const posts = await databases.listDocuments(
      config.databaseId,
      config.videoCollectionId
    );
    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
}
