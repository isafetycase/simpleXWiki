= simpleXWiki version 1.0 =

Root XWiki version: 5.3

Author: Marc Sackeli

Release Date: 4/21/2014

= Motivation =
simpleXWiki's core comprises a set of modifications to the XWiki base UI which allow users to turn on and off certain parts of the XWiki interface.  Many of the modifications in simpleXWiki are driven by a desire to simplify the interface options provided to the user. Our user base is one that has no need for things like multiple types of exportation, or even the need to understand the notion of what a space or a page is. Thus, rather than present a host of choices and menus that they will never use, we decided to create methods to prune these interface elements when desired. Using the simpleXWikiControl.vm file, you can build logic around when to show various parts of your interface.  You'll also find a few options for inserting content in certain areas (adjacent to user profile menu, next to the annotations menu, etc).  

= Modifications =

For a detailed listing of the modifications made and options provided in simpleXWiki, please refer to the spreadsheet "simpleXWiki Modifications" in the root directory.  The modifications can be controlled through the simpleXWikiControl.vm file found in the templates directory. By default, all of the options are disabled so that the wiki operates in line with the source XWiki version out of the box.

Below is a list of all of the files that were modified in this release of simpleXwiki.

== Templates ==
code.vm
contentmenu.vm
contentview.vm
docextra.vm
editmeta.vm
footer.vm
global.vm
hierarchy.vm
htmlheader.vm
javascript.vm
login.vm
*loginForm.vm
menuview.vm
pdfhtmlheader.vm
shortcuts.vm
*simpleXWikiControl.vm
stylesheets.vm
xwikivars.vm

* indicates new template file

== Pages ==
XWiki.Results
AnnotationCode.Script (Annotation Application js extension bug fix for query string persistence during AJAX operations.)

