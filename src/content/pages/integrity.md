---
path: /integrity
title: Integrity Principles
description: Ensuring that the graph is well-defined, stable, and consistent
order: 1
image: ../images/integrity.png
---

## 1. One Graph

> Your company should have **one unified graph**, instead of multiple graphs created by each team.

By having one graph, you maximize the value of GraphQL:

* More data and services can be accessed from a single query
* Code, queries, skills, and experience are portable across teams
* One central catalog of all available data that all graph users can look to
* Implementation cost is minimized, because graph implementation work isn't duplicated
* Central management of the graph – for example, unified access control policies – becomes possible

When teams create their own individual graphs without coordinating their work, it is all but inevitable that their graphs will begin to overlap, adding the same data to the graph in incompatible ways. At best, this is costly to rework; at worst, it creates chaos. This principle should be followed as early in a company's data graph adoption journey as possible.

## 2. Federated Implementation

> Though there is only one graph, the implementation of that graph should be **federated** across multiple teams.

Monolithic architectures are difficult to scale without highly specialized infrastructure, and data graphs are no exception. Instead of implementing an organization's entire data graph layer in a single codebase, responsibility for defining and implementing the graph should be divided across multiple teams. Each team should be responsible for maintaining the portion of the schema that exposes their data and services, while having the flexibility to develop independently and operate on their own release cycle.

This maintains the value of a single, unified view of the graph, while keeping development efforts across the company decoupled.

## 3. Track the Schema in a Registry

> There should be a **single source of truth** for registering and tracking the graph.

Just like it's important to track source code in a version control system, it's important to track the definition of your graph in a schema registry. There should be a single schema registry for your company that is the authoritative definition of the graph, rather than relying on whatever processes are running at the moment or whatever code is checked in on a developer's laptop. Like a source control system, the schema registry should store the history of changes to the graph and who made them, and it should understand the concept of multiple versions of the graph (for example, staging and production, or different development branches) in a way that parallels the software development process.

The schema registry should become the central hub of the system, powering developer tools, workflows, or any business processes that would benefit from awareness of the data graph and any actual or proposed changes to it.

<!-- end -->
