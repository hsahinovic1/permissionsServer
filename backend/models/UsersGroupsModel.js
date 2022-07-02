import Sequelize from "sequelize";
import sequelize from "../config/database.js";

const UserGroup = sequelize.define("user_group", {});
export default UserGroup