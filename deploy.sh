#!/usr/bin/env bash
source $HOME/.virtualenvs/h3calc/bin/activate

# Exit on error. Append "|| true" if you expect an error.
set -o errexit
# Exit on error inside any functions or subshells.
set -o errtrace
# Do not allow use of undefined vars. Use ${VAR:-} to use an undefined VAR
set -o nounset
# Catch the error in case mysqldump fails (but gzip succeeds) in `mysqldump |gzip`
set -o pipefail
# Turn on traces, useful while debugging but commented out by default
# set -o xtrace

# Set magic variables for current file, directory, os, etc.
__dir="$(cd "$(dirname "${BASH_SOURCE[${__b3bp_tmp_source_idx:-0}]}")" && pwd)"
__file="${__dir}/$(basename "${BASH_SOURCE[${__b3bp_tmp_source_idx:-0}]}")"
__base="$(basename "${__file}" .sh)"

cd ${__dir}
git add --all
git commit -m "A commit before deployment" || true
git branch -D heroku
git checkout -b heroku
git reset 129291abcdebb44e1f9f0ddb52ca34ce51b4d7e2
npm run build
echo '/node_modules/' > .gitignore
echo '/.idea/' >> .gitignore
rm -r src/
rm deploy.sh
rm gulpfile.js
rm package.json
rm -f package-lock.json
rm run_devel.sh
rm webpack.config.js
git add --all
git commit -m "Heroku."
# git push heroku heroku:master --force
git push origin heroku --force
