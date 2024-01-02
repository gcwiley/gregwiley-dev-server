import { Project } from '../models/project.js';

// function to create a new project - NEW PROJECT
export const newProject = async (req, res) => {
  const project = new Project(req.body);

  try {
    await project.save();
    res.status(201).send(project);
  } catch (error) {
    res.status(400).send(error);
  }
};

// function to fetch all projects from database - ALL PROJECTS
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({}).sort({ title: 'desc' });

    // if no projects are found
    if (!projects) {
      return res.status(404).send();
    }

    res.send(projects);
  } catch (error) {
    res.status(500).send();
  }
};

// function to fetch individual project by ID - PROJECT BY ID
export const getProjectById = async (req, res) => {
  const _id = req.params.id;

  try {
    // filters by _id
    const project = await Project.findById({ _id });

    // if no project is found
    if (!project) {
      return res.status(404).send();
    }

    res.send(project);
  } catch (error) {
    res.status(500).send();
  }
};

// function to update a project by id - UPDATE PROJECT
export const updateProjectById = async (req, res) => {
  try {
    const _id = req.params.id;
    const project = await Project.findByIdAndUpdate(_id, req.body, {
      new: true,
      runValidators: true,
    });

    // is no project is found
    if (!project) {
      return res.status(404).send();
    }

    // send updated project back to client
    res.send(project);
  } catch (error) {
    res.status(400).send(error);
  }
};

// function to delete a project by ID - DELETE PROJECT
export const deleteProjectById = async (req, res) => {
  try {
    // find and delete project that takes id into account
    const project = await Project.findByIdAndDelete({
      _id: req.params.id,
    });

    // if no project is found
    if (!project) {
      res.status(404).send();
    }
    res.send(project);
  } catch (error) {
    res.status(500).send();
  }
};

// function to count all Projects - PROJECT COUNT
export const getProjectCount = async (req, res) => {
  try {
    // count all projects within database
    const projectCount = await Project.countDocuments({});

    // console type check
    console.log(typeof projectCount);

    // if no projects are found
    if (!projectCount) {
      return res.status(404).send();
    }

    res.send(projectCount);
  } catch (error) {
    res.status(500).send();
  }
};

// function to get the 5 most recently create projects
export const getRecentlyCreatedProjects = async (req, res) => {
  try {
    const mostRecentProjects = await Project.find({}).sort({ createdAt: -1 }).limit(5);

    if (!mostRecentProjects) {
      return res.status(404).send();
    }
    res.send(mostRecentProjects);
  } catch (error) {
    res.status(500).send();
  }
};
