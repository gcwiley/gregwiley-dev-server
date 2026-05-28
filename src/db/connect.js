import mongoose from 'mongoose';
import chalk from 'chalk';

// -- Event Listeners ---
mongoose.connection.on('connected', () => {
  // dynamically retrieve the DB name from mongoose connection properties
  const dbName = mongoose.connection.name || 'MongoDB';
  console.log(chalk.green(`Mongoose connected to database: ${dbName}`));
});

mongoose.connection.on('error', (error) => {
  console.error(chalk.red(`Mongoose connection error: ${error}`));
});

mongoose.connection.on('disconnected', () => {
  console.warn(chalk.yellow('Mongoose disconnected'));
});

// --- Main Connect Function ---
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

  // Set Mongoose options
  mongoose.set('strictQuery', true);

  // Establish connection with timeout configurations for production resilience
  const options = {
    dbName,
    connectTimeoutMS: 10000, // give up initial connection after 10s
    socketTimeoutMS: 45000, // close inactive sockets after 45s
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
