/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb');
var ObjectId = require('mongodb').ObjectID;
const _ = require("lodash");

const { Issue } = require("../models/Issue");

const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});

module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(async (req, res) => {
      const  project = req.params.project;
      
      try {
        const query = _.pick(req.query, [
          "issue_title",
          "issue_text",
          "created_by",
          "assigned_to",
          "status_text",
          "created_on",
          "updated_on",
          "open",
          "_id"
        ]);
        query.project_title = project;
        const issues = await Issue.find(query);
        res.json(issues);
      } catch (e) {
        res.status(400).json();
      }
    
    })
    
    .post(async (req, res) => {
      const project = req.params.project;
      
      try {
        const body = _.pick(req.body, ["issue_title", "issue_text", "created_by"]);

        if (Object.keys(body).length !== 3) {
          throw "please provide required fields";
        }

        const newIssue = new Issue({
          project_title: project,
          issue_title: req.body.issue_title,
          issue_text: req.body.issue_text,
          created_by: req.body.created_by,
          assigned_to: req.body.assigned_to || "",
          status_text: req.body.status_text || ""
        });

        const issue = await newIssue.save();
        res.json({
          issue_title: issue.issue_title,
          issue_text: issue.issue_text,
          created_by: issue.created_by,
          assigned_to: issue.assigned_to,
          status_text: issue.status_text,
          created_on: issue.created_on,
          updated_on: issue.updated_on,
          open: issue.open,
          _id: issue._id
        })
      } catch (e) {
        res.status(400).json();
      }

    })
    
    .put(async (req, res) => {
      const project = req.params.project;

      try {
        const body = _.pick(req.body, ["issue_title", "issue_text", "created_by", "assigned_to", "status_text"]);

        if (req.body._id.trim() === "") {
          throw "no _id field sent";
        }

        if (Object.keys(body).length === 0) {
          throw "no updated field sent";
        }

        body.updated_on = new Date().toISOString();

        await Issue.findByIdAndUpdate(req.body._id, { $set: body });
        res.json({
          message: "successfully updated"
        });
      } catch (e) {
        if (e === "no updated field sent") {
          res.status(400).json({
            message: "no updated field sent"
          });
        } else if (e === "no _id field sent") {
          res.status(400).json({
            message: "no _id field sent"
          });
        }else {
          res.status(400).json({
            message: `could not update ${req.body._id}`
          });
        }
      }
      
    })
    
    .delete(async (req, res) => {
      const project = req.params.project;
      
      try {
        const body = _.pick(req.body, ["_id"]);
        if (Object.keys(body).length === 0) {
          throw "_id error";
        }

        await Issue.findByIdAndRemove(req.body._id);
        res.json({
          success: 'deleted '+ req.body._id
        });
      } catch (e) {
        if (e === "_id error") {
          res.status(400).json({
            failed: "_id error"
          })
        } else {
          res.status(400).json({
            failed: 'could not delete '+ req.body._id
          })
        }
      }

    });
    
};
