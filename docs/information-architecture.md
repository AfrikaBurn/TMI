# Blue Sky Information Architecture

An organisation wide blue sky system analysis (and a few prototypes down the 
line) revealed the underlying entities and relationships:

![ERD](./svg/Entity-Relationship-Diagram.svg)

Which could be normalised down to:

## People

> Store and protect community data.
> Represent, connect and collect participants.

The people subsystem is intended to store participant's user login, profile,
agreement, collective and post data in a secure manner that protects and
enforces access and privacy so that other subsystems may access data in a
simple unified and permissable manner.


### Entities and Relationships

![Entity Relationships](./svg/People-Entity-Relationships.svg)


### Entity classes

![Entity Classes](./svg/People-Entity-Classes.svg)


## Tribe

The tribe subsystem is intended to be the social networking interface between
participants that they may find and connect with other participants and share
resources.


## Projects

> Create and collaborate.

The projects subsystem is intended to facilitate project publishing so that
participants may inform communities to enable collaboration.

![Entity Classes](./svg/Projects-Entity-Classes.svg)


## Events

> Schedule, coordinate, volunteer and participate.

The projects subsystem is intended to facilitate event publishing so that
participants may rally communities to plan and participate.

![Entity Classes](./svg/Events-Entity-Classes.svg)


## Incidents

> Incident logging, dissemination and escalation.

The incident subsystem is intended to manage incidents so that collectives may
be informed and responsive to incidents as they occur.

![Entity Classes](./svg/Incidents-Entity-Classes.svg)


## Inventory

> Manage, track and trace assets and inventory.

The inventory subsystem is intended to keep track of collective resources so
that they may be effectively shared and maintained.

![Inventory wireframes](./svg/Inventory-Entity-Classes.svg)


## Web

> Educate, inform and promote.

The website subsystem is intended to allow participants to educate, inform and
promote projects, collectives, initiatives and events to the outside world so
that they may grow their community.

![Entity Classes](./svg/Web-Entity-Classes.svg)