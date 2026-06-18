# Test and Playtest Checklist

## Graph Interaction

- Can the player place a machine?
- Can the player move a machine?
- Can the player connect compatible ports?
- Are incompatible ports rejected?
- Is the rejection understandable?
- Can the player delete or repair a connection?

## Production

- Does iron ore enter the crusher?
- Does the crusher produce crushed iron ore?
- Does the washer accept crushed iron ore and water?
- Does the washer produce washed iron ore?
- Does the washer produce dirty water?
- Does blocked dirty water stop or warn correctly?
- Does connecting dirty water handling resume production?
- Does the final output complete the objective?

## Diagnostics

- Are errors local?
- Does the diagnostic identify the machine or port?
- Does the diagnostic suggest a repair action?
- Does the diagnostic disappear when fixed?

## Performance / Feel

- Does dragging feel responsive?
- Does connecting ports feel reliable?
- Does the graph remain readable?
- Does successful production have visible feedback?
- Does objective completion feel clear?

## Regression Checks

- Existing valid graph still works.
- Existing invalid graph still reports useful diagnostics.
- No new unapproved machines were added.
- No new unapproved resources were added.
- Production logic remains outside renderer components.
