import mongoose from 'mongoose';

/**
 * The function creates a MongoDB connection using the provided MongoDB URI and
 * returns the connection object or an error object if the connection fails.
 * @returns a connection object if the connection to MongoDB is successful. If
 * there is an error connecting to MongoDB, it returns an error object with
 * properties such as `error`, `isError`, `statusCode`, and `data`.
 */
export async function createMongoDBConnection() {
  const mongoDbUri = String(process.env.MONGODB_URI);
  try {
    const connection = await mongoose.connect(mongoDbUri);
    return connection;
  } catch (error) {
    console.log('Failed connecting to mongoDb', error);
    return {
      error: error,
      isError: true,
      statusCode: 500,
      data: [],
    };
  }
}
