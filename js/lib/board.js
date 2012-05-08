// Board functionality
var Board = {
    // Update project statuses
    updateProjectStatuses: function() {
        var projects = Projects.find();
        projects.forEach(function (project) {
            Jenkins.updateProjectStatus(project);
        });
    },

    // Update issues
    updateIssues: function() {
        Redmine.updateIssues();
    },

    // Create a new project
    create: function() {
        var name = prompt('Specify the name used in Jenkins');
        if (name !== null) {
            Projects.insert({name: name, displayName: name, status: 'unknown', staging: '-', production: '-'});
        }
    },

    // Prompt for a new name
    editName: function() {
        var oldName = (this.name !== undefined) ? unescape(this.name) : '';
        var name = prompt('Specify the name used in Jenkins. Clear it to REMOVE the project.', oldName);
        if (name === '') {
            Projects.remove({_id: this._id});
            return;
        }
        if (name !== null) {
            Projects.update({_id: this._id}, {$set: {name: escape(name), displayName: name}});
        }
    },

    // Prompt for a new staging version
    editStaging: function() {
        var oldVersion = (this.staging !== undefined) ? this.staging : '';
        var version = prompt('Specify the staging version deployed.', oldVersion);
        if (version !== null) {
            Projects.update({_id: this._id}, {$set: {staging: version}});
        }
    },

    // Prompt for a new production version
    editProduction: function() {
        var oldVersion = (this.staging !== undefined) ? this.production : '';
        var version = prompt('Specify the production version deployed.', oldVersion);
        if (version !== null) {
            Projects.update({_id: this._id}, {$set: {production: version}});
        }
    }
};