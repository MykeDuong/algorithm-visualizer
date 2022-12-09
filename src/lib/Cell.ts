export enum Role {
  Start = "Start",
  Destination = "Destination",
  Normal = "Normal"
}

export enum Status {
  Unvisited = "Unvisited",
  Visited = "Visited",
  Visiting = "Visiting",
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