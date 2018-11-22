import { Component, OnInit, Input } from '@angular/core';
import { UserService } from '../../services/user.service'


@Component(
  {
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.css']
  }
)


export class UserComponent implements OnInit {

  @Input() config: any
  users = false
  position = false
  schema= false

  displayedColumns = [
    'status',
    'username',
    'email',
    'action',
    'volatile-action'
  ];

  currentEdit = {
    id: false,
    field: false
  }
  changed = {}
  anyChanged = false

  constructor(private userService: UserService) { }

  ngOnInit() {

    this.userService.list(
      this.config,
      users => this.users = users
    )

    this.userService.position(
      this.config,
      position => this.position = position
    )

    this.userService.schema(
      this.config,
      schema => this.schema = schema
    )
  }

  edit(id, field){
    this.currentEdit.id = id
    this.currentEdit.field = field
  }

  change(id){
    this.changed[id] = true
    this.anyChanged = true
  }

  done(){
    this.currentEdit.id = false
    this.currentEdit.field = false
  }

  editing(id, field){
    return id == this.currentEdit.id && field == this.currentEdit.field
  }
}
