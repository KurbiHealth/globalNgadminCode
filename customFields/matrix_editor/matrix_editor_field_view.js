/*
getReadWidget:   DISPLAYED IN listView AND showView
getLinkWidget:   DISPLAYED IN listView AND showView WHEN isDetailLink IS TRUE 
getFilterWidget: DISPLAYED IN THE FILTER FORM IN THE listView
getWriteWidget:  DISPLAYED IN editionView AND creationView
*/

export default {
    getReadWidget:   () => '<matrix-editor field="::field" value="::value" datastore="::datastore" viewtype="show" entity="::entity"></matrix-editor>',
    getLinkWidget:   () => 'error: cannot display array of strings field as linkable',
    getFilterWidget: () => 'error: cannot display array of strings field as filter',
    getWriteWidget:  () => '<matrix-editor field="::field" value="::value" datastore="::datastore" viewtype="edit" form="::form" entity="::entity"></matrix-editor>'
}