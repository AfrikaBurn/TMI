# TMI Components


## Orchestration

Systems are containerised using [Docker](https://docker.io), managed by [Swarmpit](https://swarmpit.io).

## Port Assignment

To enable all systems to be run on the same machine, ports have been assigned to
each system. Each category has an assigned range:


| Category  | Range         | System    | Range         | Component                                                                     | Port  |
| --        | --            | --        | --            | --                                                                            | --    |
| Access    | 11000 - 19999 | Token     | 11000 - 11999 | [OpenLDAP](https://www.openldap.org)                                          | 11010 |
|           |               |           |               | [phpLDAPadmin](http://phpldapadmin.sourceforge.net/wiki/index.php/Main_Page)  | 11020 |
|           |               |           |               | [Keycloak](https://www.keycloak.org)                                          | 11030 |
|           |               | Wiki      | 12000 - 12999 |
|           |               | Web       | 11000 - 11999 |
| Bio       | 21000 - 22999 |
|           |               | Decide    | 21000 - 21999 | [Loomio](https://www.loomio.org)                                              | 21010 |
|           |               |           |               |                                                                               | 21020 |
|           |               | Learn     | 22000 - 22999 |
|           |               | Volunteer | 23000 - 23999 |
| Personae  | 23000 - 23999 |
|           |               | Chat      | 31000 - 31999 |
|           |               | Huddle    | 32000 - 32999 |
|           |               | Stream    |
| Projects  | 41000 - 41999 |
|           |               | Learn     | 41000 - 41999 |
|           |               | Decide    | 42000 - 42999 |
|           |               | Volunteer | 43000 - 43999 |
|           |               |           |               |
