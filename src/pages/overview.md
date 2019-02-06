---
path: /
title: Overview
order: 0
---

Why is GraphQL becoming so popular? It's because GraphQL, despite the name, isn't simply a query language. It's a comprehensive solution to the problem of connecting modern apps to services in the cloud. As such, it forms the basis for a new and important layer in the modern application development stack. At Apollo, we call this new layer the data graph. Its function is to bring all of a company's app data and services together in one place, with one unified, consistent, secure, and easy-to-use interface, so that anyone can draw on it as needed with minimal friction.

A data graph allows data from many disparate sources to be accessed in a single query. But the benefits don't end there. A well-built data graph layer can solve many common engineering problems once, in a high quality way, rather than having to reinvent solutions for each new feature that is developed. Security, access tracking, development workflows, performance monitoring, and operational concerns such as caching can all be centrally and consistently handled across all data sources and apps – and with configuration rather code. This is all enabled by the declarative nature of GraphQL, meaning that a user of a data graph only has to specify what should happen, leaving it to the graph layer to figure out the right way to do it.

This data graph architecture is rapidly becoming an essential part of the modern application stack, driven by several factors:

* the increased number and complexity of apps
* ever increasing expectations for the UI of these apps
* the ever expanding universe of services that these apps must connect to, including the proliferation of microservices
* the need to deliver these apps across a variety of platforms simultaneously 

It is difficult to solve these problems in a scalable or sustainable way without introducing a data graph layer, which is why we are seeing the move to this technology across a wide range of industries, from media, to ecommerce, to financial services.

This rapid adoption creates a need for more information about how to “do GraphQL right”. The GraphQL specification only describes the syntax of a GraphQL query, not how to to build or use a data graph, in the same way that the SQL specification only describes how to parse SQL statements, not how to build or use a relational database. What is needed are established best practices for the entire data graph layer, and for an industry-wide vocabulary that enables us to have crisp and detailed conversations about these best practices. 

At Apollo, we've been building industry leading data graph technology since 2015, and our software is now used in over 90% of GraphQL implementations. We've had hundreds of conversations with GraphQL users of all shapes and sizes. So we've distilled their experiences into a set of best practices for creating, maintaining, and operating a data graph. We present them here as 10 GraphQL Principles in a format inspired by the [Twelve Factor App](https://12factor.net).

The 10 principles break down into three categories:

* 3 Integrity Principles: Ensuring that the graph is well-defined, stable, and consistent.
* 4 Agility Principles: Rapidly rolling out the graph and continuously evolving it to adapt to changing needs.
* 3 Operations Principles: Trusted implementation of the graph in production at scale.
