// Initialize client side
if (Meteor.is_client) {
    // Load projects
    Template.board.projects = function () {
        return Projects.find({}, {sort: {status: 1, displayName: 1}});
    };

    // Setup click events
    Template.board.events = {
        'click #add-project': Board.create
    };
    Template.project.events = {
        'click .displayName': Board.editName
    };
}