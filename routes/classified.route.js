const express = require('express');

const router = express.Router();



const Classified = require('../models/Classified.model')


router.post('/classified',async (req,res)=>{
    try {
        const {name,description,category,image,location,postedAt,price} = req.body;


        const newClassified = new Classified({name,description,category,image,location,postedAt,price})

        await newClassified.save();
        res.status(201).json(newClassified);
    } catch (error) {
        res.status(500).json({massage: "server error"});
    }
})


router.get('/classifieds',async (req,res)=>{

    try {
        const {category,search,page}=req.query;
        const perPage = 4;

        const skip = (parseInt(page)-1)*perPage;
        let query ={};
        if(category) {

            query.category = category;

        }


        if(search) {
            query.name = {$regex:new RegExp(search,'i')};
        }

        const totalClassifieds = await Classified.countDocuments(query);

        const classifieds = await Classified.find(query)
        .skip(skip)
        .limit(perPage)
        .sort({postedAt:-1});
        res.status(200).json({
            totalClassifieds,
            currentPage:parseInt(page),
            totalPages :Math.ceil(totalClassifieds/perPage),classifieds,
        });
    } catch (error) {
        res.status(500).json({message:"server error",error:error});
    }
})


router.delete("/classifieds/:id",async (req,res)=>{
    try {
        const deletedClassifieds = await Classified.findByIdAndDelete(req.params.id);

        if(!deletedClassifieds) {
            return res.status(404).json({message:"Classified not found"});

        }

        res.status(200  ).json({message:"Classified deleted successfully"});
    } catch (error) {
        res.status(500).json({message:"Internal Server Error"});
    }
})


module.exports = router;
