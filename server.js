const express = require('express');
const mongoose = require('mongoose');
const Project = require('./models/projectModel');
const app = express();

app.use(express.json());

//routes
app.get('/', (req, res) => {
    res.send('node api now running');
})

app.post('/project', async (req, res) => {
    try {
        const project  = await Project.create(req.body);
        res.status(200).json(project);
    } catch (error) {
       console.log(error.message);
       res.status(500).json({message: error.message}); 
    }
});

app.get('/projects', async (req, res) => {
    try {
        const projects = await Project.find({})
        res.status(200).json(projects)
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message: error.message});
    }
});

app.get('/projects/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const project = await Project.findById(id)
        res.status(200).json(project)
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message: error.message});
    }
});

app.put('/projects/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const updatedProject = await Project.findByIdAndUpdate(id, req.body, {new: true});
        if(!updatedProject){
            return res.status(404).json({message: `No products with ID: ${id}`});
        }
        res.status(200).json(updatedProject);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
});

app.delete('/projects/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const deletedProject = await Project.findByIdAndDelete(id);
        if(!deletedProject){
            return res.status(404).json({message: `No products with ID: ${id}`});
        }
        res.status(200).json(deletedProject);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
});

mongoose.connect('mongodb+srv://admin:3ZM8rDMAoXZAUKd0@stackpearson.dwwrk2s.mongodb.net/c3-print-api?retryWrites=true&w=majority')
.then(()=> {
    console.log('connected to mongoDB');
    app.listen(3000, ()=> {
        console.log('node api now running on http://localhost:3000/');
    })
}).catch((error) => {
    console.log(error)
})