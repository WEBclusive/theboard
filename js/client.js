// Initialize client side
if (Meteor.is_client) {
    // Load projects
    Template.board.projects = function () {
        return Projects.find({}, {sort: {status: 1, name: 1}});
    };

    // Setup click events
    Template.board.events = {
        'click #add-project': Board.create
    };
    Template.project.events = {
        'click .name': Board.editName,
        'click .status': Board.editSlug,
        'click .staging': Board.editStaging,
        'click .production': Board.editProduction
    };
}