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

  setDestination() {
    this.role = Role.Destination
  }

  setStatus(status: Status) {
    this.status = status;
  }

  reset() {
    this.status = Status.Unvisited;
  }
}