---
layout: article
title: Reusable Modal Architecture For Large-Scale DApps - Part 6
permalink: /reusable-modals-for-dapps-part-6
---

<figure class="center">
  <img class="promo-image" src="/assets/images/posts/reusable-modals/modal-snapshot.png" alt="Reusable modal snapshot" />
</figure>

{% include posts/reusable-modal-component/promo.html %}

## The ModalFooter Component

The ```ModalFooter``` is the last sub-component of our architecture.  You can review the full code for this sub-component [here](https://gist.github.com/hackingbeauty/fb53e4b80fde876f88cb3b41d6ca727c).

### The Render Method

Similar to what we did in the ```ModalHeader``` and ```ModalBody``` sub-components, we're simply wrapping and rendering React Bootstrap's Modal Footer (```ReactBootstrapModal.Footer```).

```javascript
import { Modal as ReactBootstrapModal } from 'react-bootstrap'

...

render() {
    const content = this.getContent()

    return (
      <div className={modalFooterStyles}>
        <ReactBootstrapModal.Footer>
          {content}
        </ReactBootstrapModal.Footer>
      </div>
    )
  }

...
```

The ```getContent()``` method that gets called compiles the content that gets rendered, and it makes use of the ```children``` prop like this:

```javascript
...

getContent=() =>{
  const { children } = this.props

  return (
    <div>
      <div onClick={this.onCancel} className="cancel-btn btn btn-link">Cancel</div>
      <div className="custom-modal-footer-actions">{children}</div>
    </div>
  )
}

...
```

Remember that when we defined our requirements in [part 1](/reusable-modals-for-large-scale-react-applications-part-1/), we stated that we always wanted a "Cancel" link in the bottom left-hand corner.  We've added this link in the ```getContent()``` method as illustrated in the code snippet above.

<figure class="full-width">
  <img class="no-shadow" src="/assets/images/posts/reusable-modals/standard-cancel-link.png" alt="Close link of reusable Modal component" />
</figure>


Also, our requirements specify that custom content or elements can be passed to the footer, such as in the snapshot below.

<figure class="full-width">
  <img class="no-shadow" src="/assets/images/posts/reusable-modals/customized-footer.png" alt="Customized footer of reusable Modal component" />
</figure>

Because we're making use of the ```children``` prop in the ```getContent()``` method, we're able to do that.

In the end, a customized ```ModalFooter``` will be implemented like this.

```javascript
<Modal
  modalKey="modal-example-4"
  modalState={modalState}
  closeAction={actions.ui.closeModal}>
  <ModalFooter>
    <input type="button" value="Do Something" onTouchTap={() => alert('Do something!')} />
  </ModalFooter>
</Modal>
```

See how customizable this is?

### The handleClose Action

When a user clicks the "Cancel" link, the Modal should close.  Since we're making use of React's Context API, we automatically inherit the ```handleClose()``` function from the context that we specified in the main parent ```Modal``` component.

```javascript
...
onCancel=() => {
  const { handleClose } = this.context
  handleClose()
}
...
```

Note: ```handleClose()``` is really just a wrapper for the ```closeAction``` prop that calls a Redux Action Creator (or whatever dispatcher you're using) to change the state of the Modal from open to closed.


```javascript
...
closeModal = () => {
  // Logic to close the Modal, usually a Redux Action Creator
}
...

<Modal
  modalKey="modal-example-3"
  modalState={ui.Modal}
  closeAction={this.closeModal}>
  <ModalHeader title="Modal 3 Header Title" />
  <ModalBody>Modal 3 body</ModalBody>
  <ModalFooter />
</Modal

...
```

That's it for all of the sub-components in our general Modal architecture.

If you're confused about anything, the best thing to do is just see the working code.  So go over to the [demo repo](https://github.com/hackingbeauty/reusable-react-modal-component), clone it, and inspect the code yourself!

## Next Steps

If you've made it this far, congratulations!  Next, lets see how to customize the styling of our Modal component with CSS Modules.  Then we'll call it a wrap!

Next Steps - [BONUS: Using CSS Modules](/reusable-modals-for-dapps-part-7).
