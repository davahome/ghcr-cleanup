# ghcr-cleanup

A GitHub Action for cleaning up old Containers from ghcr.io


## Examples

**Delete images of the personal user package "ghcr.io/thedava/example" that are older than 14 days (but keep at least 30 versions)**
```yaml
name: Cleanup Registry
on:
  workflow_dispatch:
  registry_package:
  
jobs:
  delete-images:
    runs-on: ubuntu-latest
    steps:
      - name: Delete images older than 14 days (but keep at least 30 versions)
        uses: DavaHome/ghcr-cleanup@v0.3
        with:
          # The regular ${{ GITHUB_TOKEN }} is not enough. Create a separate token and store it as secret
          packages_token: ${{ secrets.PACKAGES_TOKEN }}
          minimum_days: 14
          keep_versions: 30
          package_name: example
          # Owner is always "user" (not your name)
          owner: user
          # Use this if you want to limit your untagged images no matter how old they are
          #delete_untagged: 1
          #keep_untagged_versions: 14
```

**Delete images of the organization package "ghcr.io/DavaHome/example" that are older than 7 days (but keep at least 5 versions)**
```yaml
name: Cleanup Registry
on:
  workflow_dispatch:
  registry_package:
  
jobs:
  delete-images:
    runs-on: ubuntu-latest
    steps:
      - name: Delete images older than 7 days (but keep at least 5 versions)
        uses: DavaHome/ghcr-cleanup@v0.3
        with:
          # The regular ${{ GITHUB_TOKEN }} is not enough. Create a separate token and store it as secret
          packages_token: ${{ secrets.PACKAGES_TOKEN }}
          minimum_days: 7
          keep_versions: 5
          package_name: example
          # Owner can be an organization as well (but has to be prefixed with "orgs/" then)
          owner: orgs/DavaHome
          # Use this if you want to limit your untagged images no matter how old they are
          #delete_untagged: 1
          #keep_untagged_versions: 14
```

## Token permission requirements

* read:packages
* write:packages
* delete:packages
