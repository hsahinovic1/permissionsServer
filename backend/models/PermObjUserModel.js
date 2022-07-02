import Sequelize from "sequelize";
import sequelize from "../config/database.js";

const PermObjUser = sequelize.define("user_permissions", {
    user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        foreignKey: true,
      },
    permission_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        foreignKey: true,
      },
    object_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        foreignKey: true,
      }
});
export default PermObjUser