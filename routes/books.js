const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Books = require('../models/Books')
const fetchuser = require('../midleware/fetchuser');

// ROUTE 1: Get all books using : GET "api/auth/getbooks" Login required (auth-token required).
router.get('/getbooks', fetchuser, async (req, res) => {
    try {
        const books = await Books.find({ book: req.ObjectId }); 
        // res.json("Hello World")       
        res.json(books)

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error');
    }
})

// ROUTE 2: Add New Books : POST "api/auth/addbooks" Login Not required.
router.post('/addbooks', [
    body('title', 'Enter Valid title').isLength({ min: 3 }),
    body('auther', 'Enter Valid auther').isLength({ min: 3 })
], async (req, res) => {
    try {
        console.log("Hello 1")
        const {title, auther, category, pdfLink} = req.body;
        //If there are errors, return Bad request and the errors
        const errors = validationResult(req);
        console.log("Hello 2")
        if (!errors.isEmpty()) {
            console.log("Hello 3")
            return res.status(400).json({ errors: errors.array() });
        }
        const book = new Books({
            title, auther, category, pdfLink
        })
        console.log("Hello 4")
        const savebook = await book.save()
        console.log("Hello 5")
        res.json(savebook)
        console.log("Hello 6")
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error');
    }
})

// ROUTE 3: Find Books from listed Books : PUT "api/auth/findbook/:id" Login required (auth-token required).
router.get('/findbook/', fetchuser, async (req, res) => {

    const {title, auther, category} = req.body;
    try {
        //Find Book from the list using  Title of Book, Name of Auther and Category.

        const book = await Books.find({$or:[{title:req.body.searchByTitle},
        {auther:req.body.searchByAuther},{category:req.body.searchByCategory}]}).select('-_id -__v').then(result=>{res.json({result})})
        .catch(err=>{res.status(500).json({err})})
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error');
    }

})

// ROUTE 4: Delete Books from listed Books : DELETE "api/auth/deletebook/:id" Login required (auth-token required)
router.delete('/deletebook/:id', fetchuser, async (req, res) => {

    const id = req.params.id;
    let book = await Books.remove({_id:id}).exec().then(result=>{res.status(200)
        .json({result,"Message":"Success"})})
        .catch(err=>{res.status(501).json({"Message":err})})
    // try {
    //     //Delete Book from the list
    //     let book = await Books.findById(req.params.id);
    //     if(!book){return res.status(404).send("Not Found")}

    //     // Allow Deletion pnly if user owns the book
    //     if(book.user.toString() !== req.user.id){
    //         return res.status(401).send("Not Aloowed")
    //     }

    //     book = await Books.findByIdAndDelete(req.params.id)
    //     res.json({"SUCCESS": "Book has been deleted", book:book})

    // } catch (error) {
    //     console.error(error.message);
    //     res.status(500).send('Internal Server Error');
    // }
})

// ROUTE 5: Save Books from listed Books : POST "api/auth/deletebook/:id" Login required (auth-token required)
router.post('/savebooks', fetchuser, async (req, res) => {

    const name = req.user.name;
    const book = await Books.find({user:name}).select('title auther category pdfLink user')
    .then(result=>{
        res.status(200).json({result});
    })
    .catch(err=>{res.status(401).json(err)})

})

module.exports = router