---
layout: article
title: Reusable Modal Architecture For Large-Scale DApps - Part 5
permalink: /reusable-modals-for-dapps-part-5
---

<figure class="center">
  <img class="promo-image" src="/assets/images/posts/reusable-modals/modal-snapshot.png" alt="Reusable modal snapshot" />
</figure>

{% include posts/reusable-modal-component/promo.html %}

## The ModalBody Component

When you display a Modal to users, you either want to alert them to something or you want to allow them to do something.  In one view, a Modal may display a form so a user can set or retrieve data.  In another view, a Modal is displayed to alert a user that he's about to perform a destructive action.

So each unique Modal must contain customized content to display.  Without that content there's no point in displaying a Modal.

So that leads us to the ```ModalBody``` sub-component of our general architecture (full code [here](https://gist.github.com/hackingbeauty/b6a55acd344a3124d563bc4b5202ab23)).

### The Render Method

In the ```render()``` method of the ```ModalBody``` component, we're going to simply wrap and render React Bootstrap's ```<ReactBootstrapModal.Body>``` component and pass in the ```children```.

```javascript
import { Modal as ReactBootstrapModal } from 'react-bootstrap'

...

render() {
  const { children } = this.props

  return (
    <div className={styles}>
      <ReactBootstrapModal.Body>
        {children}
      </ReactBootstrapModal.Body>
    </div>
  )
}

...

ModalBody.propTypes = {
  children: PropTypes.node.isRequired
}

...
```

Make a note that we're making the ```children``` prop required in the ```PropTypes```.  Like I said, if we're displaying a Modal there has to be something in it so the ```children``` prop is mandatory.

That's it for this sub-component.  It's very simple.

## Next Steps

Next, let's review the code for the ```ModalFooter```, the final sub-component in our Modal architecture.

Next Steps - [The ModalFooter Component](/reusable-modals-for-dapps-part-6).
