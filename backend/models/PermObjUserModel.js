import Sequelize from "sequelize";
import sequelize from "../config/database.js";

const PermObjUser = sequelize.define("user_permissions", {});
export default PermObjUser