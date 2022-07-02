import Sequelize from "sequelize";
import sequelize from "../config/database.js";

const Group = sequelize.define("group", {
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
export default Group