console.log("Deleting old versions from ${{ inputs.owner }}/${{ inputs.package_name }}");
console.log("Keeping (at least) ${{ inputs.keep_versions }} versions");
console.log("Will skip images that are older than ${{ inputs.minimum_days }} days");
console.log("Skipping images with tags ${{ inputs.skip_tags }}");

const skipTags   = "${{ inputs.skip_tags }}".split(',');
const minimumAge = new Date(new Date().setDate(new Date().getDate() - "${{ inputs.minimum_days }}"));
const response   = await github.request("GET /${{ inputs.owner }}/packages/container/${{ inputs.package_name }}/versions", {
    per_page: 0 + "${{ inputs.keep_versions }}",
    page:     2
});

let deleteCount = 0;
for (version of response.data) {
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
    const deleteResponse = await github.request("DELETE /${{ inputs.owner }}/packages/container/${{ inputs.package_name }}/versions/" + version.id, {});
    if (deleteResponse.status >= 200 && deleteResponse.status < 300) {
        console.log("Successfully deleted");
        deleteCount++;
    }
}
console.log("Deleted " + deleteCount + " images");
