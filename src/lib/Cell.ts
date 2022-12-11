export enum Role {
  Start = "Start",
  Destination = "Destination",
  Block = "Block",
  Normal = "Normal"
}

export enum Status {
  Unvisited = "Unvisited",
  Visited = "Visited",
  Visiting = "Visiting",
  Path = "Path",
}

export default class CellModel {
  status: Status;
  role: Role

  constructor() {
    this.status = Status.Unvisited;
    this.role = Role.Normal
  }

  setStart() {
    this.role = Role.Start
  }

  setRole(r: Role) {
    this.role = r;
  } 

  setDestination() {
    this.role = Role.Destination
  }

  setStatus(status: Status) {
    this.status = status;
  }

  clean() {
    this.status = Status.Unvisited;
  }

  reset() {
    this.clean();
    if (this.role === Role.Block) {
      this.role = Role.Normal;
    }
  }
}