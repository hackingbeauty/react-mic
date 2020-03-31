---
layout: article
title: Reusable Modal Architecture For Large-Scale DApps - Part 7
permalink: /reusable-modals-for-dapps-part-7
---

<figure class="center">
  <img class="promo-image" src="/assets/images/posts/reusable-modals/modal-snapshot.png" alt="Reusable modal snapshot" />
</figure>

{% include posts/reusable-modal-component/promo.html %}


## BONUS - Using CSS Modules

If you're not using [CSS Modules](https://github.com/css-modules/css-modules) in your application you're missing out.

CSS Modules let you scope your styling to individual UI components.  This is a very effective way of organizing CSS code for a large-scale application, in a way that increases order and removes confusion for developers.  It also helps mitigate CSS styling collisions.

Integrating CSS Modules into your application is beyond the scope of this tutorial series; however, if you need expert guidance on how to implement it check out [my course](/).


In this tutorial, we're interested in applying default styling to all of our sub-components in our Modal architecture.  In addition, we want to be able to override any default styles with customized styling when appropriate.


Let's learn how!


### Define Default Styling

First off, every sub-component in our Modal architecture is going to have its own CSS Module.  For example, the ```ModalFooter``` component has its own CSS Module with these styles.

```javascript
:local(.modalFooterStyles) {
  .cancel-btn {
    text-align: left;
    padding: 7px 0px 0px 0px;
    float: left;
  }

  .custom-modal-footer-actions {
    float: right;
  }
}
```


### Override Default Styling

What if we want to customize the default styling of a component?  All we do is create a separate CSS Module and pass it into the main parent ```Modal``` component.

For example, let's say we want to increase the width of a specific Modal.  The standard width looks like this:

<figure>
  <img class="no-shadow" src="/assets/images/posts/reusable-modals/modal-snapshot.png" alt="Reusable modal snapshot" />
</figure>

First, we create a separate CSS Module which defines styles for an element with a class name of ```.demo-modal-2```.  We want the width to be ```1000px```.

```javascript
:local(.demoModal2Styles) {
  .demo-modal-2 {
    width: 1000px;
  }
}
```

Next, we pass in the CSS Module into the ```Modal``` component instance and we give it a class name of ```demo-modal-2```.

```javascript
<Modal
  modalKey="modal-example-2"
  modalState={ui.Modal}
  className="demo-modal-2"
  cssModule={demoModal2Styles}>
  ...
</Modal>
```

Voila!  We've customized the width of the Modal.

<figure class="full-width">
  <img class="no-shadow" src="/assets/images/posts/reusable-modals/customized-width.png" alt="Customized width of reusable Modal component" />
</figure>

### Final Thoughts

Configuring CSS Modules for a large-scale application is done with Webpack which is an advanced JavaScript application topic.  You need to have a working understanding of Webpack in order to integrate CSS Modules into your React application.

If you want to see an expert Webpack configuration with CSS modules integrated, then take my video course ["How To Write A Single Page Application"](/) where I teach you how to configure and develop an expert React application for your clients or employer.

If you've made it this far, here's a 20% coupon code to get a discount on the course: ```20PERCENTOFF```.

Good job!
