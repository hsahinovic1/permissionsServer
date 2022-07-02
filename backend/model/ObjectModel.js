import Sequelize from "sequelize";
import sequelize from "../config/database.js";

const Object = sequelize.define("object", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  }
});
export default Object