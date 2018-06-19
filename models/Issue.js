const mongoose = require("mongoose");

const IssueSchema = new mongoose.Schema({
    project_title: {
        type: String,
        required: true,
        trim: true,
        minlength: 1
    },
    issue_title: {
        type: String,
        required: true,
        trim: true,
        minlength: 1
    },
    issue_text: {
        type: String,
        required: true,
        trim: true,
        minlength: 1
    },
    created_by: {
        type: String,
        required: true,
        trim: true,
        minlength: 1
    },
    assigned_to: {
        type: String,
        default: ""
    },
    status_text: {
        type: String,
        default: ""
    },
    created_on: {
        type: Date, 
        default: Date.now
    },
    updated_on: {
        type: Date, 
        default: Date.now 
    },
    open: {
        type: Boolean,
        default: false
    }
});

const Issue = mongoose.model("Issue", IssueSchema);

module.exports = { Issue };