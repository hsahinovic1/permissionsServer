import Sequelize from "sequelize";
import sequelize from "../config/database.js";

const Permission = sequelize.define("permission", {
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
export default Permission