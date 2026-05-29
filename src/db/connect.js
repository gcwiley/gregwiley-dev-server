import mongoose from 'mongoose';
import chalk from 'chalk';

// -- event listeners ---
mongoose.connection.on('connected', () => {
  // dynamically retrieve the DB name from mongoose connection properties
  const dbName = mongoose.connection.name || 'MongoDB';
  console.log(chalk.green(`Mongoose connected to database: ${dbName}`));
});

// Listen for Mongoose connection errors and log them with chalk for visibility
mongoose.connection.on('error', (error) => {
  console.error(chalk.red(`Mongoose connection error: ${error}`));
});

// Listen for Mongoose disconnection events and log them with chalk for visibility
mongoose.connection.on('disconnected', () => {
  console.warn(chalk.yellow('Mongoose disconnected'));
});

// --- main connect function ---
async function connect() {
  const uri = process.env.MONGO_CONNECTION_STRING;
  const dbName = process.env.DATABASE_NAME;

  if (!uri) {
    throw new Error(
      'MONGO_CONNECTION_STRING is not defined in the environment variables.',
    );
  }
  if (!dbName) {
    throw new Error(
      'DATABASE_NAME is not defined in the environment variables.',
    );
  }

  // Enable strict query mode to enforce schema validation on queries, improving data integrity and security
  mongoose.set('strictQuery', true);

  // Establish connection with timeout configurations for production resilience
  const options = {
    dbName,
    connectTimeoutMS: 10000, // give up initial connection after 10s
    socketTimeoutMS: 45000, // close inactive sockets after 45s
    autoIndex: process.env.NODE_ENV !== 'production',
  };

  await mongoose.connect(uri, options);

  console.log(
    chalk.blue(
      '\n',
      `Successfully connected to the NoSQL database - ${dbName}.`,
      '\n',
    ),
  );
}

// --- Disconnect Function
async function disconnect() {
  await mongoose.connection.close();
  console.log(chalk.blue('Mongoose connection closed.'));
}

export { connect, disconnect };
