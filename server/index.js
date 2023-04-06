const express = require("express");
require("./db/config");
const cors = require("cors");
const multer = require('multer');
const User = require("./db/User");
const Order = require("./db/Order")
const Admin = require("./db/Admin")
const Category= require("./db/Category");
const Product= require("./db/Product");
const Jwt = require('jsonwebtoken')
const Main= require("./db/Main")
const jwtKey = 'pet-store'

const app= express();

app.use(express.json());
app.use(cors());
app.use('/uploads',express.static('uploads'));

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads'); // specify the destination folder where the file will be saved
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // generate a unique filename for the uploaded file
  }
});
const upload = multer({ storage: storage });


app.post("/register", async (req, resp) => {
  let user = new User(req.body);
  let result = await user.save();
  result = result.toObject();
  delete result.password
  resp.send(result);
});
app.post("/login", async (req, resp) => {
  if(req.body.password && req.body.email)
  {
      let user = await User.findOne(req.body).select("-password")
  if(user)
  {
      resp.send(user)
  }else{
      resp.send({result:"No User Found"})
  }
  }else{
      resp.send({result:"No User Found"})
  }
});

app.get('/users', async (req, res) => {
  let users= await User.find(req.body).select("-password");
  if(users.length>0){
      res.send(users)
  }else{
      res.send({result:"No Products Found"})
  }
});

app.post("/admin/login", async (req, resp) => {
  if(req.body.password && req.body.email)
  {
      let admin = await Admin.findOne(req.body).select("-password")
  if(admin)
  {
    Jwt.sign({admin},jwtKey,{expiresIn:"24h"}, (err, token) =>{
      if(err){
        resp.send({result:"something went wrong"})
      }
        resp.send({admin, auth: token})
    })
   
  }else{
      resp.send({result:"No User Found"})
  }
  }else{
      resp.send({result:"No User Found"})
  }
});

app.post('/main', upload.single('image'), async (req, res) => {
  try {
    const { name, category } = req.body;
    const main = new Main({
      name,
      category,
      image: req.file.path // store the URL of the uploaded image in the 'image' field of the new product
    });
    await main.save();
    res.status(201).send(main);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get('/main', async (req, res) => {
  let mains= await Main.find();
  if(mains.length>0){
      res.send(mains)
  }else{
      res.send({result:"No Data Found"})
  }
});

app.post("/Category", async (req, resp) => {
  let category = new Category(req.body);
  let result = await category.save();
  resp.send(result);
});

app.get("/Categories/:category", async(req,resp)=>{
  var categorySlug = req.params.category;
  const result = await Category.find({category:categorySlug})
  if(result){
      resp.send(result)
  }else{
      resp.send({result:"NO data Found"})
  }
});

app.post('/add-product', upload.single('image'), async (req, res) => {
  try {
    const { name, price, category, size } = req.body;
    const product = new Product({
      name,
      price,
      category,
      size,
      image: req.file.path // store the URL of the uploaded image in the 'image' field of the new product
    });
    await product.save();
    res.status(201).send(product);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get("/Products/:category", async(req,resp)=>{
  var categorySlug = req.params.category;
  const result = await Product.find({category:categorySlug})
  if(result){
      resp.send(result)
  }else{
      resp.send({result:"NO data Found"})
  }
});

app.get('/product', async (req, res) => {
  let products= await Product.find();
  if(products.length>0){
      res.send(products)
  }else{
      res.send({result:"No Products Found"})
  }
});

 app.get("/product/:id", async(req,resp)=>{
    const result = await Product.findOne({_id:req.params.id})
    if(result){
        resp.send(result)
    }else{
        resp.send({result:"NO data Found"})
    }
});

app.delete("/product/:id", async(req,resp)=>{
  const result = await Product.deleteOne({_id:req.params.id})
  resp.send(result);
});

app.post("/Orders", async (req, resp) => {
  let order = new Order(req.body);
  let result = await order.save();
  resp.send(result);
});

app.get('/Orders', async (req, res) => {
  let orders= await Order.find();
  if(orders.length>0){
      res.send(orders)
  }else{
      res.send({result:"No Products Found"})
  }
});

app.listen(5000);