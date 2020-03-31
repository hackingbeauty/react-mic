---
layout: article
title: Reusable Modal Architecture For Large-Scale DApps - Part 4
permalink: /reusable-modals-for-dapps-part-4
---

<figure class="center">
  <img class="promo-image" src="/assets/images/posts/reusable-modals/modal-snapshot.png" alt="Reusable modal snapshot" />
</figure>

{% include posts/reusable-modal-component/promo.html %}

## The ModalHeader Component

The ```ModalHeader``` sub-component is super straight forward.  It's not mandatory to use, but if you do it will display a title (a.k.a. call to action) for the entire Modal.  It can also display any other custom elements that you wish to have.

By creating a separate ```ModalHeader``` component we give developers the ability to customize this section of the Modal in any way.

You can review the entire code for this component in this [gist](https://gist.github.com/hackingbeauty/cde96054fd5e6428666702e04af98db1) or clone the [demo repo](https://github.com/hackingbeauty/reusable-react-modal-component).

### The Render Method

First, to make this work we need to render React Bootstrap's own Modal Header by wrapping it as follows:

```javascript
...
import { Modal as ReactBootstrapModal } from 'react-bootstrap'
...

render() {
  const { children, title } = this.props

  return (
    <div className={modalHeaderStyles}>
      <ReactBootstrapModal.Header>
        <ReactBootstrapModal.Title>{title}</ReactBootstrapModal.Title>
        {children}
      </ReactBootstrapModal.Header>
    </div>
  )
}

...
```

So in the main ```render()``` method we're just wrapping ```<ReactBootstrapModal.Header>``` and then passing ```children``` as props.

### Customization

Because we're passing the ```children``` prop in ```ModalHeader```, we can make this component customizable like this:

```javascript
<Modal
  modalKey="modal-example-3"
  modalState={modalState}>
  <ModalHeader title="Modal 3 Header Title">
    // Custom header content and elements go here
  /ModalHeader>
</Modal>
```

Let's say you wanted to add an "x" icon in the upper-right hand corner of the header.

<figure class="full-width">
  <img class="no-shadow" src="/assets/images/posts/reusable-modals/customized-header.png" alt="Modal with customized header - has X icon in header" />
</figure>

All you'd have to do is pass in an element into the ```ModalHeader``` component like this:

```javascript
<Modal
  modalKey="modal-example-3"
  modalState={ui.Modal}>
  <ModalHeader title="Customized Modal Header">
    <i className="x-icon">X</i>
  </ModalHeader
 />
</Modal>
```

That's all the ```ModalHeader``` sub-component needs to do for now.

## Next Steps

Next, we're going to implement the ```ModalBody``` component, another very straightforward sub-component of our reusable Modal architecture.

Next Steps - [The ModalBody Component](/reusable-modals-for-dapps-part-5).
