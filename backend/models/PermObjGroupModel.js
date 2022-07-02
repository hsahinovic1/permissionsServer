import Sequelize from "sequelize";
import sequelize from "../config/database.js";

const PermObjGroup = sequelize.define("group_permissions", {});
export default PermObjGroup