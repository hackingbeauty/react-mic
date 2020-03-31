---
layout: article
title: Reusable Modal Architecture For Large-Scale DApps - Part 3
permalink: /reusable-modals-for-dapps-part-3
---

<figure class="center">
  <img class="promo-image" src="/assets/images/posts/reusable-modals/modal-snapshot.png" alt="Reusable modal snapshot" />
</figure>

{% include posts/reusable-modal-component/promo.html %}

## The Main Modal Component

So now that we reviewed the basic architecture of our reusable Modal component, let's get into the code.

If you would like a working demo of the entire Modal component, clone this [repo](https://github.com/hackingbeauty/reusable-react-modal-component) which contains the [demo](https://hackingbeauty.github.io/reusable-react-modal-component/#/) for this tutorial series.  Once you've done that open the file titled ```Modal.js``` located in the following directory: ```/src/components/modal```.  This is the main parent ```Modal``` component.

<figure class="center">
  <img src="/assets/images/posts/reusable-modals/reusable-react-modal-component-directory-view.png" alt="Reusable modal component directory in Github repo" />
</figure>

I'll only be going over the high level points of this main ```Modal``` component and all other related sub-components such as ```ModalHeader```, ```ModalBody```, and ```ModalFooter```.

(Here is a quick [gist](https://gist.github.com/hackingbeauty/ef9562d6c03dcf6b182c8b45bffac22b) of the full code for the main ```Modal```component we're about to review.)

### The Render Method

Let's first look at the ```render()``` method of the ```Modal``` component.  This is always a good point to start when reviewing React components.

```javascript
import { Modal as ReactBootstrapModal } from 'react-bootstrap'
...

render() {
  const { show } = this.state
  const { className, cssModule, children } = this.props
  const mergedStyles = modalStyles + ' ' + cssModule

  return (
    <ReactBootstrapModal
      onHide={this.handleClose}
      show={show}
      className={mergedStyles}
      dialogClassName={className}>
      {children}
    </ReactBootstrapModal>
  )
}

...
```

Remember that we're leveraging React-Bootstrap's [Modal component](https://react-bootstrap.github.io/components/modal/) so we don't have to write everything from scratch.  All we're doing in this method is rendering React-Bootstrap's Modal component that we renamed to ```ReactBootstrapModal```, and passing in the necessary props.

Right out of the box, this gives us a fully functional Modal.  Note the ```{children}``` prop passed into ```ReactBootstrapModal``` in the code snippet above.  This prop lets us pass child components like ```<ModalHeader>```, ```<ModalBody>```, and ```<ModalFooter>``` as illustrated in the code snippet below.

```javascript
<Modal
  modalKey="modal-example-3"
  modalState={ui.Modal}>
  <ModalHeader title="Modal 3 Header Title" />
  <ModalBody>Modal 3 body</ModalBody>
  <ModalFooter />
</Modal>
```

So that's a huge chunk of logic.  Our main component is simply wrapping React-Bootstrap's Modal component and displaying it.

### Utilizing The Unique Key

As explained in [part 2](/reusable-modals-for-large-scale-react-applications-part-2) of this tutorial series, the unique key is one of the two main pieces of information necessary for our scalable Modal architecture.  Let's see how it gets used.

Take a look at the ```getDerivedStateFromProps()``` lifecycle hook in the code snippet below that's in our main Modal component.  This method was introduced in [React 16.3.x](https://medium.com/@baphemot/whats-new-in-react-16-3-d2c9b7b6193b) and replaces the soon to be deprecated lifecycle hook ```componentWillReceiveProps()```.


```javascript
...

static getDerivedStateFromProps(nextProps) {
  const { modalKey, modalState } = nextProps

  if (modalKey === modalState.modalKey) {
    return { show: modalState.showModal }
  }

  return { show: false }
}

...
```

The first thing you'll notice is that ```getDerivedStateFromProps()``` is a static method.  This means it's a method that exists on the **class** and not the instance of this component.  So you won't have access to the ```this``` keyword.

Now, in this method we're getting the current Modal component instance's ```modalKey```, and we're comparing it to the modalKey passed in by the ```modalState``` prop.  Remember, the ```modalState``` prop is data maintained by Redux (or whatever application state management system you're using) and contains information regarding which Modal should be open.

If the two values match, then the Modal opens by setting the ```show``` state variable to true.  This logic is the most important piece of this entire architecture, and if you understand it you can integrate this Modal into your own applications.

### Setting The Child Context

React has an advanced [Context API](https://reactjs.org/docs/context.html) that lets you pass data through the component tree without having to pass props down manually at every level.  This is very useful when you can't pass props directly from parent to child.

To use this API in order to automatically pass props downwards, we must implement the ```getChildContext()``` method in our Modal component, and we must declare which props should be made available throughout the component tree (```modalKey``` and ```handleClose```).


```javascript
...

getChildContext() {
  const { modalKey} = this.props
  return {
    modalKey,
    handleClose: this.handleClose
  }
}

...
```

We also have to add the ```childContextTypes``` to make this work.

```javascript
...

Modal.childContextTypes = {
  handleClose: PropTypes.func,
  modalKey: PropTypes.string
}
...

```

Now the ```handleClose``` function and the ```modalKey``` props will be available to all descendant components!  This will be very useful in the ```ModalFooter``` and you'll understand why shortly.


### The Exports File

Finally, take a look at the ```index.js``` file inside of the ```src/components/modal``` folder.  This is referred to as the "exports" file and the following is what's inside.

```javascript
export { default as Modal }        from './Modal'
export { default as ModalHeader }  from './ModalHeader'
export { default as ModalBody }    from './ModalBody'
export { default as ModalFooter }  from './ModalFooter'
```

When you create an exports file by placing ```index.js``` inside the root of a folder with many components, you create a sort of public interface.  This allows you to specifically export what should be made available to the rest of the application.

This clearly communicates what's available for public consumption from a directory of components.  It also communicates that all other components that are not in the exports file are "private" to that directory.

Also, you get the added benefit of simpler imports.  Using this pattern you can now import the Modal component like this:


```javascript
import { Modal } from 'components/modal'
```

Whereas if you didn't have an exports file, you'd have to import the Modal component like this:

```javascript
import { Modal } from 'components/modal/Modal'
```

Notice how the first way of importing looks cleaner?  This is a simple pattern very commonly used in large-scale applications that can improve the readability of the code.


## Next Steps

Next, we're goint to implement the ```ModalHeader``` which is going to be super simple.

Next Steps - [The ModalHeader Component](/reusable-modals-for-dapps-part-4).
