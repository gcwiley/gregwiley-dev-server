// import the project model
import { Project } from '../models/project.js';

// function to create a new project - NEW PROJECT
export const newProject = async (req, res) => {
   const project = new Project({
      title: req.body.title,
      status: req.body.status,
      category: req.body.category,
      language: req.body.language,
      startDate: new Date(req.body.startDate),
      liveUrl: req.body.liveUrl,
      gitUrl: req.body.gitUrl,
      description: req.body.description,
      favorite: req.body.favorite,
   });
   try {
      // saves new project to the database
      await project.save();
      res.status(201).json({ message: 'Successfully added project to database.' });
   } catch (error) {
      console.error('Internal Server Error', error);
      res.status(500).json({ message: 'Internal Server Error' });
   }
};

// function to fetch all projects from database - GET ALL PROJECTS
export const getProjects = async (req, res) => {
   try {
      const projects = await Project.find({});

      // if no projects are found
      if (projects.length === 0) {
         return res.status(404).json('No projects found.');
      }
      // send all projects to client
      res.send(projects);
   } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
   }
};

// function to fetch individual project by ID - GET PROJECT BY ID
export const getProjectById = async (req, res) => {
   //  find id of project from params
   const _id = req.params.id;

   try {
      // filters by _id
      const project = await Project.findById({ _id });

      // if no project is found
      if (!project) {
         return res.status(404).json({ message: 'Project Not Found.' });
      }

      res.status(200).json(project);
   } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error.' });
   }
};

// function to update a project by id - UPDATE PROJECT
export const updateProjectById = async (req, res) => {
   //  find id of project from params
   const _id = req.params.id;

   try {
      const project = await Project.findByIdAndUpdate(_id, req.body, {
         new: true,
         runValidators: true,
      });

      // is no project is found
      if (!project) {
         return res.status(404).json('Project not found');
      }

      // send updated project back to client
      res.status(200).json(project);
   } catch (error) {
      // comment
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
   }
};

// function to delete a project by ID - DELETE PROJECT
export const deleteProjectById = async (req, res) => {
   //  find id of project from params
   const _id = req.params.id;

   try {
      // find and delete project that takes _id into account
      const project = await Project.findByIdAndDelete({
         _id: _id,
      });

      // if no project is found
      if (!project) {
         res.status(404).json('Unable to delete. Project not found');
      }
      res.status(204).json('Project successfully deleted from database');
   } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
   }
};

// function to count all Projects - GET PROJECT COUNT
export const getProjectCount = async (req, res) => {
   try {
      const projectCount = await Project.countDocuments({});

      // send project count to client
      res.status(200).json(projectCount);
   } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
   }
};

// function to get the 5 most recently create projects - 5 RECENT PROJECTS
export const getRecentlyCreatedProjects = async (req, res) => {
   try {
      const mostRecentProjects = await Project.find({}).sort({ createdAt: -1 }).limit(5);

      // no recent projects found
      if (!mostRecentProjects) {
         return res.status(404).send('No recent projects were found.');
      }
      res.status(200).json(mostRecentProjects);
   } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Internal Server Error' });
   }
};

// function to get favorite projects - GET FAVORITE PROJECTS - LIMIT 4 results
export const getFavoriteProjects = async (req, res) => {
   try {
      // fix this!
      const favoriteProjects = await Project.find({});

      // no favorite projects found
      if (!favoriteProjects) {
         return res.status(404).json({ message: 'No favorite projects were found.' });
      }
      res.status(200).json(favoriteProjects);
   } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
   }
};
