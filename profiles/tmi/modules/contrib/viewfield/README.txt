About

The Viewfield module defines an entity reference field type to display a view. Viewfield enables an administrator or content author to integrate a views display into any fieldable entity, such as content, users or paragraphs. In addition, through the use of the <em>Always use default value</em> setting, the same view may automatically be placed into all entities in a bundle. Viewfield has considerable theming support, making it easy to customize presentation. See the <em>Field module help</em> and the <em>Field UI help</em> pages for general information on fields and how to create and manage them. For more information, see the <a href="https://www.drupal.org/node/1210138">online documentation for the Viewfield module</a>.'
Uses

Managing and displaying Viewfields
The <em>settings</em> and the <em>display</em> of the Viewfield can be configured separately. See the <em>Field UI help</em> topic for more information on how to manage fields and their display.'

Adding a Viewfield
Edit the content or other entity type and navigate to the <em>Manage Fields</em> tab. Choose <em>+ Add Field</em> and select <em>Viewfield</em> under the <em>Reference</em> category. Choose the number of field values (distinct view displays) you want to store and press <em>Save Field Settings</em>.

Assigning field values
Assigning a value (or default value) to a Viewfield consists of selecting a View and Display from the select boxes, and providing an optional comma-delimited list of arguments (contextual filters) for the display. The argument list may contain tokens. Token help is available by clicking on the <em>Browse available tokens</em> link shown below the arguments field.

Always use default value setting
In <em>field settings</em>, checking <em>Always use default value</em> means the Viewfield will always use the provided default value(s) when rendering the field, and this field will be hidden in all entity edit forms, making it unnecessary to assign values individually to each piece of content. Nice! If this is checked, a default value <strong>must</strong> be provided.

Allowed views setting
In <em>field settings</em>, check one or more views to restrict the views available for content authors. Leave all items unchecked to allow all views.

Allowed view display types setting
In <em>field settings</em>, check one or more display types to restrict the view display types available for content authors. Leave all items unchecked to allow all display types.

View title setting
On the <em>Manage display</em> page are options to render the view display title in the output. Choose from <em>Above</em>, <em>Inline</em>, <em>Hidden</em>, <em>Visually Hidden</em>.

Always build output setting
On the <em>Manage display</em> page is a setting to produce renderable output even if the view produces no results. This option may be useful for some specialized cases, e.g., to force rendering of an attachment display even if there are no view results.

Empty view title setting
On the <em>Manage display</em> page are options to output the view display title even when the view produces no results. Choose from <em>Above</em>, <em>Inline</em>, <em>Hidden</em>, <em>Visually Hidden</em>. This option has an effect only when <em>Always build output</em> is selected.

Twig theming
Viewfield provides default theming with the <code>viewfield.html.twig</code> and <code>viewfield-item.html.twig</code> templates, which may each be overridden. Enable Twig debugging to view file name suggestions in the rendered HTML.

CSS styling
In addition to the core field CSS classes, Viewfield adds <code>field__item__label</code> for view titles. Because Drupal core does not provide default styling for fields, Viewfield likewise does not provide any CSS styles. Themes must provide their own styling for the <code>field__item__label</code> class.
