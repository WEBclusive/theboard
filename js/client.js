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
        return Issues.find({priority: {$nin: [5, 6]}, time: {$gt: since}}, {sort: {time: -1}}).fetch().slice(0, 10);
    };
    Template.version.currentVersion = function () {
        return Redmine.getCurrentVersion();
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
    Template.version.events = {
        'click .bar': Board.editCurrentVersion
    };

    // Version count
    Template.importanceInfo.importance = function () {
        var issueCount = IssuesCountVersion.findOne({});
        var mh, sh, nh, ot;
        var importance = [];

        if (issueCount == undefined) {
            return importance;
        }

        mustHave   = issueCount.importance['must have'];
        shouldHave = issueCount.importance['should have'];
        niceHave   = issueCount.importance['nice to have'];
        other      = issueCount.importance['other'];

        importance.push({
            name: "Must Have",
            total: mustHave.total,
            closed: mustHave.closed,
            percentage: (mustHave.closed * 100) / mustHave.total
        });

        importance.push({
            name: "Should Have",
            total: shouldHave.total,
            closed: shouldHave.closed,
            percentage: (shouldHave.closed * 100) / shouldHave.total
        });

        importance.push({
            name: "Nice to Have",
            total: niceHave.total,
            closed: niceHave.closed,
            percentage: (niceHave.closed * 100) / niceHave.total
        });

        importance.push({
            name: "Other",
            total: other.total,
            closed: other.closed,
            percentage: (other.closed * 100) / other.total
        });

        return importance;
    };

    // Initialize chart
    Meteor.startup(Chart.setup);
    Meteor.startup(StatusChart.setup);

//    Deps.autorun(function () {
//        Meteor.subscribe("current-version", {version: Session.get("currentVersion")});
//    });


}
