# Todo TODO

1. Add PATCH support for lists/items
1. DONE - Add support for creating list items
1. Don't require position when creating items/lists.
   1. Calculate it on the back-end
   1. Still require it for updates unless we do PATCH support.
1. Add component for List Item viewing.
   1. Only show 'itemText' in this view.
   1. Show createdAt/createdBy here.
   1. Allow deleting from this view. Return to parent when delete succeeds.
1. Include support for notes/text
   1. Add section/task support
   1. sections can have sub-items, but are not themselves completable
1. Add support for marking list items as complete/uncomplete
1. Add drag-and-drop support for list items
1. Add support for adding nested child items to sections/tasks
   1. Should there be a recursion limit...?
1. Add support for changing an item's parent to another task/section within the same list.
1. Add support for deleting items
1. Make it prettier.
1. Add sort method for putting completed items after pending items.
1. Hide completed items by default, and then add button to show/hide.
1. Add target/due dates
1. Add actual user table
1. Add login/session support
1. Add Favorite/Starred support for lists?
1. Add ability to search for specific tasks/lists
1. Add sort button to sort pending/completed items alphabetically
   1. Should help in deduplication
   1. Could just be a front-end sort
