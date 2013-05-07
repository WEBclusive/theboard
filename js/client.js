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
    Template.versionBar.currentVersion = function () {

        var versionName = CurrentState.findOne({name: "dev-version"});

        if (versionName == undefined){
            return 'undefined';
        }

        var versionInfo = ProjectVersions.findOne({name: { $regex: '.*'+versionName.value+'.*', $options: 'i' }});

        if (versionInfo == undefined){
            return 'undefined';
        }

        return versionInfo.name;
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
        return Parser.parseImportanceData();
    };


    // Initialize chart
    Meteor.startup(Chart.setup);
    Meteor.startup(StatusChart.setup);
}

Parser = {
    parseImportanceData: function () {
        var issueCount = IssuesCountVersion.findOne({});
        var mh, sh, nh, ot;
        var importance = [];

        if (issueCount == undefined) {
            return importance;
        }

        var mustHave   = issueCount.importance['must have'];
        var shouldHave = issueCount.importance['should have'];
        var niceHave   = issueCount.importance['nice to have'];
        var other      = issueCount.importance['other'];

        importance.push(Parser.parseImportanceNumbers(mustHave, "Must Have"));
        importance.push(Parser.parseImportanceNumbers(shouldHave, "Should Have"));
        importance.push(Parser.parseImportanceNumbers(niceHave, "Nice to Have"));
        importance.push(Parser.parseImportanceNumbers(other, "Other"));

        console.log(importance);
        return importance;
    },

    parseImportanceNumbers: function (importanceData, name) {

        return {
            name: name,
            total: importanceData.total,

            new: importanceData.new,
            percentage_new: Parser.calculatePercentage(importanceData.new, importanceData.total),

            pending: importanceData.pending,
            percentage_pending: Parser.calculatePercentage(importanceData.pending, importanceData.total),

            in_progress: importanceData.in_progress,
            percentage_in_progress: Parser.calculatePercentage(importanceData.in_progress, importanceData.total),

            feedback: importanceData.feedback,
            percentage_feedback: Parser.calculatePercentage(importanceData.feedback, importanceData.total),

            closed: importanceData.closed,
            percentage_closed: Parser.calculatePercentage(importanceData.closed, importanceData.total)
        }

    },

    calculatePercentage: function (value, total) {

        if (value == 0) return false;

        return (value * 100) / total
    }
};
