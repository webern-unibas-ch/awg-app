#!/usr/bin/env bash
version_file=src/app/app.version.ts

curday=$(date +"%d.")
curmonth=$(LC_ALL=de_DE.UTF-8 date +"%B");
curyear=$(date +"%Y")

echo "Updating app version..."

> $version_file
echo "// THIS IS AN AUTO-GENERATED FILE. DO NOT CHANGE IT MANUALLY!
// Generated last time on $(date)
export const appVersion = '$1';
export const appVersionReleaseDate = '$curday $curmonth $curyear';" >> $version_file

echo "Adding version file to git..."

git add $version_file

echo "Updated app version to $1 ($curday $curmonth $curyear)
Done."
