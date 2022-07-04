import express from "express";

import {
    addUserToGroup,
    removeUsersFromGroup,
    addPermission,
    removeAllPermissions,
    testPermission,
    getPermissions
  } from "../controllers/permissionsController.js";

  const router = express.Router();

router.post("/addUser", addUserToGroup);
router.delete("/removeUsers", removeUsersFromGroup);
router.post("/addPermission", addPermission);
router.delete("/removePermissions", removeAllPermissions);
router.post("/testPermission", testPermission);
router.post("/getPermissions", getPermissions);

export default router;