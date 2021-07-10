# TMI Components

The components we've identified as candidate systems are open source, may be
self hosted and even altered and/or skinned as required. If you know of software
better suited to each purpose, please shout!

## Containerisation

These systems are containerised using [Docker](https://docker.io) with all of
their configuration and data externalised from those containers to ensure
portability and the ability to backup conveniently.

## Port Assignment

To enable all systems to be run on the same machine, ports have been assigned to
each system. Each category has an assigned range:


| Category  | Range         | System          | Range         | Component                                                                     | Port  |
| --        | --            | --              | --            | --                                                                            | --    |
| Access    | 11000 - 19999
|           |               | Token           | 11000 - 11999 | [Keycloak](https://www.keycloak.org)                                          | 11010 |
|           |               |                 |               | [OpenLDAP](https://www.openldap.org)                                          | 11020 |
|           |               |                 |               | [phpLDAPadmin](http://phpldapadmin.sourceforge.net/wiki/index.php/Main_Page)  | 11030 |
|           |               | Wiki            | 12000 - 12999 | [WikiMedia](https://www.wikimedia.org/)                                       | 11040 |
|           |               | Web             | 11000 - 11999 | [Dupal](https://drupal.org)                                                   | 11050 |
| Bio       | 21000 - 22999 |                 | 21000 - 21999
|           |               | Decide          |               | [Loomio](https://www.loomio.org)                                              | 21000 |
|           |               | Learn           |               | [Moodle](https://moodle.org)                                                  | 21010 |
|           |               |                 |               | [h5p](https://h5p.org)                                                        | 21020 |
|           |               | Volunteer       |               | [Volunteers](https://github.com/playasoft/volunteers)                         | 21030 |
| Personae  | 23000 - 23999 |
|           |               | Chat            |               | [RocketChat](https://rocket.chat)                                             | 31000 |
|           |               | Huddle          |               | [Jitsi](https://www.jitsi.org)                                                | 31010 |
|           |               | Stream          |               | [MediaGoblin](http://mediagoblin.org)                                         | 31020 |
| Projects  | 41000 - 41999 |
|           |               | Cloud           | 41000 - 41999 | [NextCloud](https://nextcloud.org)                                            | 41000 |
|           |               | Inventory       | 42000 - 42999 | [PartKeepr](https://partkeepr.org)                                            | 41020 |
|           |               | Manage          | 43000 - 43999 | [OpenProject](https://www.openproject.org)                                    | 41030 |
| Internal Systems
|           |               | Proxy           |               | [NGINX](https://www.https://www.nginx.com/)                                   |80, 443|
|           |               | Version control |
