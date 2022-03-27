module.exports = async ({github, inputs}) => {
    const shouldDeleteUntagged = (0 + input.delete_untagged) > 0;

    if (!shouldDeleteUntagged) {
        console.log("Delete of untagged images is disabled. Set 'delete_untagged':1 to enable it");
    } else {
        const keepVersions = 0 + input.keep_versions_untagged;

        console.log("Checking package " + input.owner + "/" + input.package + " for untagged versions");
        console.log("Keeping (at least) " + keepVersions + " untagged versions");

        const response = await github.request("GET /" + input.owner + "/packages/container/" + input.package + "/versions", {
            per_page: 100
        });

        let deleteCount  = 0;
        let versionCount = 0;
        for (version of response.data) {
            const hasTags = version.metadata.container.tags.length !== 0;
            if (hasTags) {
                continue;
            } else if (++versionCount <= keepVersions) {
                continue;
            }

            console.log("delete " + version.id + " (Created at: " + version.created_at + ")");
            const deleteResponse = await github.request("DELETE /" + input.owner + "/packages/container/" + input.package + "/versions/" + version.id, {});
            if (deleteResponse.status >= 200 && deleteResponse.status < 300) {
                console.log("Successfully deleted");
                deleteCount++;
            }
        }
        console.log("Deleted " + deleteCount + " untagged images");
    }
}
