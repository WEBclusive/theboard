// Jenkins model
Jenkins = {
    // The URL without a traling slash
    url: '',

    // Retrieve project status
    updateProjectStatus: function(project) {
        // Fetch project info
        Meteor.http.get(
            Jenkins.url + '/job/' + project.name + '/api/json',
            function (error, result) {
                var data = Jenkins.parseResponseData(result);
                if (data === false) {
                    return;
                }

                // Update project display name
                if (data.property !== undefined && data.property instanceof Array) {
                    for (var i in data.property) {
                        if (data.property[i].wallDisplayName !== undefined && data.property[i].wallDisplayName !== null) {
                            Projects.update({_id: project._id}, {$set: {displayName: data.property[i].wallDisplayName}});
                        }
                    }
                }

                // Fetch build info
                Meteor.http.get(Jenkins.url + '/job/' + project.name + '/' + data.lastBuild.number + '/api/json', function(error, result) {
                    var data = Jenkins.parseResponseData(result);
                    if (data === false) {
                        return;
                    }

                    Projects.update(
                        {_id: project._id},
                        {$set: {status: (data.building) ? 'building' : data.result.toLowerCase()}}
                    );
                });
            }
        );
    },

    // Parse response json data
    parseResponseData: function (result) {
        if (result.statusCode !== 200) {
            return false;
        }
        return JSON.parse(result.content);
    }
};
