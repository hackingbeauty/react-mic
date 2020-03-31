---
layout: article
title: Reusable Modal Architecture For Large-Scale DApps - Part 1
permalink: /reusable-modals-for-dapps-part-1
---

<figure class="center">
  <img class="promo-image" src="/assets/images/posts/reusable-modals/modal-snapshot.png" alt="Reusable modal snapshot" />
</figure>

{% include posts/reusable-modal-component/promo.html %}

## Introduction

A Modal is a fundamental piece of UX interaction used by nearly every application. If you're a professional developer of any sizeable application, you need to architect your Modals carefully so you can achieve greater scale.

I've seen a lot of technical debt get created because teams moved too quickly and didn't give any thought to the way they implemented Modals for their large-scale applications.  This can introduce a lot of pain and wasted time, especially for bigger teams.

In this tutorial, I'm going to show you how to architect a Modal for **maximum reusablility and configurability**.  The reusable Modal you're going to develop is designed for apps made with React and Redux; however, the principles are applicable to any application developed in UI components.

Check out how the Modal in this tutorial works by viewing the demo [here](https://hackingbeauty.github.io/reusable-react-modal-component).  If you just want to see the working code in action yourself, just clone this [repo](https://github.com/hackingbeauty/reusable-react-modal-component).

Let's begin!


## React-Bootstrap

So here's a little secret.  You don't have to write all the code for your UI components from scratch.  In fact, in many cases you simply shouldn't.  That's because you can tap into the work of 3rd party libraries when necessary.

A lot of designers today don't design everything from scratch.  They're leveraging design elements from pre-made UI component libraries like [React-Bootstrap](https://react-bootstrap.github.io/) and [Material-UI](http://www.material-ui.com/).

Wrapping your components around pre-made component libraries will save you a ton of development time.  In this tutorial, I'm going to show you how to leverage and enhance React-Bootstrap's [Modal component](https://react-bootstrap.github.io/components/modal/).

But while React-Bootstrap will give you a functional Modal with a base-level of design, it won't help you integrate it into a large-scale application.  Not to fret, you're going to learn how to do that shortly.

<figure class="center">
  <img src="/assets/images/posts/reusable-modals/react-bootstrap-logo.png" alt="React Bootstrap Logo" />
  <div class="caption"><a href="https://react-bootstrap.github.io/" target="_blank">React-Bootstrap</a> - A very popular 3rd party UI Library</div>
</figure>


## Requirements

Before we officially define our requirements, let's step back and think about how our reusable and highly customizable Modal should work.

First, we should have three distinct sections in our Modal.  There's going to be the the Header, then the Body, and finally the Footer.

<figure class="full-width">
  <img class="no-shadow" src="/assets/images/posts/reusable-modals/modal-sections.png" alt="Sections of reusable Modal component" />
</figure>

In most applications, certain elements in the Modal's Header and Footer will be standardized and consistent across the entire application.  For example, there should always be a "cancel" or "close" link in the Modal's Footer.

But in some cases, you many want to override the default behavior of certain sections. So we're going to provide a set of standard defaults when applicable; however, we will also allow the developer to customize any aspect of the Modal.

So let's now explicitly state a few key requirements (you can always expand on these).

#### Requirement 1

A Modal should have a standard "Cancel" link in the bottom left-hand corner.  This should appear by default.

<figure class="full-width">
  <img class="no-shadow" src="/assets/images/posts/reusable-modals/standard-cancel-link.png" alt="Cancel link of reusable Modal component" />
</figure>

#### Requirement 2

If desired, the Modal's Header and Footer should be customizeable.  Meaning, a developer should be able to add any desired text, elements, button, icons, etc. to either the Modal's Header or its Footer.

<figure class="full-width">
  <img class="no-shadow" src="/assets/images/posts/reusable-modals/customized-footer.png" alt="Customized footer of reusable Modal component" />
</figure>

#### Requirement 3

The Modal should have a standard width and UI.  However, a CSS Module should be an option that can be passed in as a prop to the Modal component that can override any default styling (like overriding the width of the Modal for example).

<figure class="full-width">
  <img class="no-shadow" src="/assets/images/posts/reusable-modals/customized-width.png" alt="Customized width of reusable Modal component" />
</figure>

If you're not aware what [CSS Modules](https://github.com/css-modules/css-modules) are and you're not currently utilizing them in your application, you're definitely missing out!  Seriously, using CSS Modules as part of your CSS architecture reaps dividends upon dividends.  I show developers how to integrate CSS Modules into large-scale applications in my [course](http://singlepageapplication.com).

#### Requirement 4

The developer should be required to pass the Modal's contents into the body of the Modal.  After all, the point of a Modal is for the user to do or see something.  So the Modal should have content.

For the sake of brevity, these are all the requirements for now.  Like I said, you can always expand on these requirements in any way that suits you.

## Next Steps

Next, you're going to see how the underlying Modal architecture works and how it's integrated with Redux.

Next Steps - [The Modal Architecture](/reusable-modals-for-dapps-part-2).
