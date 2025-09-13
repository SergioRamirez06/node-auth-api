import mongoose from 'mongoose';
import { AppRoutes } from './presentation/routes';
import { Server } from './presentation/server';
import { MongoDatabase } from './data';
import { envs } from './config';


(async()=> {
  main();
})();


async function main() {

  await MongoDatabase.connect({
    mongoUrl: envs.MONGO_URL,
    dbName: envs.MONGO_DB_NAME
  })
  
  const server = new Server({
    port: envs.PORT,
    routes: AppRoutes.routes,
  });

  server.start();
}