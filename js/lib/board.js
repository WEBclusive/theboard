// Board functionality
var Board = {
    // Update project statuses
    updateProjectStatuses: function() {
        var projects = Projects.find();
        projects.forEach(function (project) {
            Jenkins.updateProjectStatus(project);
        });
    },

    // Create a new project
    create: function() {
        var name = prompt('Specify the name used in Jenkins');
        if (name !== null) {
            Projects.insert({name: name, displayName: name, status: 'unknown'});
        }
    },

    // Prompt for a new name
    editName: function() {
        var oldName = (this.name !== undefined) ? unescape(this.name) : '';
        var name = prompt('Specify the name used in Jenkins. Clear it to remove it.', oldName);
        if (name === '') {
            Projects.remove({_id: this._id});
            return;
        }
        if (name !== null) {
            Projects.update({_id: this._id}, {$set: {name: escape(name), displayName: name}});
        }
    }
};