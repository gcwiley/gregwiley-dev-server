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
    res.status(201).json({ success: true, message: 'Successfully added project to database.' });
  } catch (error) {
    console.error('Error creating project.', error);
    res.status(500).json({
      success: false,
      message: 'Error creating project.',
      error: error.message,
    });
  }
};

// function to fetch all projects from database - GET ALL PROJECTS
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({}).lean();

    // if no projects are found
    if (projects.length === 0) {
      console.error('No projects found.');
      return res.status(404).json({ success: false, message: 'No projects found.' });
    }
    // send the list of projects back to the client
    res.status(200).json({
      success: true,
      message: 'Successfully retrieved projects.',
      data: projects,
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching projects. ',
      error: error.message,
    });
  }
};

// function to fetch all paginated projects from database - GET PROJECT PAGINATION
export const getPaginatedProjects = async (req, res) => {
  try {
    // extract and validate pagination parameters from query string (with default values)
    let { page = 1, size = 10 } = req.query; // default page is 1, default size is 10

    // convert page and size to numbers
    page = Number(page);
    size = Number(size);

    // page and size must be positive integers
    if (page < 1) page = 1;
    if (size < 1) size = 10;

    const limit = size;
    const skip = (page - 1) * size;

    const projects = await Project.find({}).skip(skip).limit(limit);
    const totalProjects = await Project.countDocuments({});

    if (projects.length === 0 && totalProjects > 0) {
      return res.status(404).json({
        success: false,
        message: 'No projects founds on this page.',
      });
    }

    if (totalProjects === 0) {
      return res.status(404).json({
        success: false,
        message: 'No projects found.',
      });
    }

    const totalPages = Math.ceil(totalProjects / limit);

    const paginationInfo = {
      totalProjects,
      totalPages,
      currentPage: page,
      pageSize: limit,
    };

    res.status(200).json({
      success: true,
      message: 'Successfully retrieved paginated projects',
      data: {
        projects,
        paginationInfo,
      },
    });
  } catch (error) {
    console.error('Error fetching paginated projects:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching paginated projects',
      error: error.message,
    });
  }
};

// function to fetch individual project by ID - GET PROJECT BY ID
export const getProjectById = async (req, res) => {
  //  find id of project from params
  const _id = req.params.id;

  try {
    // filters by _id
    const project = await Project.findById(_id);

    // if project is not found, handle the empty result
    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: 'No project with that ID was found.' });
    }

    // send project data to client
    res.status(200).json({
      success: true,
      message: 'Project retrieved successfully.',
      data: project,
    });
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching project.',
      error: error.message,
    });
  }
};

// function to update a project by id - UPDATE PROJECT BY ID
export const updateProjectById = async (req, res) => {
  //  find id of project from params
  const _id = req.params.id;

  try {
    const project = await Project.findByIdAndUpdate(
      _id,
      {
        title: req.body.title,
        status: req.body.status,
        category: req.body.category,
        language: req.body.language,
        startDate: new Date(req.body.startDate),
        liveUrl: req.body.liveUrl,
        gitUrl: req.body.gitUrl,
        description: req.body.description,
        favorite: req.body.favorite,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    // is project is not found
    if (!project) {
      return res.status(404).json({ success: true, message: 'No project with that ID was found.' });
    }

    // send updated project back to client
    res.status(200).json({
      success: true,
      message: 'Project updated successfully.',
      data: project,
    });
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating project.',
      error: error.message,
    });
  }
};

// function to delete a project by ID - DELETE PROJECT BY ID
export const deleteProjectById = async (req, res) => {
  //  find id of project from params
  const _id = req.params.id;

  try {
    // find and delete project that takes _id into account
    const project = await Project.findByIdAndDelete(_id);

    // if project is not found
    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: 'No project with that ID was found.' });
    }
    res.status(200).json({ success: true, message: 'Project deleted successfully.' });
  } catch (error) {
    console.error('Error deleting project.', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting project',
      error: error.message,
    });
  }
};

// function to count all Projects - GET PROJECT COUNT
export const getProjectCount = async (req, res) => {
  try {
    const projectCount = await Project.countDocuments({});

    // send project count to client
    res.status(200).json({ success: true, message: 'Project count', data: projectCount });
  } catch (error) {
    console.error('Error fetching project count', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching project count',
      error: error.message,
    });
  }
};

// function to get the 5 most recently create projects - 5 RECENT PROJECTS
export const getRecentlyCreatedProjects = async (req, res) => {
  try {
    const mostRecentProjects = await Project.find({}).sort({ createdAt: -1 }).limit(5);

    // no recent projects found
    if (!mostRecentProjects) {
      return res.status(404).json({ success: false, message: 'No recent projects found.' });
    }
    res
      .status(200)
      .json({
        success: true,
        message: 'Successfully fetched most recently created projects.',
        date: mostRecentProjects,
      });
  } catch (error) {
    console.error('Error fetching recent projects:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching recent projects.',
      error: error.message,
    });
  }
};

// function to get favorite projects - GET FAVORITE PROJECTS
export const getFavoriteProjects = async (req, res) => {
  try {
    const favoriteProjects = await Project.find({ favorite: true });

    // if favorite projects are not found
    if (!favoriteProjects) {
      return res.status(404).json({ success: false, message: 'No favorite projects found.' });
    }
    res.status(200).json({ success: true, message: 'Favorite projects', data: favoriteProjects });
  } catch (error) {
    console.error('Error fetching favorite projects:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching favorite projects.',
      error: error.message,
    });
  }
};

// function to search project based on a query - SEARCH PROJECTS
export const searchProjects = async (req, res) => {
  const { query } = req.query;

  // validate query parameters
  if (!query) {
    return res.status(400).json({ message: 'Query parameter is required for searching projects.' });
  }

  try {
    // create a case-insensitive regex for the query
    const regex = new RegExp(query, 'i');

    // search for projects that match the query in the title or description
    const projects = await Project.find({
      $or: [{ title: { $regex: regex } }, { description: { $regex: regex } }],
    });

    if (projects.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: 'No projects found matching your search query.' });
    }

    res.status(200).json({
      success: true,
      message: 'Successfully retrieved projects matching your search query.',
      data: projects,
    });
  } catch (error) {
    console.error('Error searching projects:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching projects.',
      error: error.message,
    });
  }
};

// function to filter projects by category - GET PROJECTS BY CATEGORY
export const getProjectsByCategory = async (req, res) => {
  try {
    const { category } = req.query;

    if (!category) {
      return res.status(400).json({
        success: false,
        message: 'Category parameter is required for filtering projects.',
      });
    }

    // find projects that match the specified category
    const projects = await Project.find({ category: category });

    if (projects.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No projects found matching the specified category.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Successfully retrieved projects matching the specified category.',
      data: projects,
    });
  } catch (error) {
    console.error('Error filtering projects by category:', error);
    res.status(500).json({
      success: false,
      message: 'Error filtering projects by category',
      error: error.message,
    });
  }
};
