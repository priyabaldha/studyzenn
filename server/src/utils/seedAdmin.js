// utils/seedAdmin.js
const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const db = require('../config/db');

(async ()=>{
  await db();
  const existing = await User.findOne({email:'admin@school.test'});
  if(existing){ console.log('admin exists'); process.exit(); }
  const password = await bcrypt.hash('Admin@123', 10);
  await User.create({name:'Admin', email:'admin@school.test', password, role:'admin'});
  console.log('Admin seeded'); process.exit();
})();
