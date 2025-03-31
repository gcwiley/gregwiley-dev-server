// import the project model
import { Project } from '../models/project.js';

// function to create a new project - NEW PROJECT
export const newProject = async (req, res) => {
   const project = new Project(req.body);
   try {
      // saves new project to the database
      await project.save();
      res.status(201).json('Successfully added post to database');
   } catch (error) {
      console.error(error);
      res.status(400).send(error);
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
      res.status(500).send(error);
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
         return res.status(404).json('Project not found');
      }

      res.send(project);
   } catch (error) {
      console.error(error);
      res.status(500).send(error);
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
      res.send(project);
   } catch (error) {
      console.error(error);
      res.status(400).send(error);
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
      res.send('Project successfully deleted from database');
   } catch (error) {
      res.status(500).send(error);
      console.error(error);
   }
};

// function to count all Projects - GET PROJECT COUNT
export const getProjectCount = async (req, res) => {
   try {
      // count all projects within database
      const projectCount = await Project.countDocuments({});

      // if no projects were found
      if (!projectCount) {
         return res.status(404).send('No projects found.');
      }

      // send project count to client
      res.send(projectCount);
   } catch (error) {
      res.status(500).send(error);
      console.error(error);
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
      res.send(mostRecentProjects);
   } catch (error) {
      res.status(500).send(error);
      console.error(error);
   }
};

// function to get favorite projects - GET FAVORITE PROJECTS - LIMIT 4 results
export const getFavoriteProjects = async (req, res) => {
   try {
      const favoriteProjects = await Project.find({}).limit(4);

      // no favorite projects found
      if (!favoriteProjects) {
         return res.status(404).send('No favorite projects were found.');
      }
      res.send(favoriteProjects);
   } catch (error) {
      console.error(error);
      res.status(500).send(error);
   }
};
