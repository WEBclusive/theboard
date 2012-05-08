// Initialize client side
if (Meteor.is_client) {
    // Load projects
    Template.board.projects = function () {
        return Projects.find({}, {sort: {status: 1, displayName: 1}});
    };

    // Load issues
    Template.support.issues = function () {
        return Issues.find({priority: {$in: [5, 6]}}, {sort: {priority: -1, date: -1}});
    };
    Template.support.count = function () {
        return Issues.find().count();
    };

    // Setup click events
    Template.board.events = {
        'click #add-project': Board.create
    };
    Template.project.events = {
        'click .displayName': Board.editName,
        'click .staging': Board.editStaging,
        'click .production': Board.editProduction
    };
}