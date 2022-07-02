import Sequelize from "sequelize";
import sequelize from "../config/database.js";

const PermObjGroup = sequelize.define("group_permissions", {
    group_id: {
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
export default PermObjGroup