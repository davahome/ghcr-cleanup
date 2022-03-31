module.exports = async ({github, input}) => {
    // Check if feature is enabled
    const shouldDeleteUntagged = (0 + input.delete_untagged) > 0;
    if (!shouldDeleteUntagged) {
        console.log("Delete of untagged images is disabled. Set 'delete_untagged':1 to enable it");
        return;
    }

    const keepVersions = 0 + input.keep_versions_untagged;
    console.log("Checking package " + input.owner + "/" + input.package + " for untagged versions");
    console.log("Keeping (at least) " + keepVersions + " untagged versions");

    const response = await github.request("GET /" + input.owner + "/packages/container/" + input.package + "/versions", {
        per_page: 100,
        page:     1
    });

    let deleteCount  = 0;
    let versionCount = 0;
    for (version of response.data) {
        // Check for "keepVersions" amount and skip first results
        if (++versionCount <= keepVersions) {
            continue;
        }

        let message = version.id + " (Created at: " + version.created_at + ")";
        message += " (" + ((version.metadata.container.tags.length > 0) ? "Tags: " + version.metadata.container.tags.join(', ') : "Untagged") + ")";

        // Check if this version has tags
        const hasTags = version.metadata.container.tags.length !== 0;
        if (hasTags) {
            console.log("Skipping " + message + ": has tags");
            continue;
        }

        // Delete this version
        try {
            console.log("Deleting " + message);
            const deleteResponse = await github.request("DELETE /" + input.owner + "/packages/container/" + input.package + "/versions/" + version.id, {});
            if (deleteResponse.status >= 200 && deleteResponse.status < 300) {
                console.log("Successfully deleted");
                deleteCount++;
            }
        } catch (e) {
            console.error("Delete of " + message + " failed due to error: ", e);
        }
    }
    console.log("Deleted " + deleteCount + " untagged images");
}
