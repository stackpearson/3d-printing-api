const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Project = require('./models/projectModel');
const User = require('./models/userModel');
const app = express();

app.use(express.json());

//------------------------- auth --------------------------//
const auth = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({message: 'Authorized users only, contact an admin'});
    }

    try {
        const decodedToken = jwt.verify(token, 'shh-it-is-a-secret');
        req.user = decodedToken;
        next();
    } catch (error) {
        res.status(401).json({message: 'Authorized users only, contact an admin'});
    }
}

//routes
app.get('/', (req, res) => {
    res.send('node api now running');
})

//-------------------------------------------------- //
// ------------------ USERS ----------------------- //

app.post('/register', async (req, res) => {
    try {
        const {userName, password} = req.body;
        const existingUser = await User.findOne({userName});

        if (existingUser) {
            return res.status(400).json({message: 'User already exists, please choose a new username'})
        }

        const newUser = new User({ userName, password});
        await newUser.save();
        res.status(201).json({
            message: `We got it, thanks for registering ${userName}`,
            id: newUser.id,
            userName: newUser.userName,
            role: newUser.role
        });

    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({message: 'Invalid password'});
        }

        const token = jwt.sign({ username: user.userName, role: user.role}, 'shh-it-is-a-secret', {expiresIn: '1h'});
        res.status(200).json({ token });
    
    } catch (error) {
        res.status(500).json({message: error.message})
    }
});

app.put('/users/:id', auth, async (req, res) => {
    try {
        const {id} = req.params;
        const updatedUser = await User.findByIdAndUpdate(id, req.body, {new: true});
        if(!updatedUser){
            return res.status(404).json({message: `No user with ID: ${id}`});
        }
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

app.get('/users', auth, async (req, res) => {
    try {
        const users = await User.find({})
        res.status(200).json(users)
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message: error.message});
    }
});

app.delete('/users/:id', auth, async (req, res) => {
    try {
        const {id} = req.params;
        const deletedUser = await User.findByIdAndDelete(id);
        if(!deletedUser){
            return res.status(404).json({message: `No user with ID: ${id}`});
        }
        res.status(200).json({message: `${deletedUser.userName} deleted from database`});
    } catch (error) {
        res.status(500).json({message: error.message})
    }
});

//--------------------------------------------- //
// -------------- PROJECTS -------------------- //

app.post('/project', async (req, res) => {
    try {
        const { customerName, customerEmail, idea, customerPhone } = req.body;

        if (!customerName || !customerEmail || !idea) {
            return res.status(400).json({message: 'Name, email and idea are all required'})
        }

        const projectData = {
            customerName,
            customerEmail,
            idea,
            customerPhone: customerPhone || ''
        };

        const project = await Project.create(projectData);

        res.status(200).json({
            _id: project._id,
            ...project.toObject()
        })
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: error.message });
    }
});

app.get('/projects', auth, async (req, res) => {
    try {
        const projects = await Project.find({})
        res.status(200).json(projects)
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message: error.message});
    }
});

app.get('/projects/:id', auth, async (req, res) => {
    try {
        const {id} = req.params;
        const project = await Project.findById(id)
        res.status(200).json(project)
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message: error.message});
    }
});

app.put('/projects/:id', auth, async (req, res) => {
    try {
        const {id} = req.params;
        const updatedProject = await Project.findByIdAndUpdate(id, req.body, {new: true});
        if(!updatedProject){
            return res.status(404).json({message: `No projects with ID: ${id}`});
        }
        res.status(200).json(updatedProject);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
});

app.delete('/projects/:id', auth, async (req, res) => {
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

//----------------------------------------------------------------------------//

mongoose.connect('mongodb+srv://admin:3ZM8rDMAoXZAUKd0@stackpearson.dwwrk2s.mongodb.net/c3-print-api?retryWrites=true&w=majority')
.then(()=> {
    console.log('connected to mongoDB');
    app.listen(3000, ()=> {
        console.log('node api now running on http://localhost:3000/');
    })
}).catch((error) => {
    console.log(error)
})