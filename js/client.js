// Initialize client side
if (Meteor.is_client) {
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
    Template.support.newIssues = function () {
        var since = new Date();
        since.setDate(since.getDate() - 3);
        return Issues.find({priority: {$nin: [5, 6]}, time: {$gt: since}}, {sort: {time: -1}});
    };

    // Load projects
    Template.builds.projects = function () {
        return Projects.find({}, {sort: {status: 1, displayName: 1}});
    };

    // Setup click events
    Template.builds.events = {
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
            if (toggled === undefined || toggled === '') {
                $('#support').show();
                $('#issuesChart').show();
                $('#builds').hide();
                Session.set('toggled', 'support');
            } else if (toggled === 'support') {
                $('#support').hide();
                $('#issuesChart').hide();
                $('#builds').show();
                Session.set('toggled', 'builds');
            } else if (toggled === 'builds') {
                $('#support').show();
                $('#issuesChart').show();
                $('#builds').show();
                Session.set('toggled', '');
            }
        }
    };

    // Initialize issue chart
    Meteor.startup(Chart.setup);
}