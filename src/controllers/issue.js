import { Issue } from '../models/issue.js';

// function to create a new project - NEW ISSUE
export const newIssue = async (req, res) => {
  const issue = new Issue(req.body);

  try {
    await issue.save();
    res.status(201).send(issue);
  } catch (error) {
    res.status(400).send(error);
  }
};

// function to fetch all projects from database - ALL ISSUES
export const getIssues = async (req, res) => {
  try {
    const issues = await Issue.find({}).sort({ title: 'desc' });

    // if no issues are found
    if (!issues) {
      return res.status(404).send();
    }

    res.send(issues);
  } catch (error) {
    res.status(500).send();
  }
};

// function to fetch individual project by ID - ISSUE BY ID
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

// function to update a project by id - UPDATE ISSUE
export const updateIssueById = async (req, res) => {
  try {
    const _id = req.params.id;
    const issue = await Issue.findByIdAndUpdate(_id, req.body, {
      new: true,
      runValidators: true,
    });

    // is no issue is found
    if (!issue) {
      return res.status(404).send();
    }

    // send updated project back to client
    res.send(issue);
  } catch (error) {
    res.status(400).send(error);
  }
};

// function to delete a project by ID - DELETE ISSUE
export const deleteIssueById = async (req, res) => {
  try {
    // find and delete project that takes id into account
    const project = await Issue.findByIdAndDelete({
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