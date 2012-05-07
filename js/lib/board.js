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
        var name = prompt('Specify the new project name');
        if (name !== null) {
            Projects.insert({name: name, status: 'unknown', staging: '-', production: '-'});
        }
    },

    // Prompt for a new name
    editName: function() {
        var name = prompt('Specify a new name for ' + this.name, this.name);
        if (name === '') {
            Projects.remove({_id: this._id});
            return;
        }
        if (name !== null) {
            Projects.update({_id: this._id}, {$set: {name: name}});
        }
    },

    // Prompt for a new slug
    editSlug: function() {
        var oldSlug = (this.slug !== undefined) ? unescape(this.slug) : '';
        var slug = prompt('Specify a new Jenkins slug for ' + this.name, oldSlug);
        if (slug !== null) {
            Projects.update({_id: this._id}, {$set: {slug: escape(slug)}});
        }
    },

    // Prompt for a new staging version
    editStaging: function() {
        var version = prompt('Specify the new version on staging for ' + this.name, this.staging);
        if (version !== null) {
            Projects.update({_id: this._id}, {$set: {staging: version}});
        }
    },

    // Prompt for a new production version
    editProduction: function() {
        var version = prompt('Specify the new version on production for ' + this.name, this.production);
        if (version !== null) {
            Projects.update({_id: this._id}, {$set: {production: version}});
        }
    }
};