---
path: /integrity
title: Integrity
order: 1
image: ../images/integrity.png
---

## 1. One Graph

Your company should have *one unified graph*, rather than each team creating their own graph.

By having one graph you maximize the value of GraphQL:

* More data and services can be accessed from a single query
* Code, queries, skills, and experience are portable across teams
* There is one central catalog of all available data that all graph users can look to
* Implementation cost is minimized, because graph implementation work isn't duplicated
* Central management of the graph – for example, unified access control policies – becomes possible

When this principle is not followed and teams create their own individual graphs without coordinating their work, it is all but inevitable that their graphs will begin to overlap, adding the same data to the graph in incompatible ways. At best this is costly to rework; at worst it creates chaos. So this principle should be put in place as early in a company's data graph adoption journey as possible.

## 2. Federated Implementation

Though there is only one graph, the implementation of that graph should be *federated* across multiple teams.

Monolithic architectures don't scale and data graphs are no exception. Rather than a single central codebase that implements the organization's entire data graph layer, responsibility for defining and implementing the graph should be divided across multiple teams. Each team should be responsible for maintaining the portion of the schema that exposes their data and services, while having the flexibility to develop independently and operate on their own release cycle.

This maintains the value of a single, unified view of the graph, while keeping development efforts across the company decoupled.

## 3. Track the Schema in a Registry

There should be a *single source of truth* that defines the makeup of the graph.

Just as it is important to track source code in a version control system, it is important to track the definition of your graph in a schema registry. There should be a single schema registry for your entire company and it should be considered the authoritative definition of the graph – rather than the graph being defined by whatever processes are running at the moment or whatever code is checked on on a developer's laptop. And like a source control system, the schema registry should store the history of changes to the graph and who made them, and it should understand the concept of multiple versions of the graph (such as staging and production, or different development branches) in a way that parallels the software development process.

The schema registry should then become the central hub of the system, powering any developer tools, workflows, or business processes that would benefit from being aware of the data graph and any actual or proposed changes to it.

