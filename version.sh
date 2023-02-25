#!/usr/bin/env bash
version_file=src/app/app.globals.ts

CURRENT_VERSION=$(node -p "require('./package.json').version")
CURRENT_HOMEPAGE=$(node -p "require('./package.json').homepage")

CURRENT_DAY=$(date +"%d.")
CURRENT_MONTH=$(LC_ALL=de_DE.UTF-8 date +"%B");
CURRENT_YEAR=$(date +"%Y")
CURRENT_DATE="$CURRENT_DAY $CURRENT_MONTH $CURRENT_YEAR"


echo "Updating app globals...
"

> $version_file
echo "// THIS IS AN AUTO-GENERATED FILE. DO NOT CHANGE IT MANUALLY!
// Generated last time on $(date)

/**
 * The latest version of the AWG App
 */
export const appVersion = '$CURRENT_VERSION';

/**
 * The release date of the latest version of the AWG App
 */
export const appVersionReleaseDate = '$CURRENT_DATE';

/**
 * The URL of the AWG App
 */
export const appHomepage = '$CURRENT_HOMEPAGE';" >> $version_file


echo "Adding global file to git...
"

git add $version_file

echo "Updated app globals to
... version: $CURRENT_VERSION
... version date: $CURRENT_DATE
... homepage: $CURRENT_HOMEPAGE


Done."