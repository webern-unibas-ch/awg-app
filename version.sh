#!/usr/bin/env bash
version_file=src/app/app.globals.ts

curday=$(date +"%d.")
curmonth=$(LC_ALL=de_DE.UTF-8 date +"%B");
curyear=$(date +"%Y")

echo "Updating app globals...
"

> $version_file
echo "// THIS IS AN AUTO-GENERATED FILE. DO NOT CHANGE IT MANUALLY!
// Generated last time on $(date)

/**
 * The latest version of the AWG App
 */
export const appVersion = '$1';

/**
 * The release date of the latest version of the AWG App
 */
export const appVersionReleaseDate = '$curday $curmonth $curyear';

/**
 * The URL of the AWG App
 */
export const appHomepage = '$2';" >> $version_file


echo "Adding global file to git...
"

git add $version_file

echo "Updated app globals to
... version: $1
... version date: $curday $curmonth $curyear
... homepage: $2


Done."
