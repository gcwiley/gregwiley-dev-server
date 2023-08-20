import { Issue } from '../models/issue.js';

// function to create a new issue - NEW ISSUE
export const newIssue = async (req, res) => {
  const issue = new Issue(req.body);

  try {
    await issue.save();
    res.status(201).send(issue);
  } catch (error) {
    res.status(400).send(error);
  }
};

// function to fetch all issues from database - ALL ISSUES
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

// function to fetch individual issue by ID - ISSUE BY ID
export const getIssueById = async (req, res) => {
  const _id = req.params.id;

  try {
    // filters by _id
    const issue = await Issue.findById({ _id });

    // if no issue is found
    if (!issue) {
      return res.status(404).send();
    }

    res.send(issue);
  } catch (error) {
    res.status(500).send();
  }
};

// function to update a issue by id - UPDATE ISSUE
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

    // send updated issue back to client
    res.send(issue);
  } catch (error) {
    res.status(400).send(error);
  }
};

// function to delete a issue by ID - DELETE ISSUE
export const deleteIssueById = async (req, res) => {
  try {
    // find and delete issue that takes id into account
    const issue = await Issue.findByIdAndDelete({
      _id: req.params.id,
    });

    // if no issue is found
    if (!issue) {
      res.status(404).send();
    }
    res.send(issue);
  } catch (error) {
    res.status(500).send();
  }
};

// function to count all Issuess - ISSUE COUNT
export const getIssueCount = async (req, res) => {
  try {
    // count all issues within database
    const issueCount = await Issue.countDocuments({});

    // if no issues are found
    if (!issueCount) {
      return res.status(404).send();
    }

    res.send(issueCount);
  } catch (error) {
    res.status(500).send();
  }
};

// function to get the 5 most recently create issues
export const getRecentlyCreatedIssues = async (req, res) => {
  try {
    const mostRecentIssues = await Issue.find({}).sort({ createdAt: -1 }).limit(5);

    if (!mostRecentIssues) {
      return res.status(404).send();
    }
    res.send(mostRecentIssues);
  } catch (error) {
    res.status(500).send();
  }
};