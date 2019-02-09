---
path: /operations
title: Operations
order: 3
image: ../images/operations.png
---

## 8. Access and Demand Control

Grant access to the graph on a *per-client basis*, and manage not just what a client can access but *how* they can access it.

Authorization in a data graph has two equally important aspects: access control, which dictates which objects and fields a user is allowed to access, and demand control, which dictates how (and how much) the user is allowed to access those resources. While everyone is familiar with access control, thought needs to be given to demand control as it is critical in any production deployment of GraphQL. It is a mistake to allow users to perform any possible query regardless of cost, with no ability to manage the impact of this on production systems. And both access and demand control must be done with full awareness of the semantics and performance of the data graph. It's not sufficient to limit a user to particular number of queries per minute without an analysis of the queries actually being sent, as a query could access a wide universe of services and the cost of a query can vary over multiple orders of magnitude.

Authentication in a data graph also has two aspects: the app that is requesting the operation, and the person that is using the app. While access control may center on the person using the app, proper demand control depends at least as much on per-app controls as it does on per-person controls, as it is the developer of the app, not the user of the app, that is responsible for the particular query shapes that the app uses to do its job.

Best practices for demand control include:

* When untrusted users are accessing production systems, limiting them, whenever possible, to queries that have been preregistered by the (authenticated) developer of the app that they are using, rather than allowing them to use the app's credentials to send arbitrary queries. (This is sometimes relaxed for internal apps that are distributed only to trusted users.)
* For apps that are expected to send large numbers of queries, designing a query approval workflow, aligned with the broader software development cycle, to vet queries before they go into production, ensuring that they do not fetch unnecessary data and that server capacity is available to support them.
* As a second line of defense, estimating the cost of a query before performing it and instituting per-user and per-app query cost budgets, either to protect against over-use of preregistered operations or in cases where operation preregistration is not possible.
* Providing the ability, in production, to disable the ability of particular apps to send particular queries, as a safety net in emergencies or if a third party app is initially permitted but later found to be using the data graph in unacceptable ways.

## 9. Structured Logging

Capture *structured logs* of all graph operations and leverage them as the primary tool for understanding graph usage.

A wealth of information can be captured about each operation (read or write) that is performed on a graph: what user and app performed the operation, what fields were accessed, how the operation was actually executed, how it performed, and more. This information is highly valuable and should be systematically captured and made available for later use. And it should be captured not as a text log, but in a structured, machine readable format so that it can be leveraged for as many purposes as possible.

The record of a graph operation is called a *trace*. A trace should bring together in one place all pertinent information about an operation, both business information (who performed the operation, what was accessed or changed, when, where, through which feature of which app built by which developer, whether it succeeded, how it performed) and purely technical information (which backend services were contacted, how each service contributed to latency, whether caches were used, and so on). 

Because traces truly capture how a graph is being used, they can be used for a wide range of purposes:

* Understanding whether a deprecated field can be removed, or if not, the specific clients that are still accessing it and how important they are
* Predicting how long a query will take to execute – in realtime, as the developer is typing the query in their IDE – based on live production data
* Automatically detecting problems in production (such as increased latency or error rates) and diagnosing their root cause
* Providing an authoritative audit trail showing which users have accessed a particular record
* Powering business intelligence queries (do people search for ice cream more often when it is hot where they are?)
* Generating invoices for partners based on API usage, with the possibility of a detailed cost model based on either the particular fields accessed or the resources consumed

Traces for all graph operations should be collected in one central place, so that there is one authoritative stream of traces. This stream can then be piped into other observability systems (perhaps after a simple transformation for existing systems that are not GraphQL-aware), or stored in one or more data warehouses for later use (aggregated and sampled as budget, use cases, and scale require). 

## 10. Separate the GraphQL layer from the Service Layer

Adopt a *layered architecture* with data graph functionality broken into a separate tier rather than baked into every service.

In most API technologies, clients do not talk directly to servers, except possibility in development. Instead a layered approach is adopted in which some concerns such as load balancing, caching, service location, or API key management are split into a separate tier. This tier can then be designed, operated, and scaled separately from the backend services.

It's no different with GraphQL. Rather than baking all of the functionality needed for a complete data graph system into each and every service, most data graph functionality should be factored out into a separate tier that sits in between clients and services, leaving each service to focus on serving the actual client request. This tier, which can be composed of multiple processes, performs functions such as access and demand control, federation, trace collection, and potentially caching. Some parts of this tier will be GraphQL-specific and require deep awareness of the data graph, while other functions such as load balancing and client authentication can likely be performed by systems that are already in place.

This separate tier is valuable even in simple scenarios with only one app and only one service, because otherwise much functionality that properly belongs in the middle tier will have to be implemented in the server. In complex applications, this tier may start to look like a geographically distributed system, receiving incoming queries through multiple ingress points, processing some of them potentially on the edge of the network with the benefit of edge caches, then routing the various subcomponents of the queries to multiple data centers whether in the public cloud, privately operated, or operated by partners, and finally assembling these components into a query result, and recording a trace that memorializes the entire operation.

In some cases this data graph tier will talk to the backend services using GraphQL. But, most frequently, the backend services are left untouched and continue to be accessed by their existing APIs, such as REST, SOAP, gRPC, Thrift, or even SQL, with the mapping from these APIs to data graph objects accomplished by servers that form one part of the data graph tier.

<!-- end -->
