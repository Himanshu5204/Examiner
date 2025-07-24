const express = require('express');
const {
    createAdmin,
    createStudent,
    createTeacher
} = require('../utils/createUser');

//IMPORTANT 'Status Code'
// 200 -> OK(request fullfilled)
// 201 -> Create new resources
// 204 -> User not found / user not exist on Database
// 400 => mistake from client/user side (missing values, incorrect data)
// 403 -> Invalid credentials
// 409 -> Resource already exist
// 500 -> Internal server error

/*
getSchema:
    - is object mapping {"role":"databaseSchema"}
    - easily accesible through 'utils'
*/
const getSchema = require('../utils/getSchema')
const login = async (req, res) => {
    const { role, email, password } = req.body;

    //change model role wise (student, teacher, admin)
    let model = getSchema[role];

    try {

        //usernot found
        const user = await model.findOne({ email });
        if (!user) {
            res.status(204).json({ message: "User not exists" });
            return;
        }

        console.log(user)

        //user password matching
        if (user.password === password) {
            res.status(200).json({ message: "User Succesfully login", user })
            return;
        }

        res.status(403).json({ message: "Unauthorized" });

    } catch (error) {

        console.error("Error_Authentication_Login_User(" + role + "): " + error)
        res.status(500).json({ message: "Internal Server Error " })

    }
}

/*
getFunction:
    - mapping of craete function according users
*/
const getFunction = {
    "student": createStudent,
    "teacher": createTeacher,
    "admin": createAdmin
}
const signup = async (req, res) => {
    const { role, email } = req.body;

    let model = getSchema[role];
    try {

        //user not found
        let user = await model.findOne({ email });
        if (user) {
            res.status(409).json({ message: "User already exists" });
            return;
        }

        //This finction return promise to save user 
        //await it then user will saved
        const signupUserFunction = getFunction[role];
        user = await signupUserFunction(req.body);

        res.status(201).json({ message: "User created succesfully", user });

    } catch (error) {

        console.error("Error_Authentication_Signup_User(" + role + "): " + error)
        res.status(500).json({ message: "Internal Server Error " })

    }
}

module.exports = { login, signup };