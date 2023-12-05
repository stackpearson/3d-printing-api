const mongo = require('mongoose');

const projectSchema = mongo.Schema(
    {
        customerName: {
            type: String,
            required: [true, "Please provide your name"]
        },
        customerEmail: {
            type: String,
            required: [true, "Please provide your email"]
        },
        itemDescription: {
            type: String,
            required: [true, "Please describe your product"]
        },
        projectStatus: {
            type: String,
            required: true,
            default: 'intake'
        },
        employeeNotes: {
            type: String,
            required: false,
            default: null
        }

    },
    {
        timestamps: true
    }
)

const Project = mongo.model('project', projectSchema);
module.exports = Project;