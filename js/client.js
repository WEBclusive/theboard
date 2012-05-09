// Initialize client side
if (Meteor.is_client) {
    // Load projects
    Template.board.projects = function () {
        return Projects.find({}, {sort: {status: 1, displayName: 1}});
    };
    Template.board.display = function () {
        var toggled = Session.get('toggled');
        if (toggled === 'both' || toggled === 'board') {
            return 'block';
        }
        return 'none';
    };

    // Load issues
    Template.support.count = function () {
        return Issues.find().count();
    };
    Template.support.urgentCount = function () {
        return Issues.find({priority: 6}).count();
    };
    Template.support.highCount = function () {
        return Issues.find({priority: 5}).count();
    };
    Template.support.normalCount = function () {
        return Issues.find({priority: 4}).count();
    };
    Template.support.lowCount = function () {
        return Issues.find({priority: 3}).count();
    };
    Template.support.issues = function () {
        return Issues.find({priority: {$in: [5, 6]}}, {sort: {priority: -1, time: -1}});
    };
    Template.support.display = function () {
        var toggled = Session.get('toggled');
        if (toggled === 'both' || toggled !== 'board') {
            return 'block';
        }
        return 'none';
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
    Template.toggle.events = {
        'click': function() {
            var toggled = Session.get('toggled');
            if (toggled === 'board') {
                Session.set('toggled', 'support');
            } else if (toggled === 'support') {
                Session.set('toggled', 'both');
            } else {
                Session.set('toggled', 'board');
            }
        }
    };
}