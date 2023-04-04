const router = require('express').Router()

const Project = require('../models/Project.model')
const Task = require('../models/Task.model')
const mongoose = require('mongoose')

router.post('/projects',(req,res,next)=>{
    const {title, description} = req.body


    Project.create({title,description})
    .then(newProject=>{
        console.log(newProject)
        res.json(newProject)})
    .catch(error=>console.log(error))
})

router.get('/projects',(req,res,next)=>{
    Project.find()
    .populate('tasks')
    .then(allProjects=>{
        res.json(allProjects)
    })
    .catch((error)=>{
        console.log(error)
    })
})


router.get('/projects/:projectd', (req, res, next) => {
    const { projectId } = req.params;
   
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      res.status(400).json({ message: 'Specified id is not valid' });
      return;
    }
   
    // Each Project document has `tasks` array holding `_id`s of Task documents
    // We use .populate() method to get swap the `_id`s for the actual Task documents
    Project.findById(projectId)
      .populate('tasks')
      .then(project => res.status(200).json(project))
      .catch(error => res.json(error));
  });

  router.put('/projects/:projectId', (req, res, next) => {
    const { projectId } = req.params;
   console.log(req.body)
    //checks if the id is valid and in our database
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      res.status(400).json({ message: 'Specified id is not valid' });
      return;
    }
   
    //new: true lets mongoose return to me the updated object and not the old object
    Project.findByIdAndUpdate(projectId,req.body,{new:true})
      .then((updatedProject) => res.json(updatedProject))
      .catch(error => res.json(error));
  });

  router.delete('/projects/:projectId',(req,res,next)=>{
        const {projectId} = req.params
        Project.findByIdAndDelete(projectId)
        .then((response)=>{
            res.json(response)
        })
        .catch(error=>{
            res.json(error)
        })
  })
   
module.exports = router;