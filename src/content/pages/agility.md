---
path: /agility
title: Agility Principles
description: Rapidly rolling out the graph and continuously adapting it to changing needs
order: 2
image: ../images/agility.png
---

## 4. Abstract, Demand-Oriented Schema

> The schema should act as an **abstraction layer** that provides flexibility to consumers while hiding service implementation details.

A large part of the value of GraphQL lies in providing an abstraction between services and consumers, so the schema should not be tightly coupled either to particular service implementations or to particular consumers as they exist today. By keeping implementation details out of the schema, it should be possible to refactor the services that implement the graph – for example, transitioning from a monolith to microservices, or changing the language in which a service is implemented – without disturbing apps in the field. Likewise, the schema shouldn't be tightly coupled to the way that particular apps fetch data. It should be possible to write new apps with minimal changes to the graph if their functionality is similar to that of existing apps.

To accomplish this, use the standard of a **demand-oriented** schema: a schema focused on providing a great developer experience to an app developer building a new feature against the existing graph. Aiming for this standard will help prevent the graph from becoming coupled to a service implementation that could change in the future, and help increase the reuse value of each field added to the graph.

## 5. Use an Agile Approach to Schema Development

> The schema should be **built incrementally** based on actual requirements and **evolve smoothly** over time.

It may be tempting to try to define, ahead of time, the “perfect schema” for all of your organization's data. Rather, what really makes a schema valuable is the degree to which it follows actual user requirements, which are never known perfectly up front and are constantly changing. The true path to the “perfect schema” is to make it easy for the graph to evolve in response to actual needs.

Fields shouldn't be added to the schema speculatively. Ideally, each field should be added only in response to a concrete need by a consumer for additional functionality, while being designed for maximum reuse by other consumers that have similar needs.

Updating the graph should be a continuous process. Rather than releasing a new “version” of the graph periodically, such as every 6 or 12 months, it should be possible to change the graph many times a day if necessary. New fields can be added at any time. To remove a field, first deprecate it, and then remove it when consumers are no longer using it. The schema registry enables this agile evolution of the graph, together with processes and tooling that keep everyone aware of changes that could affect them. This ensures that only fully vetted changes can go into production.

## 6. Iteratively Improve Performance

> Performance management should be a **continuous, data-driven process**, adapting smoothly to changing query loads and service implementations.

The data graph layer is the right place to hold the conversation about performance and capacity that always must occur between services teams and the app developers that consume their services. This conversation should be an ongoing process that gives service developers continuous and proactive visibility into what consumers intend to do with their services.

Rather than optimizing every possible use of the graph, the focus should be on supporting the actual query shapes that are needed in production. Tooling should extract proposed new query shapes and surface them, before they go into production, to all affected service teams with latency requirements and projected query volume. Once the query is in production, its performance should be continuously monitored. If this principle is followed, problems should be easy to track back to the service that is not behaving as expected.

## 7. Use Graph Metadata to Empower Developers

> Developers should be equipped with **rich awareness of the graph** throughout the entire development process.

A major part of GraphQL's value is the massive productivity boost that it gives to developers. To maximize this boost, a developer's tooling should give them ubiquitous awareness of the data graph, threaded through all of the tools that they use throughout the entire development lifecycle.

Whenever a developer is doing work that relates to managing data or connecting to services, their tooling should put live information about the graph at their fingertips. This information should always be up-to-date and the tooling should be highly intelligent, applying graph awareness to the situation at hand in helpful and powerful ways. When done properly, not only does developer productivity and happiness increase, but GraphQL becomes the fabric that connects the frontend and backend teams, enabling seamless conversations throughout the development lifecycle.

Some practical examples of the power of data-graph-aware tooling include:

* Developers can enjoy live documentation of all available graph data and services, right in their editor and always up-to-date.
* Information about deprecated fields can be broadcast into the editors of developers using those fields, together with suggested alternatives
* The estimated cost of a query (in latency or server resources) can be shown to a developer as they're typing it, based on live production data.
* The operations team can trace load on backend services back to a particular app, version, feature, and even line of code, giving them full visibility into how developers are using their service.
* When a service developer makes a change to their schema, the impact of that change can automatically be determined as part of the continuous integration process. If the change would break existing clients (as determined by replaying recent production usage), then the service developer can determine the precise clients, versions, and developers that will be affected.
* As app developers are building features, the new queries that power those features can be extracted from their code and shared with the operations team. With this awareness, the operations team can proactively provision the needed capacity and interject early in the development process if the query can't be approved at the intended scale.
* When apps are developed in a typed language like TypeScript, Java, or Swift, type information can be propagated all the way from service type declarations through every line of code in the app, ensuring fullstack type correctness and instant feedback on errors.

<!-- end -->
