Narrator
======

Forward
-------

The ambition of software development is to create a story that can be easily understood by both a person and a computer. Why not go all in and just write documents that can be read by both beast and machine? Donald Knuth calls this "Literate Programming".

I'm going to try to figure out how Literate Programming might work for web apps by making a web app for writing narrative web apps called Narrator. Here we go!

Chapter 1
---------

The basic interaction of Narrator is reading, writing, and running software. It's an `Ember app`. Ember is a neat new web framework that has a Narrative plugin.

This is the app's `index template`:

    # index template
    {{narrative_editor content=sample_narrative}}

In the `index route` it loads this `sample narrative`:

    # index route
    App.IndexRoute = Ember.Route.extend({
      content: sample_narrative
    });

    # sample narrative
    Welcome to Narrative.js
    -----------------------

    Go ahead and start editing!

    You can create a variable 

Narrator
--------

We need a something that lets our narratives interact with the computer. For this we
use a humble object:

    narrator = {}

We'll describe the tools that go on there in the next few chapters.


Defining an interface with a signal
-----------------------------------

In order for Narrator to be able to interpret a nice readable markdown document as
runnable code, the narrator object provides some functions that let you define "interfaces" that allow narratives to "come alive".

### Let's `test` it out.

First we'll register an interface with narrator:

    interface = narrator.registerInterface 'ember app'

Then we'll define a signal it can responds to:

    interface.addSignal
      pattern: 
        '(.*) template': ['name']
      action: (content) =>
        new File("templates/#{@name}.hbs").append content

Next we'll create a `test narrative`:

    There is an `ember app`. It has a `index template` with this in it:

        hello world!

And finally run it:

    narrator.run test_narrative

At this point we'll `test that the file exists`:

    fileToCheck = new File('templates/index.hbs')
    expect(fileToCheck.exists()).toBe true

And it contains the text:

    expect(fileToCheck.content()).toBe "hello world!"

### How it works

An interface is engaged whenver a pattern is mentioned in your narrative. Once engaged
it has a bunch of signals it listens for:

    Interface = ({pattern}) ->
      @signals = []

The register function creates an interface with the provided pattern and stores it
in a list:

    narrator.interfaces = []

    narrator.registerInterface = (pattern) ->
      @interfaces.push new Interface {pattern}

A signal also has a pattern that activates it, and it also has an "action" function that gets
run whenever that signal is mentioned:

    Signal = ({pattern, action}) ->
      @pattern = new RegExp pattern

    Interface.prototype.addSignal (options) ->
      @signalsnew Signal options

When we call "run" we parse through the narrative, executing signals as we go.

    narrator.run = (text) ->
      new SegmentSplitter(text).segments.each ({inputs, content}) =>
        matchingSignals = @signals.find (s) -> s.pattern.matchesAny(inputs)

        matchingSignals.each (signal) ->
          signal.handle inputs, content

And then finally deploys the app:

      @deploy()

Feature Ideas
-------------

* Mousing over a pattern should show the documentation: "When you write `[blah template]` an ember template will be created." Just swap in ['blah', 'blee', 'bloo'] in turn for the wildcards.