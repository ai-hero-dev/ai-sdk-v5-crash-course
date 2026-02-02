set -e


claude --permission-mode acceptEdits "@plans/prd.json @progress.txt \
1. Find the highest-priority feature to work on and work only on that feature. \
This should be the one YOU decide has the highest priority - not necessarily the first in the list. \
2. Run pnpm ai-hero-cli internal lint to check for any linting errors. \
2a. Use npx tsc --noEmit to check for any type errors. \
There WILL be type errors, but many will be intentional - used as markers for the learner to find and fix. \
3. Update the PRD with the work that was done. \
4. Append your progress to the progress.txt file. \
Use this to leave a note for the next person working in the codebase. \
5. Make a git commit of that feature. \
ONLY WORK ON A SINGLE FEATURE. \
If, while implementing the feature, you notice the PRD is complete, output <promise>COMPLETE</promise>. \
"