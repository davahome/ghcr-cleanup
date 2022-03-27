module.exports = async ({github, input}) => {
    console.log("Deleting old versions from " + input.owner + "/" + input.package);
    console.log("Keeping (at least) " + input.keep_versions + " versions");
    console.log("Will skip images that are older than ${{ input.minimum_days }} days");
    console.log("Skipping images with tags ${{ input.skip_tags }}");

    const keepVersions = 0 + input.keep_versions;
    const skipTags     = input.skip_tags.split(',');
    const minimumAge   = new Date(new Date().setDate(new Date().getDate() - input.minimum_days));
    const response     = await github.request("GET /" + input.owner + "/packages/container/" + input.package + "/versions", {
        per_page: 100,
        page:     1
    });

    let versionCount = 0;
    let deleteCount  = 0;
    for (version of response.data) {
        // skip this version
        if (++versionCount < keepVersions) {
            continue;
        }

        const dateUpdated = new Date(version.updated_at);

        let message = version.id + " (Last Update: " + version.updated_at + ")";
        message += " (" + ((version.metadata.container.tags.length > 0) ? "Tags: " + version.metadata.container.tags.join(', ') : "Untagged") + ")";

        // image is too young
        if (dateUpdated >= minimumAge) {
            console.log("Skipping " + message + ": too young");
            continue;
        }

        // image has tags (that should be skipped)
        if (skipTags.length > 0 && version.metadata.container.tags.length > 0) {
            if (version.metadata.container.tags.some(item => skipTags.includes(item))) {
                console.log("Skipping " + message + ": contains a skip tag");
                continue;
            }
        }

        console.log("Deleting " + message);
        const deleteResponse = await github.request("DELETE /" + input.owner + "/packages/container/" + input.package + "/versions/" + version.id, {});
        if (deleteResponse.status >= 200 && deleteResponse.status < 300) {
            console.log("Successfully deleted");
            deleteCount++;
        }
    }
    console.log("Deleted " + deleteCount + " images");
}
