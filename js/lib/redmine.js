// Redmine synchronizer
var Redmine = {
    // The URL without a trailing slash and credentials
    url: '',
    auth: '',

    // Update issues
    updateIssues: function() {
        // Fetch all issues that should be displayed
        Meteor.http.get(
            Redmine.url + '/issues.json?' + Redmine.filter,
            {auth: Redmine.auth},
            function (error, result) {
                var data = Redmine.parseResponseData(result);
                if (data === false) {
                    return;
                }

                // Retrieved issue IDs
                var retrievedIds = [];

                // Update issues in database
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
                        displayTime: Redmine.createRelativeDateString(data.issues[i].created_on)
                    };

                    // See if this issue exists already
                    var issue = Issues.findOne({id: issueObject.id});
                    if (issue !== undefined) {
                        Issues.update({id:issueObject.id}, issueObject);
                    } else {
                        Issues.insert(issueObject);
                    }

                    // Keep track of the retrieved issues
                    retrievedIds.push(issueObject.id);
                }

                // If there are any issues in the database that we
                // haven't retrieved, they can be consider resolved.
                // Remove them.
                Issues.remove({id: {$nin: retrievedIds}});

                // Update the counts
                Redmine.updateIssueCounts();
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
        var allCounts = IssuesCountHistory.find({}, {date: -1});
        allCounts.forEach(function (counts) {
            if (i >= 14) {
                IssuesCountHistory.remove({_id: counts._id});
            }
            i++;
        });
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
    }
};