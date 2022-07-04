import User from "../models/UserModel.js";
import Group from "./models/GroupModel.js";
import Permission from "./models/PermissionModel.js";
import Object from "./models/ObjectModel.js";
import UserGroup from "./models/UsersGroupsModel.js";
import PermObjGroup from "./models/PermObjGroupModel.js";
import PermObjUser from "./models/PermObjUserModel.js";
import { addAbortSignal } from "stream";

// @desc    add user to a group
// @route   POST /permissions
const addUserToGroup = async (req, res) => {
    try {
        const { userName, groupName } = req.body;

        let user = await User.findOrCreate({ where: { username: userName } });
        let group = await Group.findOrCreate({ where: { name: groupName } });

        UserGroup.create({
            userId: user.id,
            groupId: group.id
        }).then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message:
                    e.message || "Error occurred while adding user to a group."
            })
        });
    } catch (e) {
        res.send({ error: e.message });
    }
}

// @desc    remove all users from group
// @route   DELETE /permissions
const removeUsersFromGroup = async (req, res) => {
    try {
        const { groupName } = req.body;

        let group = await Group.findOrCreate({ where: { name: groupName } });

        Group.destroy({
            where: { groupId: group.id }
        })
            .then(num => {
                if (num == 1) {
                    res.send({
                        message: "Users were removed successfully!"
                    });
                } else {
                    res.send({
                        message: `Cannot delete users from group with id=${id}. Maybe group was not found!`
                    });
                }
            })
            .catch(err => {
                res.status(500).send({
                    message: "Could not delete users from group with id=" + id
                });
            });

    } catch (e) {
        res.send({ error: e.message });
    }
}

// @desc    add permission to a user or a group
// @route   POST /permissions
const addPermission = async (req, res) => {
    try {
        const { name, permissionName, objectName } = req.body;

        let user = await User.findOne({ where: { username: name } });
        let group = await Group.findOne({ where: { name: name } });
        let permission = await Permission.findOne({ where: { name: permissionName } });
        let object = await Object.findOne({ where: { name: objectName } });

        if (user == null && group == null) {
            user = await User.findOrCreate({ where: { username: name } });
        }


        if (group) {
            PermObjGroup.create({
                permission_id: permission.id,
                group_id: group.id,
                object_id: object.id
            }).then(data => {
                res.send(data);
            }).catch(err => {
                res.status(500).send({
                    message:
                        e.message || "Error occurred while adding permission to a group."
                })
            });
        }
        else {
            PermObjUser.create({
                user_id: user.id,
                permission_id: permission.id,
                object_id: object.id
            }).then(data => {
                res.send(data);
            }).catch(err => {
                res.status(500).send({
                    message:
                        e.message || "Error occurred while adding permission to a user."
                })
            });
        }
    } catch (e) {
        res.send({ error: e.message });
    }
}

// @desc    remove all permisions for a group or user
// @route   DELETE /permissions
const removeAllPermissions = async (req, res) => {
    try {
        const { name } = req.body;


        let user = await User.findOrCreate({ where: { username: name } });
        let group = await Group.findOrCreate({ where: { name: name } });



        if (group) {
            PermObjGroup.destroy({
                where: { group_id: group.id }
            })
                .then(num => {
                    if (num == 1) {
                        res.send({
                            message: "Permission was deleted successfully!"
                        });
                    } else {
                        res.send({
                            message: `Cannot delete permission !`
                        });
                    }
                })
                .catch(err => {
                    res.status(500).send({
                        message: "Could not delete permission!"
                    });
                });
        }
        else {
            PermObjUser.destroy({
                where: { user_id: user.id }
            })
                .then(num => {
                    if (num == 1) {
                        res.send({
                            message: "Permission was deleted successfully!"
                        });
                    } else {
                        res.send({
                            message: `Cannot delete permission!`
                        });
                    }
                })
                .catch(err => {
                    res.status(500).send({
                        message: "Could not delete permission!"
                    });
                });
        }
    } catch (e) {
        res.send({ error: e.message });
    }
}

// @desc    for testing if a particular user has a particular permission over a particular object.
// @route   GET /permissions
const testPermission = async (req, res) => {
    try {
        const { name, permissionName, objectName } = req.body;

        let user = await User.findOrCreate({ where: { username: name } });
        let permission = await Permission.findOrCreate({ where: { name: permissionName } });
        let object = await Object.findOrCreate({ where: { name: objectName } });

        let sol = await PermObjUser.findOne({
            where: {
                user_id: user.id,
                permission_id: permission.id,
                object_id: object.id
            }
        })
        if (sol === null) {

            sol = await PermObjGroup({
                where: {
                    permission_id: permission.id,
                    object_id: object.id,
                },
                include: {
                    model: PermObjGroup,
                    where: {
                        group_id: { $col: 'PermObjGroup.group_id' },
                        user_id: user.id
                    }
                }
            })
        }
        if (sol === null) {
            res.send({
                message: "Permission was not found!"
            });
        }
        res.send({
            message: "Permission was found successfully!"
        });
    }
    catch (e) {
        res.send({ error: e.message });
    }
}

// @desc    for querying particular users permissions over a particular object.
// @route   GET /permissions
const getPermissions = async (req, res) => {
    try {
        const { name, objectName } = req.body;

        let user = await User.findOrCreate({ where: { username: name } });
        let object = await Object.findOrCreate({ where: { name: objectName } });

        let sol = await PermObjUser.findAll({
            attributes: [],
            where: {
                user_id: user.id,
                object_id: object.id
            },
            include: [{
                model: Permission,
                attributes: 'name',
                where: {
                    id: { $col: 'PermObjUser.permission_id' }
                }
            },
            {
                model: PermObjGroup,
                attributes: [],
                where: {
                    user_id: user.id,
                    object_id: object.id
                },
                include: [{
                    model: Permission,
                    attributes: 'name',
                    where: {
                        id: { $col: 'PermObjGroup.permission_id' }
                    }
                }]

            }]
        })
        if (sol === null) {

            sol = await PermObjGroup.findOne({
                where: {
                    permission_id: permission.id,
                    object_id: object.id,
                },
                include: {
                    model: PermObjGroup,
                    where: {
                        group_id: { $col: 'PermObjGroup.group_id' },
                        user_id: user.id
                    }
                }
            })
        }
        if (sol === null) {
            res.send({
                message: "Permission was not found!"
            });
        }
        res.send({
            message: "Permission was found successfully!"
        });
    }
    catch (e) {
        res.send({ error: e.message });
    }
}