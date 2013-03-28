// Redmine synchronizer
var Redmine = {
    // The URL without a trailing slash and credentials
    url: '',
    auth: '',

    // Retrieved issues
    retrievedIds: [],

    // Update Issue collections
    updateIssues: function(offset) {
        Redmine.updateOverallIssues(offset);
        Redmine.updateVersionIssues();
    },

    // Update issues
    updateOverallIssues: function(offset) {
        // Set the offset
        offset = typeof offset !== 'undefined' ? offset : 0;
        var limit = 100;

        // Fetch all issues that should be displayed
        Meteor.http.get(
            Redmine.url + '/issues.json?limit=' + limit + '&offset=' + offset + Redmine.filter,
            {auth: Redmine.auth},
            function (error, result) {
                var data = Redmine.parseResponseData(result);
                if (data === false) {
                    return;
                }

                // Update issues in database
                var issuesCount = 0;
                for (var i in data.issues) {
                    // Construct the issue data object
                    var issueObject = {
                        id: data.issues[i].id,
                        title: data.issues[i].subject,
                        project: data.issues[i].project.name,
                        author: data.issues[i].author.name,
                        assignee: (data.issues[i].assigned_to !== undefined) ? data.issues[i].assigned_to.name : '',
                        priority: data.issues[i].priority.id,
                        priorityClass: data.issues[i].priority.name.toLowerCase(),
                        time: new Date(data.issues[i].created_on),
                        displayTime: Redmine.createRelativeDateString(data.issues[i].created_on),
                        importance: data.issues[i].importance,
                        custom_fields: data.issues[i].custom_fields,
                        fixed_version: data.issues[i].fixed_version
                    };

                    // See if this issue exists already
                    var issue = Issues.findOne({id: issueObject.id});
                    if (issue !== undefined) {
                        Issues.update({id:issueObject.id}, issueObject);
                    } else {
                        Issues.insert(issueObject);
                    }

                    // Increment count
                    issuesCount = issuesCount + 1;

                    // Keep track of the retrieved issues
                    Redmine.retrievedIds.push(issueObject.id);
                }

                // If the amount of issues we retrieved is lower than limit, we've fetched them all.
                // Update the counts and clear the state.
                if (issuesCount < limit) {
                    // If there are any issues in the database that we
                    // haven't retrieved, they can be consider resolved.
                    // Remove them.
                    Issues.remove({id: {$nin: Redmine.retrievedIds}});

                    // Clear state
                    Redmine.retrievedIds = [];

                    // Update the counts
                    Redmine.updateIssueCounts();
                }

                // If the amount is equal or higher than limit, call this method again with a higher
                // offset
                if (issuesCount >= limit) {
                    Redmine.updateIssues(offset + limit);
                }
            }
        );
    },

    // Update issues for current version
    updateVersionIssues: function() {

        var versionInfo = Redmine.getCurrentVersionInfo();

        if (versionInfo.name == undefined) {
            return;
        }

        // Fetch all issues that should be displayed
        Meteor.http.get(
            Redmine.url + '/issues.json?status_id=*&project_id=caas&fixed_version_id=' + versionInfo.id,
            {auth: Redmine.auth},
            function (error, result) {
                var data = Redmine.parseResponseData(result);
                if (data === false) {
                    return;
                }

                VersionIssues.remove({});

                // Update issues in database
                var issuesCount = 0;
                for (var i in data.issues) {
                    // Construct the issue data object
                    var issueObject = {
                        id: data.issues[i].id,
                        title: data.issues[i].subject,
                        project: data.issues[i].project.name,
                        author: data.issues[i].author.name,
                        assignee: (data.issues[i].assigned_to !== undefined) ? data.issues[i].assigned_to.name : '',
                        priority: data.issues[i].priority.id,
                        priorityClass: data.issues[i].priority.name.toLowerCase(),
                        time: new Date(data.issues[i].created_on),
                        displayTime: Redmine.createRelativeDateString(data.issues[i].created_on),
                        custom_fields: data.issues[i].custom_fields,
                        fixed_version: data.issues[i].fixed_version,
                        statusId: data.issues[i].status.id
                    };

                    _.each(data.issues[i].custom_fields, function(cf) {
                        var name = String(cf.name).toLowerCase();
                        issueObject[name] = cf.value;
                    });

                    // See if this issue exists already
                    var issue = VersionIssues.findOne({id: issueObject.id});
                    if (issue !== undefined) {
                        VersionIssues.update({id:issueObject.id}, issueObject);
                    } else {
                        VersionIssues.insert(issueObject);
                    }
                }

                Redmine.updateVersionIssueCounts();
            }
        );
    },

    // Update issue counts
    updateIssueCounts: function() {
        // Construct the counts object
        var countsObject = {
            date: Redmine.createCurrentDateString(),
            low: Issues.find({priority: 3}).count(),
            normal: Issues.find({priority: 4}).count(),
            high: Issues.find({priority: 5}).count(),
            urgent: Issues.find({priority: 6}).count()
        };

        // See if counts for this date exist already
        var counts = IssuesCountHistory.findOne({date: countsObject.date});
        if (counts !== undefined) {
            IssuesCountHistory.update({date: countsObject.date}, countsObject);
        } else {
            IssuesCountHistory.insert(countsObject);
        }

        // Only keep around 14 days of counts
        var i = 0;
        var allCounts = IssuesCountHistory.find({}, {sort: {date: -1}});
        allCounts.forEach(function (counts) {
            if (i >= 14) {
                IssuesCountHistory.remove({_id: counts._id});
            }
            i++;
        });
    },

    // Update issue counts
    updateVersionIssueCounts: function() {
        // Construct the counts object
        var counts = {
            status: {
                new:         VersionIssues.find({statusId: 1}).count(),
                pending:     VersionIssues.find({statusId: 7}).count(),
                in_progress: VersionIssues.find({statusId: 2}).count(),
                feedback:    VersionIssues.find({statusId: { $in: [ 3, 4 ] }}).count(),
                closed:      VersionIssues.find({statusId: { $in: [ 15, 5, 6, 8, 9, 14 ] }}).count()
            },
            importance: {
                "nice to have": {
                    total: VersionIssues.find({importance: "nice to have" }).count(),
                    closed: VersionIssues.find({ $and: [{importance: "nice to have"}, {statusId: { $in: [ 15, 5, 6, 8, 9, 14 ] }}] }).count()
                },
                "must have": {
                    total: VersionIssues.find({importance: "must have" }).count(),
                    closed: VersionIssues.find({ $and: [{importance: "must have"}, {statusId: { $in: [ 15, 5, 6, 8, 9, 14 ] }}] }).count()
                },
                "should have": {
                    total: VersionIssues.find({importance: "should have" }).count(),
                    closed: VersionIssues.find({ $and: [{importance: "should have"}, {statusId: { $in: [ 15, 5, 6, 8, 9, 14 ] }}] }).count()
                },
                "other": {
                    total: VersionIssues.find({importance: {$nin: [ "nice to have", "must have", "should have"  ]} }).count(),
                    closed: VersionIssues.find({ $and: [{importance: {$nin: ["nice to have", "must have", "should have"]} }, {statusId: { $in: [ 15, 5, 6, 8, 9, 14 ] }}] }).count()
                }
            }

        };

        var issue = IssuesCountVersion.findOne({});
        if (issue !== undefined) {
            IssuesCountVersion.update({}, counts);
        } else {
            IssuesCountVersion.insert(counts);
        }
    },

    // Parse response JSON data
    parseResponseData: function(result) {
        if (result.statusCode !== 200) {
            return false;
        }
        return JSON.parse(result.content);
    },

    // Create a current date string
    createCurrentDateString: function() {
        var now = new Date();
        var year = now.getFullYear();
        var month = now.getMonth() + 1;
        var day = now.getDate();
        if (month < 10) {
            month = '0' + month;
        }
        if (day < 10) {
            day = '0' + day;
        }
        return year + '-' + month + '-' + day;
    },

    // Create a relative date string
    createRelativeDateString: function(date) {
        var now = new Date();
        var then = new Date(date);
        var diff = now - then;
        var conversions = [
            ["years", 31518720000],
            ["months", 2626560000 /* assumes there are 30.4 days in a month */],
            ["days", 86400000],
            ["hours", 3600000],
            ["minutes", 60000]
        ];

        for (var i = 0; i < conversions.length; i++) {
            var result = Math.floor(diff / conversions[i][1]);
            if (result >= 2) {
                return result + " " + conversions[i][0] + " ago";
            }
        }

        return "less than a minute ago";
    },

    loadProjectVersions: function() {

        Meteor.http.get(
            Redmine.url + '/projects/caas/versions.json',
            {auth: Redmine.auth},
            function (error, result) {
                var data = Redmine.parseResponseData(result);
                if (data === false) {
                    return;
                }

                _.each(data.versions, function (version) {

                    var versionObject = {
                        id: version.id,
                        name: version.name,
                        dueDate: version.due_date
                    };

                    // Update or Insert
                    if (ProjectVersions.findOne({id: versionObject.id}) !== undefined) {
                        ProjectVersions.update({id:versionObject.id}, versionObject);
                    } else {
                        ProjectVersions.insert(versionObject);
                    }

                });
            }
        );
    },

    getCurrentVersionInfo: function() {

        var blankVersion = {id: '', name: 'undefined', dueDate: ''};

        var versionName = CurrentState.findOne({name: "dev-version"});

        if (versionName == undefined){
            return undefined;
        }

        var versionInfo = ProjectVersions.findOne({name: versionName.value});

        if (versionInfo == undefined){
            return undefined;
        }

        return versionInfo;

    }
};

Meteor.methods({
    setVersion: function (version) {

        if (CurrentState.findOne({name: "dev-version"}) == undefined) {
            CurrentState.insert({ name: "dev-version", value: version });
        } else {
            CurrentState.update({ name: "dev-version" }, { $set: { value: version }});
        }

        Redmine.updateVersionIssues();
    }
});
