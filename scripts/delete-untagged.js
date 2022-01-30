const shouldDeleteUntagged = (0 + "${{ inputs.delete_untagged }}") > 0;

if (!shouldDeleteUntagged) {
    console.log("Delete of untagged images is disabled. Set 'delete_untagged':1 to enable it");
} else {
    const keepVersions = 0 + "${{ inputs.keep_untagged_versions }}";

    console.log("Checking package ${{ inputs.owner }}/${{ inputs.package_name }} for untagged versions");
    console.log("Keeping (at least) " + keepVersions + " untagged versions");

    const response = await github.request("GET /${{ inputs.owner }}/packages/container/${{ inputs.package_name }}/versions", {
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
        const deleteResponse = await github.request("DELETE /${{ inputs.owner }}/packages/container/${{ inputs.package_name }}/versions/" + version.id, {});
        if (deleteResponse.status >= 200 && deleteResponse.status < 300) {
            console.log("Successfully deleted");
            deleteCount++;
        }
    }
    console.log("Deleted " + deleteCount + " untagged images");
}
