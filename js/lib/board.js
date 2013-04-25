// Board functionality
Board = {

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
            Projects.insert({name: name, displayName: name, status: 'unknown', staging: '-', production: '-'});
        }
    },

    // Prompt for a new name
    editName: function() {
        var oldName = (this.name !== undefined) ? decodeURI(this.name) : '';
        var name = prompt('Specify the name used in Jenkins. Clear it to REMOVE the project.', oldName);
        if (name === '') {
            Projects.remove({_id: this._id});
            return;
        }
        if (name !== null) {
            Projects.update({_id: this._id}, {$set: {name: encodeURI(name), displayName: name}});
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
    },

    // Prompt for a new staging version
    editCurrentVersion: function() {
        var currentVersion = (CurrentState.findOne({name: "dev-version"}) == undefined)? CurrentState.findOne({name: "dev-version"}):'';
        var version = prompt('What is the current version in Development?', currentVersion);

        Meteor.call('setVersion', version);
//        if (version !== null) {
//            if (CurrentState.findOne({name: "dev-version"}) == undefined) {
//                CurrentState.insert({ name: "dev-version", value: version });
//            } else {
//                CurrentState.update({ name: "dev-version" }, { $set: { value: version }});
//            }
//        }
    }
};
