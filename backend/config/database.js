import Sequelize from "sequelize";
import dotenv from "dotenv";
import pg from "pg"
dotenv.config();

pg.defaults.ssl = true;

const sequelize = new Sequelize(process.env.POSTGRES_URL, {
  dialect: "postgres",
  dialectOptions: {
    ssl: true,
    rejectUnauthorized: false
  }
});

export default sequelize;