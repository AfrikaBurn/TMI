CONTENTS OF THIS FILE
---------------------
 * Introduction
 * Requirements
 * Installation
 * Configuration
 * Maintainers


INTRODUCTION
------------

A simple clientside hierarchical select widget for taxonomy terms.

It works by replacing the standard select input element with a hierarchical set
of select input via javascript.

It provides three settings:
 * "Force selection of deepest level" (If checked the user will be forced to
   select terms from the deepest level.)
 * "Parent" (Allows to select a parent term to use only a subtree of a
   vocabulary for this field.)
 * "Labels per hierarchy-level"


REQUIREMENTS
------------

As the module is a widget for entity reference fields, the taxonomy module is
required.


INSTALLATION
------------

 * Install as you would normally install a contributed drupal module. See:
   https://drupal.org/documentation/install/modules-themes/modules-7


CONFIGURATION
-------------

 * Choose the "Clientside hierarchical select" widget for your taxonomy field
 * Configure the widget at the field instance settings.


MAINTAINERS
-----------
Current maintainers:
 * Walter Jenner (valderama) - https://www.drupal.org/u/valderama
 * Julian Kempff (jkempff) - https://www.drupal.org/u/jkempff

This project has been sponsored by:
 * FORM & CODE, Munich - http://www.formundcode.de
