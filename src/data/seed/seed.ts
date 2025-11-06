import { envs } from "../../config";
import { MongoDatabase } from "../mongo/mongo-database";
import { UserModel } from '../mongo/models/user-model';
import { CategoryModel } from "../mongo/models/category-model";
import { ProductModel } from "../mongo/models/product-model";
import { seedData } from "./data";

(async () => {
  await MongoDatabase.connect({
    mongoUrl: envs.MONGO_URL,
    dbName: envs.MONGO_DB_NAME
  });

  await main();

  await MongoDatabase.disconnect();
})();

const ramdonBetween0AndX = ( x: number ) => {
  return Math.floor( Math.random() * x )
}

async function main() {

  // 0. eliminar datos anteriores
  await Promise.all([
    UserModel.deleteMany(),
    CategoryModel.deleteMany(),
    ProductModel.deleteMany(),
  ]);

  // 1. crear usuarios y guardarlos
  const users = await UserModel.insertMany(seedData.users);

  // 2. crear categorías asociadas al primer usuario
  const categories = await CategoryModel.insertMany(
    seedData.categories.map(category => ({
      ...category,
      user: users[0]._id, // aquí sí existe
    }))
  );

  // 3. crear productos 

  const product = await ProductModel.insertMany(
    seedData.products.map( product => {

      return{
        ...product,
        user: users[ ramdonBetween0AndX( seedData.users.length -1 )  ]._id,
        category: categories[ ramdonBetween0AndX( seedData.users.length - 1 ) ]._id,
      }
    })
  )

  console.log('✅ SEED completado con éxito');
}
