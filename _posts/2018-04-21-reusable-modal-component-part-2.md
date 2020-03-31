---
layout: article
title: Reusable Modal Architecture For Large-Scale DApps - Part 2
permalink: /reusable-modals-for-dapps-part-2
---

<figure class="center">
  <img class="promo-image" src="/assets/images/posts/reusable-modals/modal-snapshot.png" alt="Reusable modal snapshot" />
</figure>

{% include posts/reusable-modal-component/promo.html %}

## The Modal Architecture

So how is our scalable Modal architecture going to work?  There are two main pieces of information that will be mandatory for our Modal architecture to work: a unique key and what I call Modal state.  Let me explain.


## A Unique Key

The first piece of information required is a unique key that will be given to each Modal component instance.  This key will uniquely identify each Modal and be passed in as a prop called ```modalKey```.

```javascript
<Modal
  modalKey="modal-key-x"
</Modal>
```

Why is a unique key necessary?  Let's say we want to have multiple Modals in one view (all *reusing* the same standardized Modal component).  Each Modal displays different content, so they're all different.  How do we tell the application which one of these Modals should be displayed?

<figure class="full-width">
  <img src="/assets/images/posts/reusable-modals/modal-1-view.png" alt="Reusable modal 1 view" />
</figure>

<figure class="full-width">
  <img src="/assets/images/posts/reusable-modals/modal-2-view.png" alt="Reusable modal 2 view" />
</figure>

<br />

Answer: the application will know which Modal should be open because of its unique key.  That's the first piece of information our Modal architecture needs, a unique key identifying each Modal.


## Modal State

The second piece of information that we need is Modal state.  By Modal state I mean data that represents which Modal with a given key should be open at any given time.  It should be represented as an object that includes the Modal key and whether or not it's open or closed.

```javascript
{
  modalKey: 'modal-key-1',
  showModal: true/false
}
```

**Important**: this Modal state information must be stored in a state management system for the entire application (I prefer using [Redux](https://redux.js.org/)).  It will be passed in as a prop called ```modalState``` to the Modal component like this:


```javascript
const modalState = this.props.Modal // { modalKey: "modal-key-x",
                                         showModal: true }
<Modal
  modalKey="modal-key-1"
  modalState={modalState}
</Modal>
```

And a Modal state change will be triggered by an Action Creator or some sort of Dispatcher like this:

```javascript
<input
  type="button"
  data-modal-key="modal-example-1"
  onClick={() => {
    actions.ui.openModal({modalKey: 'modal-key-1'})
  }}
/>
```

These a unique and Modal state are the main two pieces of information that are required to implement a scalable Modal architecture.

The trick of course is knowing how to effectively manage the entire UI state of a large-scale application.  So before we move onto reviewing the code for our Modal component(s), let's briefly talk about [managing the UI state](https://codeburst.io/how-to-manage-ui-state-with-redux-24deb6cf0d57) of an entire application with a superior design pattern like Redux.

### Application State Management

When you develop a professional front-end for a large-scale application, you have to manage its state properly.  To clarify, "state" refers to both the data that is flowing throughout an application, and also the visual state of things.

What do I mean by "visual state of things"?  For example, is a Left-Nav toggled open or closed?  Is the currently logged in user's name displayed in the header?  Is a Modal getting displayed or not?

These are all visual cues for the user and they're all part of what we call "the state of the application".  You need to manage this effectively, and the design pattern that's currently very popular for large-scale applications is [Redux](https://github.com/reduxjs/react-redux).

When you use Redux, the entire state of your application is contained within one big object in memory.  This one object describes the current state of your UI, gets fed into React components, and tells your application how it should appear at any point in time.

So whether or not a Modal is open or closed is UI information that will be managed globally by Redux and maintained in memory in one central object.

<figure class="full-width">
  <img src="/assets/images/posts/reusable-modals/voice-record-pro-modal.png" alt="Modal in Voice Record Pro - www.voicerecordpro.com" />
  <div class="caption">This is <a href="http://voicerecordpro.com" target="_blank">Voice Record Pro</a>.  I show developers how to develop it in my <a href="/">course</a>.  The 3rd party library used in the course is <a href="http://www.material-ui.com/" target="_blank">Material-UI</a>.</div>
</figure>

Explaining how to use Redux is beyond the scope of this tutorial.  If you aren't already familiar with it, I highly recommend you learn and apply it to your own large-scale application because it's a *very* effective design pattern that will help you scale.

If you need a good resource to learn Redux, check out my course [How To Write A Single Page Application](http://singlepageapplication.com) for Front-End Engineers and Developers, and my course [How To Write A React Decentralized Application For Ethereum](http://reactdapps.com) for Blockhain Developers.  I teach Redux in depth in those two courses!

You can also read my tutorial ["How To Manage UI State With Redux"](https://codeburst.io/how-to-manage-ui-state-with-redux-24deb6cf0d57) where I share a lot of UI architecture goodies.

## Next Steps

Next, we're going to review the code for our main parent ```Modal``` component.  There are other sub-components as well that we will use like ```ModalHeader```, ```ModalBody```, and ```ModalFooter```.  We will review those too.

Next Steps - [The Main Modal Component](/reusable-modals-for-dapps-part-3).
