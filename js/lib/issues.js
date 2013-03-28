// Issues collection
var Issues = new Meteor.Collection("issues");

// Issues count history collection
var IssuesCountHistory = new Meteor.Collection("issuesCountHistory");

// Version Issues collection
var VersionIssues = new Meteor.Collection("versionIssues");

// Version Issues Count Collection
var IssuesCountVersion = new Meteor.Collection("issuesCountVersion");

// Stores current version
var CurrentVersion = new Meteor.Collection("currentVersion");

var CurrentVersionName = new Meteor.Collection("currentVersionName");

CurrentVersionName.allow({
    insert: function (userId, doc) {
        return true;
    },
    update: function (userId, doc, fields, modifier) {
        return true;
    },
    remove: function (userId, doc) {
        return true;
    }
});


