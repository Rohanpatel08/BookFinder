const express = require('express');
const router = express.Router();
const User = require('../models/User');
const fetchuser = require('../midleware/fetchuser');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'Rajis@nITengineer';

// ROUTE 1: Create a user using: POST "api/auth/createuser". No login required (auth-token not required).
router.post('/createuser', [
  body('name','Enter Valid Name').isLength({ min: 3 }),
  body('email','Enter Valid Email').isEmail(),
  body('password','Password must be 6 character long.').isLength({ min: 6 })
], async (req, res) => {
  //If there are errors, return Bad request and the errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  // Check whether user exists already with same email
  try {

    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({ error: 'Sorry user with this email is already exist.' })
    }

    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password, salt)
    // Create New User
    user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: secPass
    })
    const data = {
      user:{
        id:user.id
      }
    }
    const authtoken = jwt.sign(data, JWT_SECRET);
    console.log(authtoken)
    res.json({authtoken})
  }catch (error) {
    console.error(error.message);
    res.status(500).send('Internal Server Error Occured');
  }
})

// ROUTE 2: Authenticate a User using: POST "api/auth/login". No login required (auth-token not required).
router.post('/login', [
  body('email','Enter Valid Email').isEmail(),
  body('password','Password must be 6 character long.').isLength({ min: 6 }).exists()
], async (req, res) => {
  //If there are errors, return Bad request and the errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {email, password} = req.body;
  try {
    let user = await User.findOne({email});
    if(!user){
      return res.status(400).json({error:"Please enter correct credentials to login."});
    }

    const comparepass = await bcrypt.compare(password, user.password);
    if(!comparepass){
      return res.status(400).json({error:"Please enter correct credentials to login."});
    }

    const data = {
      user:{
        id:user.id
      }
    }
    const authtoken = jwt.sign(data, JWT_SECRET);
    res.json({authtoken})
    
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal Server Error Occured');
  }
});

// ROUTE 3: Get Loggedin user Details using : POST "api/auth/getuser" Login required (auth-token required).
router.post('/getuser',fetchuser, async (req, res) => {

  try {
    // console.log("Hello")
    userId = req.user.id;
    const user = await User.findById(userId).select('-password');
    console.log(user);
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;