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

    // Load connectivity
    Template.connectivity.status = function() {
        return Meteor.status().status;
    };
    Template.connectivity.reconnectTime = function() {
        if (Meteor.status().retry_time !== undefined) {
            var date = new Date(Meteor.status().retry_time);
            var hours = date.getHours();
            var minutes = date.getMinutes();
            var seconds = date.getSeconds();
            return ((hours < 10) ? '0' : '') + hours + ((minutes < 10) ? ':0' : ':') + minutes + ((seconds < 10) ? ':0' : ':') + seconds;
        }
        return false;
    };
    Template.connectivity.reconnectCount = function() {
        return Meteor.status().retry_count;
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

    // Initialize chart
    Meteor.startup(Chart.setup);
}