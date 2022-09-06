import { MongoClient } from 'mongodb';
import nextConnect from 'next-connect';

async function database(req, res, next) {
  const client = new MongoClient(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  if (!client.isConnected) await client.connect();
  req.dbClient = client;
  req.db = client.db(process.env.DB_NAME);
  return next();
}

const middleware = nextConnect();

middleware.use(database);

export default middleware;